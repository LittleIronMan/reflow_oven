#include "nrc-money-logic.h"
#include "nrc-safe-uart.h" // UART_RECEIVE_BUF_SIZE, UART_TRANSMIT_BUF_SIZE
#include "nrc-print.h"
#include <string.h> // memcpy
#include <stdbool.h>

#include "FreeRTOS.h"
#include "timers.h"

// protocol buffers
#include "reflow_oven.pb.h"
#include "pb_encode.h"
#include "pb_decode.h"

#include "pid.h"

#ifdef NRC_TEST
#include "nrc-test.h"
#endif

#ifdef NRC_WINDOWS_SIMULATOR
#include <windows.h>
#define osDelay(millisec) vTaskDelay(millisec)
#elif NRC_STM32
#include "main.h"
#include "cmsis_os.h"
#endif

volatile bool allowSyncTime = true;
#define kTimeOfBirthOfAuthorThisCode 1571309224
PB_Time prevTime = { kTimeOfBirthOfAuthorThisCode, 0 }; // временем по умолчанию будет приблизительное время рождения автора этого кода, а то нуль это как-то скучно
uint32_t prevTickCount = 0;

TaskHandle_t pidControllerTaskHandle = NULL,
			cmdManagerTaskHandle = NULL,
			msgReceiverTaskHandle = NULL,
			msgSenderTaskHandle = NULL;

#define NRC_NULL_TIME ((PB_Time){0, 0})

#define roomTemp 26.0f // комнатная тепература, ниже неё печка не сможет охладиться

NRC_GlobalData g = {
	.lastIterationTime = 0,
	.fControlDataMutex = NULL
};

PB_ControlData* automaticModes[] = { &g.fControlData.data[0], &g.fControlData.data[1] };
#define countAutomaticModes (sizeof(automaticModes)/sizeof(PB_ControlData*))

PID_Data pidData = {
	.lastProcessValue = 0.0f,
	.integralErr = 0.0f,
	.Kp = 100.0f,
	.Ti = 1000000.0f,
	.Td = 0.1f
};

// соответствующие массивы
uint8_t RxArr[UART_RECEIVE_BUF_SIZE]; // массив с принятыми и упакованными данными
uint8_t TxArr[UART_TRANSMIT_BUF_SIZE]; // массив для буфера ПЕРЕДАЧИ данных
uint8_t RxDmaArr[UART_RECEIVE_BUF_SIZE / 2]; // массив для циклического буфера ПРИЕМА данных по uart
NrcUartBufBeta RxBuf = { RxArr, UART_RECEIVE_BUF_SIZE, 0, BufState_USED_BY_HARDWARE },
				TxBuf = { TxArr, UART_TRANSMIT_BUF_SIZE, 0, BufState_USED_BY_PROC };
NrcUartBufAlpha dmaRxBuf = { RxDmaArr, UART_RECEIVE_BUF_SIZE / 2, UART_RECEIVE_BUF_SIZE / 2};
nrc_defineSemaphore(TxBufSem); // семафор, блокирующий задачу отправки сообщений до тех пор пока не завершится предыдущая отправка

// очереди со входящими данными
#define NRC_INCOMING_QUEUES \
X(commandQueue, PB_Command, 3, PB_MsgType_CMD, PB_Command_fields) /* очередь входящих сообщений */

// очереди с исходящими данными(при отправке бОльший приоритет имеют те очереди, которые в начале этого списка)
#define NRC_OUTGOING_QUEUES \
X(switchOvenStateQueue, PB_SwitchOvenState, 2, PB_MsgType_SWITCH_OVEN_STATE, PB_SwitchOvenState_fields) /* очередь сообщений об изменении(переключении) состояния печки(вкл/выкл) */ \
X(fControlDataQueue, PB_FullControlData, 1, PB_MsgType_FULL_CONTROL_DATA, PB_FullControlData_fields) \
X(responseQueue, PB_Response, 3, PB_MsgType_RESPONSE, PB_Response_fields) /* очередь сообщений для отправки */ \
X(periodicMsgQueue, PB_PeriodicMessage, 3, PB_MsgType_PERIODIC_MESSAGE, PB_PeriodicMessage_fields) /* очередь измерений температуры для отправки */ \
X(getProfileQueue, PB_ResponseGetTempProfile, 1, PB_MsgType_RESPONSE_GET_TEMP_PROFILE, PB_ResponseGetTempProfile_fields)

// список всех очередей
#define NRC_ALL_QUEUES \
	NRC_INCOMING_QUEUES \
	NRC_OUTGOING_QUEUES

// определение всех очередей и массивов к ним
#define X(a1,a2,a3,a4,a5) NRC_INIT_QUEUE(a1,a2,a3,a4,a5)
NRC_ALL_QUEUES
#undef X

#define X(aQueueName, ...) &aQueueName,
NRC_Queue *const allQueues[] = { NRC_ALL_QUEUES }; // массив всех очередей
NRC_Queue *const outgoingQueues[] = { NRC_OUTGOING_QUEUES };
#undef X
#define allQueuesCount (sizeof(allQueues) / sizeof(NRC_Queue*))
#define outgoingQueuesCount (sizeof(outgoingQueues) / sizeof(NRC_Queue*))

//nrc_defineSemaphore(termometerMutex);

xTimerHandle tempMeasureTimerHandle;
uint32_t timerPeriod = 500 / NRC_TIME_ACCELERATION;

#ifdef NRC_WINDOWS_SIMULATOR
// некоторые вспомогательные данные для симулятора
PB_Time simulator_prevTempMeasureTime = { 0, 0 }; // время предыдущего замера температуры
float simulator_prevTemp = -1.0f; // величина предыдущего замера температуры
float simulator_prevV = 0.0f; // предыдущая скорость изменения температуры(V это velocity, заранее прошу прощения за неясность)
#endif


void timerFunc(xTimerHandle xTimer) {
	// nrcLogD("Temp measure timer callback");
	xTaskNotifyGive(pidControllerTaskHandle);
	// xTimerChangePeriod(xTimer, uiAutoReloadTimerPeriod, 0);
}

void Oven_sendFullControlData()
{
	PB_FullControlData* response = (PB_FullControlData*)fControlDataQueue.dataBuf;
	*response = g.fControlData;
	bool success = addItemToQueue(&fControlDataQueue, (uint8_t*)response, 2, msgSenderTaskHandle);
}

// обработчик команд
void money_cmdManagerTask(void const *argument)
{
	nrcLogD("Start cmdManagerTask");

	static PB_Command cmd;
	static PB_Response response;
	static PB_Time currentTime;

	for (;;) {
		ulTaskNotifyTake(pdFALSE, portMAX_DELAY);

		if (!commandQueue.firstItem) {
			continue;
		}
		popItemFromQueue(&commandQueue, (uint8_t*)&cmd);
		nrcLogD("Money: handle command type %d, with id %d", cmd.cmdType, cmd.id);

		NRC_getTime(&currentTime, NULL);

		xSemaphoreTake(g.fControlDataMutex, portMAX_DELAY);

		switch (cmd.cmdType) {
		case PB_CmdType_STOP:
		case PB_CmdType_START_BG:
		case PB_CmdType_START:
		case PB_CmdType_PAUSE:
		case PB_CmdType_RESUME:
		case PB_CmdType_SET_TIME: {
			PB_ControlData* controlData = &g.fControlData.data[cmd.acmIdx];
			PB_ControlMode mode = PB_ControlMode_FOLLOW_TEMP_PROFILE + cmd.acmIdx;
			switch (cmd.cmdType) {
				case PB_CmdType_STOP:
					Oven_finishControlMode(mode);
					break;
				case PB_CmdType_START_BG:
					Oven_startControlMode(mode, true);
					break;
				case PB_CmdType_START:
					Oven_startControlMode(mode, false);
					break;
				case PB_CmdType_PAUSE:
					if (controlData->controlState != PB_ControlState_DISABLED) {
						controlData->isPaused = true;
					}
					break;
				case PB_CmdType_RESUME:
					if (controlData->controlState != PB_ControlState_DISABLED) {
						controlData->isPaused = false;
						// при выходе из состояния paused пересчитываем startTime
						controlData->startTime = NRC_getTimeDiff(&currentTime, &controlData->elapsedTime);
					}
					break;
				case PB_CmdType_SET_TIME:
					if (controlData->controlState != PB_ControlState_DISABLED) {
						controlData->elapsedTime = (PB_Time){cmd.value, controlData->startTime.mills};
					}
					break;
			}
			Oven_sendFullControlData();
			break;
		}
		case PB_CmdType_SET_CONST_TEMP:
			g.fControlData.constTempValue = cmd.value;
			Oven_sendFullControlData();

		case PB_CmdType_GET_ALL_INFO: {
			// отправляем данные о всех видах управления
			Oven_sendFullControlData();

			// отправляем термопрофиль
			PB_ResponseGetTempProfile* response2 = (PB_ResponseGetTempProfile*)getProfileQueue.dataBuf;
			response2->success = true;
			response2->profile = g.tempProfile;
			bool success = addItemToQueue(&getProfileQueue, (uint8_t*)response2, 2, msgSenderTaskHandle);
			break;
		}
		case PB_CmdType_CLIENT_REQUIRES_RESET: {
			Oven_setState(PB_OvenState_OFF);
			Oven_finishControlMode(g.fControlData.leadControlMode);
			Oven_setDefaultFullControlData(&g.fControlData);
#ifdef NRC_WINDOWS_SIMULATOR
			simulator_prevTempMeasureTime = NRC_NULL_TIME;
			simulator_prevTemp = -1.0f;
			simulator_prevV = 0.0f;
#endif
			pidData.lastProcessValue = 0.0f;
			pidData.integralErr = 0.0f;

			response = (PB_Response){
				.cmdType = cmd.cmdType,
				.cmdId = cmd.id,
				.success = true,
				.ovenState = g.fControlData.ovenState,
				.error = PB_ErrorType_NONE,
				.time = currentTime
			};
			bool success = addItemToQueue(&responseQueue, (uint8_t*)&response, cmd.priority, msgSenderTaskHandle);
			Oven_sendFullControlData();
			break;
		}
		case PB_CmdType_MANUAL_ON:
		case PB_CmdType_MANUAL_KEEP_CURRENT:
		case PB_CmdType_MANUAL_OFF: {
			if (cmd.cmdType == PB_CmdType_MANUAL_OFF) { Oven_setState(PB_OvenState_OFF); }
			else if (cmd.cmdType == PB_CmdType_MANUAL_ON) { Oven_setState(PB_OvenState_ON); }
			// else - оставляем предыдущее состояние печки

			Oven_startControlMode(PB_ControlMode_MANUAL, false);

			Oven_sendFullControlData();
			break;
		}
		default: {
			// сразу посылаем ответ на команду
			response = (PB_Response){
				.cmdType = cmd.cmdType,
				.cmdId = cmd.id,
				.success = false,
				.ovenState = g.fControlData.ovenState,
				.error = PB_ErrorType_UNKNOWN_COMMAND,
				.time = NRC_NULL_TIME
			};
			bool success = addItemToQueue(&responseQueue, (uint8_t*)&response, cmd.priority, msgSenderTaskHandle);
			break;
		}
		}

		xSemaphoreGive(g.fControlDataMutex);
	}
}

// в штатном режиме ОС будет просто периодически измерять температуру
void money_pidControllerTask(void const *argument)
{
	static PB_Time currentTime, prevTime = {0, 0};

	for (;;)
	{
		ulTaskNotifyTake(pdTRUE, portMAX_DELAY);

		uint16_t receivedData = 0;
		uint8_t err = 0;
		float temp = Oven_getTemp(&receivedData, &err);
		
		if (err) {
			nrcLog("SPI Receive error, errcode == %u", err);
			Oven_setState(PB_OvenState_OFF);
		}
		else {
			//myPrint("Received data == %x", receivedData);
			uint8_t coupleDisconnected = (receivedData & ((uint16_t)(1 << 2)));				
			if (coupleDisconnected) {
				nrcLog("Disconnected termocouple");
				Oven_setState(PB_OvenState_OFF);
			}
			else {
				NRC_getTime(&currentTime, NULL);
				if (prevTime.unixSeconds == 0) { prevTime = currentTime; }

				bool allAutomaticModesDisabled = true;
				bool needSendFullControlData = false;

				xSemaphoreTake(g.fControlDataMutex, portMAX_DELAY);

				// пробегаемся по всем режимам управления
				for (PB_ControlMode mode = _PB_ControlMode_MIN + 1; mode <= _PB_ControlMode_MAX; mode++) {
					switch (mode) {
					case PB_ControlMode_FOLLOW_TEMP_PROFILE: {
						PB_ControlData* data = &g.fControlData.data[0];
						if (data->controlState == PB_ControlState_DISABLED) { continue; }
						allAutomaticModesDisabled = false;

						uint32_t millsSinceStart;

						if (!data->isPaused) {
							millsSinceStart = NRC_getTimeDiffInMills(&currentTime, &data->startTime);
							if (g.fControlData.strictMode) {
								static float waitTemp;
#define temperatureError 5.0f
								if (!g.fControlData.strictWaitEnabled) {
									// если следующая точка времени принадлежит другому отрезку термопрофиля,
									// и если при этом текущая реальная температура печки меньше чем идеальная(заданная),
									// то тормозим время(elapsedTime не увеличиваем) и ждем пока печь завершит нагревание на предыдущем отрезке профиля
									float prevTimePoint = (float)NRC_getTimeDiffInMills(&prevTime, &data->startTime) / 1000.0f;
									float curTimePoint = millsSinceStart / 1000.0f;
									if (prevTimePoint > 0 && curTimePoint > prevTimePoint&&
										curTimePoint < data->duration.unixSeconds)
									{
										for (uint8_t i = 0; i < g.tempProfile.countPoints; i++) {
											PB_TempMeasure* crossPoint = &g.tempProfile.data[i];
											if (prevTimePoint < crossPoint->time.unixSeconds) {
												if (curTimePoint >= crossPoint->time.unixSeconds) {
													// проверка что текущая температура значительно ниже заданной
													if (crossPoint->temp - temp > temperatureError) {
														g.fControlData.strictWaitEnabled = true;
														waitTemp = crossPoint->temp;
														// сохраняем время остановки в переменной elapsedTime
														data->elapsedTime = crossPoint->time;
														needSendFullControlData = true;
													}
												}
												break;
											}
										}
									}
								}
								else {
									// ожидание заданной температуры(в строгом режиме)
									if (waitTemp - temp < temperatureError) {
										// выходим из режима ожидания
										g.fControlData.strictWaitEnabled = false;
										// обновляем startTime исходя из сохраненной величины elapsedTime
										data->startTime = NRC_getTimeDiff(&currentTime, &data->elapsedTime);
										needSendFullControlData = true;
									}
								}
							}
						}

						if (data->isPaused || g.fControlData.strictWaitEnabled) {
							// если время приостановлено - рассчитываем millsSinceStart
							// исходя из последней сохраненной величины elapsedTime
							millsSinceStart = data->elapsedTime.unixSeconds * 1000 + data->elapsedTime.mills;
						}
						else {
							// если время не остановлено, обновляем величину elapsedTime
							data->elapsedTime.unixSeconds = millsSinceStart / 1000;
							data->elapsedTime.mills = millsSinceStart - data->elapsedTime.unixSeconds * 1000;
						}

						if (millsSinceStart > data->duration.unixSeconds * 1000) {
							Oven_finishControlMode(PB_ControlMode_FOLLOW_TEMP_PROFILE);
							Oven_sendFullControlData();
							nrcLogD("Heating program finished");
						}
						else if (data->controlState == PB_ControlState_ENABLED) {
							uint16_t millsSinceLastIteration = NRC_getTimeDiffInMills(&currentTime, &g.lastIterationTime);
							if (millsSinceLastIteration > 5000) { millsSinceLastIteration = 0; } // задержка больше 5 секунд неприемлема

							float setpoint = Oven_getInterpolatedTempProfileValue(&g.tempProfile, millsSinceStart);
							float control = pidController(&pidData, setpoint, temp, millsSinceLastIteration / 1000.0f);
							Oven_applyControl(control);

							nrcLogD("FTP Time %.2f, Temp %.2f, control %.2f", millsSinceStart / 1000.0f, temp, control);
						}
						break;
					}
					case PB_ControlMode_HOLD_CONST_TEMP: {
						PB_ControlData* data = &g.fControlData.data[1];
						if (data->controlState == PB_ControlState_DISABLED) { continue; }
						allAutomaticModesDisabled = false;

						if (data->controlState == PB_ControlState_ENABLED) {
							uint16_t millsSinceLastIteration = NRC_getTimeDiffInMills(&currentTime, &g.lastIterationTime);
							if (millsSinceLastIteration > 5000) { millsSinceLastIteration = 0; } // задержка больше 5 секунд неприемлема

							float control = pidController(&pidData, g.fControlData.constTempValue, temp, millsSinceLastIteration / 1000.0f);
							Oven_applyControl(control);

							nrcLogD("HCT Temp %.2f, control %.2f", temp, control);
						}

						break;
					}
					case PB_ControlMode_MANUAL:
					default:
						break;
					}
				}
				xSemaphoreGive(g.fControlDataMutex);

				prevTime = currentTime;

				if (allAutomaticModesDisabled) {
					nrcLogD("Temp %.2f", temp);
				}

				PB_PeriodicMessage msg = {
					.tempMeasure = {currentTime, temp},
					.strictWaitEnabled = g.fControlData.strictWaitEnabled
				};
				addItemToQueue(&periodicMsgQueue, (uint8_t*)&msg, 1, msgSenderTaskHandle);

				if (needSendFullControlData) {
					Oven_sendFullControlData();
				}
			}
		}
	}
}

// задача - декодирует принятые данные и раскидывает их по очередям(например очередь команд)
void money_msgReceiverTask(void const *argument)
{
	nrcLogD("Start msgReceiver");

	static PB_Command RxCmd;

	for (;;) {
		uint32_t ulNotifiedValue = ulTaskNotifyTake(pdTRUE, portMAX_DELAY);

		RxBuf.state = BufState_USED_BY_PROC; // устанавливаем флаг того что сейчас буфер будет использоваться процессором

		PB_MsgType msgType = getMsgType(RxBuf.arr, RxBuf.countBytes);

		// сразу декодируем принятое сообщение, если удалось обнаружить его тип
		bool decodeStatus = false;
		if (msgType == PB_MsgType_UNDEFINED) {
			nrcLogD("Error: failed to define message type");
		}
		else if (msgType == PB_MsgType_CMD) {
			uint16_t encodedRxDataLen;
			uint8_t *pEncodedRxData = getMsgContent(RxBuf.arr, &encodedRxDataLen);
			pb_istream_t istream = pb_istream_from_buffer(pEncodedRxData, encodedRxDataLen);
			decodeStatus = pb_decode(&istream, PB_Command_fields, &RxCmd);
			if (!decodeStatus) {
				nrcLogD("Error: failed to decode command");
			}
		}

		// сбрасываем флаг, чтобы DMA-прерывания снова получили возможность обновлять RxBuf
		RxBuf.countBytes = 0;
		RxBuf.state = BufState_USED_BY_HARDWARE;

		// добавляем новую команду в очередь команд
		if (decodeStatus) {
			if (msgType == PB_MsgType_CMD) {
				bool success = addItemToQueue(&commandQueue, (uint8_t*)&RxCmd, RxCmd.priority, cmdManagerTaskHandle);
				if (!success){
					nrcLogD("Error: Failed to add command to queue");
				}
			}
			else {
				nrcLogD("Warning: unhandled message type");
			}
		}
	}
}

// задача которая сериализует данные для отправки, упаковывает их для последовательного протокола и, собственно, отправляет их с помощью DMA
void money_msgSenderTask(void const *argument)
{
	nrcLogD("Start msgSender");

	static uint8_t pbEncodedTxData[PB_ResponseGetTempProfile_size]; // буфер с protobuf-кодированными данными передаваемой структуры данных(но еще не упакованы для передачи)
	static uint8_t plainTxData[sizeof(PB_ResponseGetTempProfile)];

	for(;;) {
		ulTaskNotifyTake(pdFALSE, portMAX_DELAY);
		for (uint8_t i = 0; i < outgoingQueuesCount; i++) {
			NRC_Queue *const queue = outgoingQueues[i];

			if (!queue->firstItem) { continue; }

			popItemFromQueue(queue, plainTxData);

			pb_ostream_t ostream = pb_ostream_from_buffer(pbEncodedTxData, sizeof(pbEncodedTxData));
			bool status = pb_encode(&ostream, queue->protobufFields, plainTxData);
			if (status) {
				// ждем пока uart завершит передачу предыдущего сообщения
				xSemaphoreTake(TxBufSem, portMAX_DELAY);
				TxBuf.state = BufState_USED_BY_PROC;
				long result = transmitMsg(queue->msgType, pbEncodedTxData, ostream.bytes_written, TxBuf.arr);
				if (result == 0) {
					nrcLogD("Error sending data");
				}
				else {
					nrcLogV("Message successful transmitted");
				}
				#ifdef NRC_WINDOWS_SIMULATOR
				xSemaphoreGive(TxBufSem); // симулятор завершает оправку сообщения при вызове функции transmitMsg, поэтому семафор можно возвращать сразу
				#else
				// на реальном железе семафор освобождается в прерывании по завершению отправки
				#endif
			}

			break; // после отправке любого сообщения возвращаемся к семафору
		}
	}
}

// обработчик прерывания по приему очередной порции байт
// частично позаимствовано отсюда:
// https://github.com/akospasztor/stm32-dma-uart/blob/master/Src/main.c
void NRC_UART_RxEvent(NRC_UART_EventType event, uint16_t curCNDTR)
{
	uint16_t start, length;
	static bool RxUartDmaOveflow = false; // буфер приема переполнен(слишком большое сообщение), в этом случае дожидаемся конца приема и сбрасываем буфер

	/* Determine start position in DMA buffer based on previous CNDTR value */
	start = (dmaRxBuf.prevCNDTR < dmaRxBuf.size) ? (dmaRxBuf.size - dmaRxBuf.prevCNDTR) : 0;

	if (event == NRC_EVENT_TRANSFER_COMPLETED) {
		length = (dmaRxBuf.prevCNDTR < dmaRxBuf.size) ? (dmaRxBuf.prevCNDTR - curCNDTR) : (dmaRxBuf.size - curCNDTR);
		dmaRxBuf.prevCNDTR = curCNDTR;
	}
	else if (event == NRC_EVENT_HALF_BUF) { /* DMA Rx Half event */
		length = (dmaRxBuf.size >> 1) - start;
		dmaRxBuf.prevCNDTR = (dmaRxBuf.size >> 1);
	}
	else if (event == NRC_EVENT_FULL_BUF) { /* DMA Rx Complete event */
		length = dmaRxBuf.size - start;
		dmaRxBuf.prevCNDTR = dmaRxBuf.size;
	}
	nrcPrintfV("RxBuf.countBytes == %d, length == %d\n", RxBuf.countBytes, length);

	/* Copy and Process new data */
	if (RxBuf.state == BufState_USED_BY_HARDWARE) {
		if (RxBuf.countBytes + length <= RxBuf.size) {
			memcpy(&RxBuf.arr[RxBuf.countBytes], &dmaRxBuf.arr[start], length);
			RxBuf.countBytes += length;
		}
		else {
			RxUartDmaOveflow = true;
		}

		if (event == NRC_EVENT_TRANSFER_COMPLETED) {
			if (RxUartDmaOveflow) {
				// если по ходу передачи буфер был переполнен, то просто игнорируем принятые данные и ждем новых
				RxBuf.countBytes = 0;
				RxUartDmaOveflow = false;
			}
			else {
				vTaskNotifyGiveFromISR(msgReceiverTaskHandle, NULL); // буфером можно пользоваться
				nrcLogD("NRC_UART_RxEvent: Received %d bytes", RxBuf.countBytes);
			}
		}
	}
	else {
		// в этом месте данные безвовзратно теряются... такая вот драма
	}
}

// -------->>>> Windows - specific code <<<<--------
#ifdef NRC_WINDOWS_SIMULATOR

const uint32_t kReceiveIRQ_No = 31;
const uint32_t kTransmitIRQ_No = 30;
uint16_t windows_curCNDTR = 0;

// этот флаг запрещает IRQ_generator'у обновлять DMA-буфер,
// до тех пор пока не отработает IRQ_handler
bool dmaIRQ_lock = false;

DWORD WINAPI receiverIRQ_generator(LPVOID lpParameter)
{
	nrcLogD("Run receiverIRQ_generator");
	nrcLogD("Try create named pipe");
	// пример кода взят отсюда: https://stackoverflow.com/questions/26561604/create-named-pipe-c-windows
	HANDLE hPipe;
	LPTSTR pipename = TEXT("\\\\.\\pipe\\nrc_rx_pipe");
	hPipe = CreateNamedPipe(pipename,
		PIPE_ACCESS_INBOUND,		// read/write access
		PIPE_TYPE_BYTE |			// pipe type
		PIPE_READMODE_BYTE |		// pipe mode
		PIPE_WAIT |					// blocking mode
		(false ? FILE_FLAG_FIRST_PIPE_INSTANCE : 0), // is not needed but forces CreateNamedPipe(..) to fail if the pipe already exists...
		1,							// max. instances
		0,							// output buffer size
		UART_RECEIVE_BUF_SIZE,		// input buffer size
		NMPWAIT_USE_DEFAULT_WAIT,	// client time-out
		NULL);						// default security attribute

	if (hPipe == INVALID_HANDLE_VALUE) {
		nrcLogD("CreateNamedPipe failed, GLE=%d", GetLastError());
	}
	else {
		nrcLogD("Named pipe succesfull created");
	}

	while (hPipe != INVALID_HANDLE_VALUE) {
		if (ConnectNamedPipe(hPipe, NULL) != FALSE) { // wait for someone to connect to the pipe
			// заполняем псевдо-DMA - буфер
			BOOL readResult = TRUE;
			while (readResult) {
				if (dmaIRQ_lock) continue;
				uint16_t byteCounter = 0;
				readResult = ReadFile(hPipe, dmaRxBuf.arr, dmaRxBuf.size, &byteCounter, NULL);
				nrcLogD("receiverIRQ_generator - Received %d bytes", byteCounter);

				dmaIRQ_lock = true;
				windows_curCNDTR = dmaRxBuf.size - byteCounter;
				vPortGenerateSimulatedInterrupt(kReceiveIRQ_No);

				// выходим из этого цикла, если буфер заполнен неполностью(т.е. найден конец сообщения)
				if (byteCounter < dmaRxBuf.size) {
					break;
				}
			}
		}
		DisconnectNamedPipe(hPipe);
	}

	return 0;
}

uint32_t receiverIRQ_handler()
{
	// BaseType_t xHigherPriorityTaskWoken = pdFALSE;

	nrcLogD("receiverIRQ_handler start");
	NRC_UART_EventType type = NRC_EVENT_TRANSFER_COMPLETED;
	if (windows_curCNDTR == 0) { type = NRC_EVENT_FULL_BUF; }
	NRC_UART_RxEvent(type, windows_curCNDTR);
	dmaRxBuf.prevCNDTR = dmaRxBuf.size; // это делается только для windows
	dmaIRQ_lock = false;

	// portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}
#endif

void money_initReceiverIRQ()
{
#ifdef NRC_WINDOWS_SIMULATOR
	RxBuf.state = BufState_USED_BY_HARDWARE;
	SetThreadPriority(CreateThread(NULL, 0, receiverIRQ_generator, NULL, 0, NULL), THREAD_PRIORITY_ABOVE_NORMAL);
	vPortSetInterruptHandler(kReceiveIRQ_No, receiverIRQ_handler);
#else
	// настройка приема данных по uart
  // к этому моменту UART1 и DMA уже инициализированы и связаны друг с другом(через структуру hdma_usart1_rx),
  // все происходит в последнем вызове цепочки: 
  //	MX_USART1_UART_Init(...) => HAL_UART_Init(...) => HAL_UART_MspInit(...)
  // чтобы обрабатывать прерывания, нужно определить функции:
  //	HAL_UART_RxHalfCpltCallback, и HAL_UART_RxCpltCallback
  // притом функция HAL_UART_RxCpltCallback, будет вызываться еще и по прерыванию UART_IT_IDLE
  //	этот вызов добавлен в функцию USART1_IRQHandler в файле stm32f1xx_it.c
  __HAL_UART_ENABLE_IT(&huart1, UART_IT_IDLE);   // enable idle line interrupt
  //__HAL_DMA_DISABLE_IT(&huart1, DMA_IT_HT);  // disable uart half tx interrupt
  RxBuf.state = BufState_USED_BY_HARDWARE;
  HAL_UART_Receive_DMA(&huart1, dmaRxBuf.arr, dmaRxBuf.size);
#endif
}

float Oven_getTemp(uint16_t* receivedData, uint8_t *err)
{
	float temp;

	//xSemaphoreTake(termometerMutex, portMAX_DELAY);
#ifdef NRC_WINDOWS_SIMULATOR
	*err = 0;
	*receivedData = 0;

	PB_Time currentTime; NRC_getTime(&currentTime, NULL);
	float deltaTime = (simulator_prevTempMeasureTime.unixSeconds == 0 ? 0.0f : (NRC_getTimeDiffInMills(&currentTime, &simulator_prevTempMeasureTime) / 1000.0f));
	simulator_prevTempMeasureTime = currentTime;

#define maxVheating 1.5f // максимальная скорость нагревания(градусов в секунду)
#define minVcooling -2.0f // минимальная скорость изменения температуры при охлаждении(градусов в секунду)
#define dVheating 0.5f // "ускорение" температуры при НАГРЕВАНИИ, т.е. время равное изменению скорости нагревания от 0 до 1 грaдуса в секунду
#define dVcooling -0.5f // "ускорение" температуры при ОХЛАЖДЕНИИ
	if (deltaTime != 0.0f) {
		bool ovenIsHeating = (g.fControlData.ovenState == PB_OvenState_ON);
		float V = simulator_prevV; // скорость изменения температуры
		if (ovenIsHeating) {
			V = (simulator_prevV + (dVheating * deltaTime));
			if (V > maxVheating) { V = maxVheating; }
		}
		else {
			V = (simulator_prevV + (dVcooling * deltaTime));
			if (V < minVcooling) { V = minVcooling; }
		}
		simulator_prevV = V;

		temp = simulator_prevTemp + V * deltaTime;
		if (temp < roomTemp) { temp = roomTemp; simulator_prevV = 0.0f; } // температура не может стать ниже комнатной
	}
	else {
		temp = roomTemp; // при первом запуске этой функции в симуляторе - будет возвращена комнатная температура
	}
	simulator_prevTemp = temp;
#elif NRC_STM32
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
	*err = (uint8_t)HAL_SPI_Receive(&hspi3, (uint8_t*)receivedData, 1, HAL_MAX_DELAY);
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);
	temp = ((*receivedData >> 3) & 0xfff) * 0.25f;
#endif
	//xSemaphoreGive(termometerMutex);

	return temp;
}

void Oven_applyControl(float controlValue)
{
	if (controlValue > 1.0f) {
		Oven_setState(PB_OvenState_ON);
	}
	else if (controlValue < -1.0f) {
		Oven_setState(PB_OvenState_OFF);
	}
}

void Oven_setState(PB_OvenState newState)
{
#ifdef NRC_WINDOWS_SIMULATOR
#elif NRC_STM32
	if (newState == PB_OvenState_OFF) {
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_11, GPIO_PIN_RESET);
	}
	else {
		HAL_GPIO_WritePin(GPIOB, GPIO_PIN_11, GPIO_PIN_SET);
	}
#endif
	if (newState != g.fControlData.ovenState) {
		g.fControlData.ovenState = newState;

		// в случае изменения состояния печки - отправляем соответствующее сообщение серверу
		if (msgSenderTaskHandle == NULL) { return; }

		static PB_Time currentTime;
		NRC_getTime(&currentTime, NULL);
		static PB_SwitchOvenState newStateMsg;
		newStateMsg = (PB_SwitchOvenState) {
			.time = (PB_Time){currentTime.unixSeconds, currentTime.mills},
			.ovenState = newState
		};
		addItemToQueue(&switchOvenStateQueue, (uint8_t*)&newStateMsg, 0, msgSenderTaskHandle);
	}
}

void Oven_startControlMode(PB_ControlMode controlMode, bool startInBackground)
{
	const PB_ControlMode prevEnabledMode = g.fControlData.leadControlMode;
	// деактивируем текущий активный режим
	if (prevEnabledMode != PB_ControlMode_DEFAULT_OFF) {
		if (prevEnabledMode == PB_ControlMode_MANUAL) {
			// ручной режим управления особым образом выключать не нужно, достаточно изменить leadControlMode на другую величину
		}
		else if (!startInBackground) {
			// если до этого была включена какая-то автоматическая программа стабилизации температуры,
			// то она продолжит выполняться фоном(BACKGROUND_MODE т.е. время для неё продолжить тикать, но печка не будет переключаться)
			for (uint8_t i = 0; i < countAutomaticModes; i++) {
				PB_ControlData* data = automaticModes[i];
				if (prevEnabledMode == data->controlMode) {
					data->controlState = PB_ControlState_BACKGROUND;
					break;
				}
			}
		}
	}

	// активируем новый режим
	if (controlMode == PB_ControlMode_MANUAL) {
		g.fControlData.leadControlMode = PB_ControlMode_MANUAL;
	}
	else {
		for (uint8_t i = 0; i < countAutomaticModes; i++) {
			if (controlMode == automaticModes[i]->controlMode) {
				PB_ControlData* data = automaticModes[i];
				if (startInBackground) {
					data->controlState = PB_ControlState_BACKGROUND;
					if (prevEnabledMode == controlMode) {
						// если текущий активный режим переводим переводим в фоновый, то печку нужно выключить
						Oven_setState(PB_OvenState_OFF);
					}
				}
				else {
					data->controlState = PB_ControlState_ENABLED;
					NRC_getTime(&data->startTime, NULL);
					data->isPaused = false;
					data->elapsedTime = NRC_NULL_TIME;
					// сброс начальных данных ПИД регулятора перед включением
					g.lastIterationTime = data->startTime;
					pidData.lastProcessValue = 0.0f;
					pidData.integralErr = 0.0f;
					// делаем новый режим активным
					g.fControlData.leadControlMode = controlMode;
				}
				break;
			}
		}
	}
}

void Oven_finishControlMode(PB_ControlMode controlMode)
{
	// TODO: проверить, безопасно ли такое выключение. Могут ли другие задачи/таймеры/перывания это как-то прервать?

	if (controlMode == g.fControlData.leadControlMode) {
		// выключаем текущий активный режим
		g.fControlData.leadControlMode = PB_ControlMode_DEFAULT_OFF;
	}
	// если выключается какой-то из автоматических режимов, то нужно сбросить соответсвующую ему структуру данных
	for (uint8_t i = 0; i < countAutomaticModes; i++) {
		PB_ControlData* data = automaticModes[i];
		if (controlMode == data->controlMode) {
			data->controlState = PB_ControlState_DISABLED;
			data->isPaused = false;
			data->elapsedTime = NRC_NULL_TIME;

			break;
		}
	}
	Oven_setState(PB_OvenState_OFF);
}

void money_init()
{
#ifdef NRC_TEST
	nrc_testAll();
#endif

	// для всех очередей связываем их массив элементов(items) с массивом данных(dataBuf)
	// и создаем мютексы/семафоры
	for (uint8_t i = 0; i < allQueuesCount; i++) {
		NRC_Queue* queue = allQueues[i];
		for (uint8_t i = 0; i < queue->maxItemsCount; i++) {
			queue->items[i].data = &(queue->dataBuf[queue->itemDataSize * i]);
		}
		nrc_semaphoreCreateMutex(queue->mutex);
	}

	// инициализация буферов приема/передачи по uart
	nrc_semaphoreCreateBinary(TxBufSem);
	xSemaphoreGive(TxBufSem); // семафор для буфера передачи по умолчанию не занят

	nrc_semaphoreCreateMutex(g.fControlDataMutex);

	// задаем температурный профиль
	Oven_setDefaultTempProfile(&g.tempProfile);
	Oven_setDefaultFullControlData(&g.fControlData);

	nrc_timerCreate(tempMeasureTimer, timerPeriod, pdTRUE, 0, timerFunc);
	xTimerReset(tempMeasureTimerHandle, 0);

	//nrc_semaphoreCreateMutex(termometerMutex);
}

void money_initTasks()
{
	NRC_INIT_TASK(msgReceiver, ((336 + 60) / 2), 4);
	NRC_INIT_TASK(cmdManager, ((240 + 60) / 2), 3);
	NRC_INIT_TASK(pidController, ((240 + 60) / 2), 2);
	NRC_INIT_TASK(msgSender, ((208 + 100/*!!!*/ + 60) / 2), 1);

	PB_Response response = (PB_Response) {
		.cmdType = PB_CmdType_HARD_RESET,
		.cmdId = 0,
		.success = true,
		.ovenState = g.fControlData.ovenState,
		.error = PB_ErrorType_NONE,
		.time = NRC_NULL_TIME
	};
	addItemToQueue(&responseQueue, (uint8_t*)&response, 10, msgSenderTaskHandle);
}

bool addItemToQueue(NRC_Queue *queue, uint8_t *newData, uint8_t newPriority, TaskHandle_t taskToNotify)
{
	NRC_QueueItem *freePlace = NULL,
		*moreImportantItem = NULL,
		*iter;
	uint8_t i = 0;
	bool success = false, needUpdateCounter = false;

	xSemaphoreTake(queue->mutex, portMAX_DELAY); // очередь блокируется пока добавляется новый элемент

	// сначала ищем в буфере свободное место для нового элемента
	for (; i < queue->maxItemsCount; i++) {
		if (!queue->items[i].isActual) { freePlace = &queue->items[i]; needUpdateCounter = true; break; }
	}
	// затем ищем ближайший элемент с более высоким приоритетом
	for (iter = queue->firstItem; iter && iter->priority >= newPriority; iter = iter->next) {
		moreImportantItem = iter;
	}
	// если свободного места не было найдено, а итератор еще не в конце очереди
	if (!freePlace && iter) {
		for (; iter && iter->next; iter = iter->next) {} // ищем конец очереди
		freePlace = iter; // он будет перезаписан
	}

	// вставляем новый элемент, с обновлением соответствующих ссылок
	if (freePlace) {
		freePlace->priority = newPriority;
		if (freePlace->data != newData) {
			memcpy(freePlace->data, newData, queue->itemDataSize); // копируем данные
		}
		if (moreImportantItem) {
			freePlace->next = (moreImportantItem->next) ? (moreImportantItem->next->next) : NULL;
			moreImportantItem->next = freePlace;
		}
		else {
			freePlace->next = NULL;
			// обновляем голову очереди
			queue->firstItem = freePlace;
		}
		freePlace->isActual = true;
		if (needUpdateCounter) {
			xTaskNotifyGive(taskToNotify); // увеличиваем количество сообщений в очереди
		}
		success = true;
	}

	xSemaphoreGive(queue->mutex); // очередью снова можно пользоваться
	return success;
}

void popItemFromQueue(NRC_Queue *const queue, uint8_t *resultBuf)
{
	xSemaphoreTake(queue->mutex, portMAX_DELAY);

	memcpy(resultBuf, queue->firstItem->data, queue->itemDataSize);
	queue->firstItem->isActual = false;
	queue->firstItem = queue->firstItem->next;

	xSemaphoreGive(queue->mutex);
}

void NRC_getTime(PB_Time *time, uint32_t *argTickCount)
{
	static uint32_t tickCount, mills, seconds;

	if (argTickCount) { tickCount = *argTickCount; }
	else { tickCount = xTaskGetTickCount() * NRC_TIME_ACCELERATION; }

	allowSyncTime = false;

	if (prevTickCount <= tickCount) { mills = prevTime.mills + (tickCount - prevTickCount); }
	else { mills =  prevTime.mills + ((uint32_t)0xFFFFFFFF - prevTickCount) + tickCount + 1; }
	seconds = mills / 1000;
	time->mills = (mills - seconds * 1000);
	time->unixSeconds = prevTime.unixSeconds + seconds;
	prevTickCount = tickCount; // обновляем переменную lastTickCount каждый раз когда вызывается функция NRC_getTime()
	prevTime = *time;

	allowSyncTime = true;

	if (argTickCount) { *argTickCount = tickCount; }
}

// возвращает разницу между 2-мя временными метками в миллисекундах
long NRC_getTimeDiffInMills(PB_Time* time1, PB_Time* time2)
{
	return ((long)time1->unixSeconds - (long)time2->unixSeconds) * 1000 + ((long)time1->mills - time2->mills);
}

PB_Time NRC_getTimeDiff(PB_Time* time1, PB_Time* time2)
{
	PB_Time result = {time1->unixSeconds - time2->unixSeconds, time1->mills - time2->mills};
	while (result.mills < 0) {
		result.unixSeconds--;
		result.mills += 1000;
	}
	return result;
}

void Oven_setDefaultTempProfile(PB_TempProfile *profile)
{
	PB_TempMeasure* tp = profile->data; uint16_t lastTime = 0; uint8_t idx = 0;
#define NRC_SET_POINT(peroiodInSeconds,tempValue) lastTime += peroiodInSeconds; tp[idx] = (PB_TempMeasure) {{lastTime, 0}, tempValue}; idx++
	NRC_SET_POINT(0, 26);
	NRC_SET_POINT(70, 160); // за 60 секунд нагреть плату от 45 до 150 - 170 градусов
	NRC_SET_POINT(60, 160); // (растекание флюса) удерживать в таком состоянии 60 секунд
	NRC_SET_POINT(30, 195); // нагреть плату выше 183 градусов
	NRC_SET_POINT(45, 195); // (оплавление припоя) удерживать 45 + -15 секунд. Максимальная температура 215 + -5 градусов
	NRC_SET_POINT(50, 26); // остывать - не быстрее 4 градусов в секунду
	profile->countPoints = idx;
	// Итого 3 минуты + остывание(~50 секунд на открытом воздухе)s
}

void Oven_setDefaultFullControlData(PB_FullControlData *fControlData)
{
	*fControlData = (PB_FullControlData){
		.leadControlMode = PB_ControlMode_DEFAULT_OFF,
		.ovenState = PB_OvenState_OFF,
		.constTempValue = roomTemp,
		.strictMode = true,
		.strictWaitEnabled = false,
		.data = {
			{
				.controlMode = PB_ControlMode_FOLLOW_TEMP_PROFILE,
				.controlState = PB_ControlState_DISABLED,
				.isPaused = false,
				.startTime = 0,
				.elapsedTime = 0,
				.duration = (PB_Time){ g.tempProfile.data[g.tempProfile.countPoints - 1].time.unixSeconds, 0 }
			},
			{
				.controlMode = PB_ControlMode_HOLD_CONST_TEMP,
				.controlState = PB_ControlState_DISABLED,
				.isPaused = false,
				.startTime = 0,
				.elapsedTime = 0,
				.duration = 0
			}
		}
	};
}

float Oven_getInterpolatedTempProfileValue(PB_TempProfile *tp, uint32_t millsSinceStart /* время в миллисекундах с начала запуска программы */ )
{
	// эти переменные static только для того, чтобы не занимать 16 лишних байт в стеке
	static PB_TempMeasure *A, *B;
	static uint32_t A_time, B_time;

	if (millsSinceStart > tp->data[tp->countPoints - 1].time.unixSeconds * 1000) {
		return tp->data[tp->countPoints - 1].temp;
	}
	uint8_t i = 1;
	for (; i < tp->countPoints; i++) {
		if (tp->data[i].time.unixSeconds * 1000 > millsSinceStart) { break; }
	}
	A = &(tp->data[i - 1]);
	B = &(tp->data[i]);
	A_time = A->time.unixSeconds * 1000 + A->time.mills;
	B_time = B->time.unixSeconds * 1000 + B->time.mills;
	return (A->temp + ((millsSinceStart - A_time) / ((float)B_time - A_time)) * ((float)B->temp - A->temp));
}
