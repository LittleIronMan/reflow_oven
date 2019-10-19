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
#endif

volatile bool allowSyncTime = true;
#define kTimeOfBirthOfAuthorThisCode 1571309224
NRC_Time prevTime = { kTimeOfBirthOfAuthorThisCode, 0 }; // временем по умолчанию будет приблизительное время рождения автора этого кода, а то нуль это как-то скучно
uint32_t prevTickCount = 0;

NRC_ControlData cd = { PB_TempProfile_init_default, 0, PB_State_STOPPED, OvenState_TurnOFF};
PID_Data pidData = {0.0f, 0.0f, 1.0f /* пропорциональный */, 1.0f/* интегральный */, 1.0f/* дифференциальный */};

// соответствующие массивы
uint8_t RxArr[UART_RECEIVE_BUF_SIZE]; // массив с принятыми и упакованными данными
uint8_t TxArr[UART_TRANSMIT_BUF_SIZE]; // массив для буфера ПЕРЕДАЧИ данных
uint8_t RxDmaArr[UART_RECEIVE_BUF_SIZE / 2]; // массив для циклического буфера ПРИЕМА данных по uart
NrcUartBufBeta RxBuf = { RxArr, UART_RECEIVE_BUF_SIZE, 0, NULL, BufState_USED_BY_HARDWARE },
				TxBuf = { TxArr, UART_TRANSMIT_BUF_SIZE, 0, NULL, BufState_USED_BY_PROC };
NrcUartBufAlpha dmaRxBuf = { RxDmaArr, UART_RECEIVE_BUF_SIZE / 2, UART_RECEIVE_BUF_SIZE / 2};

// макрофункция для статического выделения памяти для очередей
#define NRC_CREATE_QUEUE(queueName,type,countItems,msgType,protobufFields) \
uint8_t queueName##DataBuf[sizeof(type) * (countItems)]; \
NRC_QueueItem queueName##ItemsBuf[(countItems)]; \
NRC_Queue queueName = { NULL, queueName##ItemsBuf, queueName##DataBuf, sizeof(type), (countItems), NULL, (msgType), protobufFields }

NRC_CREATE_QUEUE(commandQueue, PB_Command, 3, PB_MsgType_CMD, PB_Command_fields); // очередь входящих сообщений
NRC_CREATE_QUEUE(responseQueue, PB_Response, 3, PB_MsgType_RESPONSE, PB_Response_fields); // очередь сообщений для отправки
NRC_CREATE_QUEUE(tempMeasureQueue, PB_TempMeasure, 3, PB_MsgType_TEMP_MEASURE, PB_TempMeasure_fields); // очередь измерений температуры для отправки

// массив всех очередей
const NRC_Queue* allQueues[] = { &commandQueue, &responseQueue, &tempMeasureQueue };
#define allQueuesCount (sizeof(allQueues) / sizeof(NRC_Queue*))

// массив очередей с исходящими данными(при отправке бОльший приоритет имеют очереди в начале массива)
const NRC_Queue* outgoingQueues[] = { &responseQueue, &tempMeasureQueue };
#define outgoingQueuesCount (sizeof(outgoingQueues) / sizeof(NRC_Queue*))

xTimerHandle tempMeasureTimer;
uint32_t timerPeriod = 500 / NRC_TIME_ACCELERATION;
xSemaphoreHandle pidControllerTaskSem = NULL;
xSemaphoreHandle defaultTaskSem = NULL;
xSemaphoreHandle termometerMutex = NULL;

void timerFunc(xTimerHandle xTimer) {
	// nrcLogD("Temp measure timer callback");
	if (cd.state == PB_State_LAUNCHED) {
		xSemaphoreGive(pidControllerTaskSem);
	}
	else {
		xSemaphoreGive(defaultTaskSem);
	}
	// xTimerChangePeriod(xTimer, uiAutoReloadTimerPeriod, 0);
}

// обработчик команд
void money_cmdManagerTask(void const *argument)
{
	nrcLogD("Start cmdManagerTask");
	PB_Command cmd;
	for (;;) {
		xSemaphoreTake(semCounterIncomingMessages, portMAX_DELAY);

		do {
			if (!commandQueue.firstItem) {
				continue;
			}
			popItemFromQueue(&commandQueue, (uint8_t*)&cmd);
			nrcLogD("Money: handle command type %d, with id %d", cmd.cmdType, cmd.id);
			if (cmd.cmdType == PB_CmdType_START) {
				// сброс начальных данных ПИД регулятора
				NRC_getTime(&cd.startTime, NULL);
				cd.lastIterationTime = cd.startTime;
				pidData.lastProcessValue = 0.0f;
				pidData.integralErr = 0.0f;
				cd.state = PB_State_LAUNCHED;
			}
			else if (cmd.cmdType == PB_CmdType_STOP) {
				Oven_finishHeatingProgram();
			}
			else {
				// сразу посылаем ответ на команду
				PB_Response response = { cmd.cmdType, cmd.id, true, cd.state, PB_ErrorType_NONE, 0 };
				bool success = addItemToQueue(&responseQueue, (uint8_t*)&response, cmd.priority, semCounterOutgoingMessages);
			}
		} while (false);
	}
}

void money_pidControllerTask(void const *argument)
{
	nrcLogD("Start pidControllerTask");
	for(;;) {
		xSemaphoreTake(pidControllerTaskSem, portMAX_DELAY);

		uint16_t receivedData = 0;
		uint8_t err = 0;
		float temp = Oven_getTemp(&receivedData, &err);
		
		if (err) {
			nrcLog("SPI Receive error, errcode == %u", err);
		}
		else {
			//myPrint("Received data == %x", receivedData);
			uint8_t coupleDisconnected = (receivedData & ((uint16_t)(1 << 2)));				
			if (coupleDisconnected) {
				nrcLog("Disconnected termocouple");
			}
			else {
				NRC_Time currentTime;
				NRC_getTime(&currentTime, NULL);
				uint32_t millsSinceStart = NRC_getTimeDiffInMills(&currentTime, &cd.startTime);
				if (millsSinceStart > cd.tempProfile.data[cd.tempProfile.countPoints - 1].time) {
					Oven_finishHeatingProgram();
					nrcLogD("Heating program finished");
				}
				else {
					uint16_t millsSinceLastIteration = NRC_getTimeDiffInMills(&currentTime, &cd.lastIterationTime);
					float setpoint = Oven_getInterpolatedTempProfileValue(&cd.tempProfile, millsSinceStart);
					float control = pidController(&pidData, setpoint, temp, millsSinceLastIteration / 1000.0f);
					Oven_applyControl(control);

					nrcLogD("Time %d, Temp %.2f, control %.2f", millsSinceStart, temp, control);
					PB_TempMeasure tempMeasure = { millsSinceStart, temp };
					addItemToQueue(&tempMeasureQueue, (uint8_t*)&tempMeasure, 1, semCounterOutgoingMessages);
				}
			}
		}
	}
}

// в штатном режиме ОС будет просто периодически измерять температуру
void money_defaultTask(void const *argument)
{
	for (;;)
	{
		xSemaphoreTake(defaultTaskSem, portMAX_DELAY);

		uint16_t receivedData = 0;
		uint8_t err = 0;
		float temp = Oven_getTemp(&receivedData, &err);
		
		if (err) {
			nrcLog("SPI Receive error, errcode == %u", err);
		}
		else {
			//myPrint("Received data == %x", receivedData);
			uint8_t coupleDisconnected = (receivedData & ((uint16_t)(1 << 2)));				
			if (coupleDisconnected) {
				nrcLog("Disconnected termocouple");
			}
			else {
				nrcLogD("Temp %.2f", temp);
				PB_TempMeasure tempMeasure = { 0, temp };
				addItemToQueue(&tempMeasureQueue, (uint8_t*)&tempMeasure, 1, semCounterOutgoingMessages);
			}
		}
	}
}

// задача - декодирует принятые данные и раскидывает их по очередям(например очередь команд)
void money_taskMsgReceiver(void const *argument)
{
	PB_Command RxCmd;
	nrcLogD("Start msgReceiver");
	for (;;) {
		xSemaphoreTake(RxBuf.sem, portMAX_DELAY);
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
				bool success = addItemToQueue(&commandQueue, (uint8_t*)&RxCmd, RxCmd.priority, semCounterIncomingMessages);
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
void money_taskMsgSender(void const *argument)
{
	nrcLogD("Start msgSender");

	static uint8_t pbEncodedTxData[NRC_MAX(PB_Response_size, PB_TempMeasure_size)]; // буфер с protobuf-кодированными данными передаваемой структуры данных(но еще не упакованы для передачи)
	static uint8_t plainTxData[NRC_MAX(sizeof(PB_Response), sizeof(PB_TempMeasure))];

	for(;;) {
		xSemaphoreTake(semCounterOutgoingMessages, portMAX_DELAY);
		for (uint8_t i = 0; i < outgoingQueuesCount; i++) {
			NRC_Queue* queue = outgoingQueues[i];

			if (!queue->firstItem) { continue; }

			popItemFromQueue(queue, plainTxData);

			pb_ostream_t ostream = pb_ostream_from_buffer(pbEncodedTxData, sizeof(pbEncodedTxData));
			bool status = pb_encode(&ostream, queue->protobufFields, plainTxData);
			if (status) {
				// ждем пока uart завершит передачу предыдущего сообщения
				xSemaphoreTake(TxBuf.sem, portMAX_DELAY);
				TxBuf.state = BufState_USED_BY_PROC;
				long result = transmitMsg(queue->msgType, pbEncodedTxData, ostream.bytes_written, TxBuf.arr);
				if (result == 0) {
					nrcLogD("Error sending data");
				}
				else {
					nrcLogV("Message successful transmitted");
				}
				#ifdef NRC_WINDOWS_SIMULATOR
				xSemaphoreGive(TxBuf.sem); // симулятор завершает оправку сообщения при вызове функции transmitMsg, поэтому семафор можно возвращать сразу
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
				xSemaphoreGiveFromISR(RxBuf.sem, NULL); // буфером можно пользоваться
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
	BaseType_t xHigherPriorityTaskWoken = pdFALSE;

	nrcLogD("receiverIRQ_handler start");
	NRC_UART_EventType type = NRC_EVENT_TRANSFER_COMPLETED;
	if (windows_curCNDTR == 0) { type = NRC_EVENT_FULL_BUF; }
	NRC_UART_RxEvent(type, windows_curCNDTR);
	dmaRxBuf.prevCNDTR = dmaRxBuf.size; // это делается только для windows
	dmaIRQ_lock = false;

	portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}
#endif

void money_initReceiverIRQ()
{
#ifdef NRC_WINDOWS_SIMULATOR
	RxBuf.state = BufState_USED_BY_HARDWARE;
	SetThreadPriority(CreateThread(NULL, 0, receiverIRQ_generator, NULL, 0, NULL), THREAD_PRIORITY_ABOVE_NORMAL);
	vPortSetInterruptHandler(kReceiveIRQ_No, receiverIRQ_handler);
#endif
}

float Oven_getTemp(uint16_t* receivedData, uint8_t *err)
{
	float temp;

	xSemaphoreTake(termometerMutex, portMAX_DELAY);
#ifdef NRC_WINDOWS_SIMULATOR
	*err = 0;
	*receivedData = 0;

	static NRC_Time prevTempMeasureTime = { 0, 0 };
	NRC_Time currentTime; NRC_getTime(&currentTime, NULL);
	float deltaTime = (prevTempMeasureTime.unixSeconds == 0 ? 0.0f : (NRC_getTimeDiffInMills(&currentTime, &prevTempMeasureTime) / 1000.0f));
	prevTempMeasureTime = currentTime;

	static float prevTemp = -1.0f; // предыдущий замер температуры
	static float prevV = 0.0f; // предыдущая скорость изменения температуры
#define maxVheating 3.0f // максимальная скорость нагревания(градусов в секунду)
#define minVcooling -5.0f // минимальная скорость изменения температуры при охлаждении(градусов в секунду)
#define dVheating 1.0f // "ускорение" температуры при НАГРЕВАНИИ, т.е. время равное изменению скорости нагревания от 0 до 1 грaдуса в секунду
#define dVcooling -1.0f // "ускорение" температуры при ОХЛАЖДЕНИИ
#define roomTemp 26.0f // комнатная тепература, ниже неё печка не сможет охладиться
	if (deltaTime != 0.0f) {
		bool ovenIsHeating = (cd.ovenState == OvenState_TurnON);
		float V = prevV; // скорость изменения температуры
		if (ovenIsHeating) {
			V = (prevV + (dVheating * deltaTime));
			if (V > maxVheating) { V = maxVheating; }
		}
		else {
			V = (prevV + (dVcooling * deltaTime));
			if (V < minVcooling) { V = minVcooling; }
		}
		prevV = V;

		temp = prevTemp + V * deltaTime;
		if (temp < roomTemp) { temp = roomTemp; prevV = 0.0f; } // температура не может стать ниже комнатной
	}
	else {
		temp = roomTemp; // при первом запуске этой функции в симуляторе - будет возвращена комнатная температура
	}
	prevTemp = temp;
#elif NRC_STM32
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
	*err = (uint8_t)HAL_SPI_Receive(&hspi3, (uint8_t*)receivedData, 1, HAL_MAX_DELAY);
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);
	temp = ((*receivedData >> 3) & 0xfff) * 0.25f;
#endif
	xSemaphoreGive(termometerMutex);

	return temp;
}

void Oven_applyControl(float controlValue)
{
	if (controlValue > 1.0f) {
		Oven_setState(OvenState_TurnON);
	}
	else if (controlValue < -1.0f) {
		Oven_setState(OvenState_TurnOFF);
	}
}

void Oven_setState(OvenState newState)
{
#ifdef NRC_WINDOWS_SIMULATOR
#else
	TODO;
#endif
	cd.ovenState = newState;
}

void Oven_finishHeatingProgram()
{
	// TODO: проверить, безопасно ли такое выключение. Могут ли другие задачи/таймеры/перывания это как-то прервать?
	cd.state = PB_State_STOPPED;
	Oven_setState(OvenState_TurnOFF);
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
		queue->mutex = xSemaphoreCreateMutex();
	}

	// семафоры для входящих/исходящих сообщений
	semCounterIncomingMessages = xSemaphoreCreateCounting(10, 0);
	semCounterOutgoingMessages = xSemaphoreCreateCounting(10, 0);

	// инициализация буферов приема/передачи по uart
	RxBuf.sem = xSemaphoreCreateBinary();
	TxBuf.sem = xSemaphoreCreateBinary();
	xSemaphoreGive(TxBuf.sem); // семафор для буфера передачи по умолчанию не занят

	// задаем температурный профиль
	Oven_setDefaultTempProfile(&cd.tempProfile);

	// кодируем термопрофиль с помощью Protocol Buffers(nanopb)
	//uint8_t buffer[TempProfile_size];
	//pb_ostream_t ostream = pb_ostream_from_buffer(buffer, sizeof(buffer));
	//bool ostatus = pb_encode(&ostream, TempProfile_fields, &cd.tempProfile);

	//TempProfile inputMsg = TempProfile_init_default;
	//pb_istream_t istream = pb_istream_from_buffer(buffer, sizeof(buffer));
	//bool istatus = pb_decode(&istream, TempProfile_fields, &inputMsg);

	tempMeasureTimer = xTimerCreate("AutoReloadTimer", timerPeriod, pdTRUE, 0, timerFunc);
	xTimerReset(tempMeasureTimer, 0);
	pidControllerTaskSem = xSemaphoreCreateBinary();
	defaultTaskSem = xSemaphoreCreateBinary();
	termometerMutex = xSemaphoreCreateMutex();
}

bool addItemToQueue(NRC_Queue *queue, uint8_t *newData, uint8_t newPriority, xSemaphoreHandle semCounter)
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
		memcpy(freePlace->data, newData, queue->itemDataSize);
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
			xSemaphoreGive(semCounter); // увеличиваем количество сообщений в очереди
		}
		success = true;
	}

	xSemaphoreGive(queue->mutex); // очередью снова можно пользоваться
	return success;
}

void popItemFromQueue(NRC_Queue *queue, uint8_t *resultBuf)
{
	xSemaphoreTake(queue->mutex, portMAX_DELAY);

	memcpy(resultBuf, queue->firstItem->data, queue->itemDataSize);
	queue->firstItem->isActual = false;
	queue->firstItem = queue->firstItem->next;

	xSemaphoreGive(queue->mutex);
}

void NRC_getTime(NRC_Time *time, uint32_t *argTickCount)
{
	uint32_t tickCount, mills, seconds;

	if (argTickCount) { tickCount = *argTickCount; }
	else { tickCount = xTaskGetTickCount() * NRC_TIME_ACCELERATION; }

	allowSyncTime = false;

	if (prevTickCount < tickCount) { mills = prevTime.mills + (tickCount - prevTickCount); }
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
uint32_t NRC_getTimeDiffInMills(NRC_Time* time1, NRC_Time* time2)
{
	return (time1->unixSeconds - time2->unixSeconds) * 1000 + ((long)time1->mills - time2->mills);
}

void Oven_setDefaultTempProfile(PB_TempProfile *profile)
{
	PB_TempMeasure* tp = profile->data; uint16_t lastTime = 0; uint8_t idx = 0;
#define NRC_SET_POINT(peroiodInSeconds,tempValue) lastTime += peroiodInSeconds; tp[idx].time = lastTime * 1000; tp[idx].temp = tempValue; idx++
	NRC_SET_POINT(0, 26);
	NRC_SET_POINT(70, 160); // за 60 секунд нагреть плату от 45 до 150 - 170 градусов
	NRC_SET_POINT(60, 160); // (растекание флюса) удерживать в таком состоянии 60 секунд
	NRC_SET_POINT(30, 195); // нагреть плату выше 183 градусов
	NRC_SET_POINT(45, 195); // (оплавление припоя) удерживать 45 + -15 секунд. Максимальная температура 215 + -5 градусов
	NRC_SET_POINT(50, 26); // остывать - не быстрее 4 градусов в секунду
	profile->countPoints = idx;
	// Итого 3 минуты + остывание(~50 секунд на открытом воздухе)s
}

float Oven_getInterpolatedTempProfileValue(PB_TempProfile *tp, uint32_t time /* в миллисекундах */ )
{
	if (time > tp->data[tp->countPoints - 1].time) {
		return tp->data[tp->countPoints - 1].temp;
	}
	uint8_t i = 1;
	for (; i < tp->countPoints; i++) {
		if (tp->data[i].time > time) { break; }
	}
	PB_TempMeasure *A = &(tp->data[i - 1]),
		*B = &(tp->data[i]);
	return (A->temp + ((time - A->time) / ((float)B->time - A->time)) * ((float)B->temp - A->temp));
}
