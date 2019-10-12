#include "nrc-money-logic.h"
#include "nrc-safe-uart.h" // UART_RECEIVE_BUF_SIZE, UART_TRANSMIT_BUF_SIZE
#include "nrc-print.h"
#include <string.h> // memcpy
#include <stdbool.h>
#include "FreeRTOS.h"

// protocol buffers
#include "reflow_oven.pb.h"
#include "pb_encode.h"
#include "pb_decode.h"

#ifdef NRC_WINDOWS_SIMULATOR
#include <windows.h>
#define osDelay(millisec) vTaskDelay(millisec)
#endif

typedef enum {
	DISABLED,
	ENABLED,
	SAVE_DATA
} ControlState;

typedef struct {
	TempProfile tempProfile; // идеальный температурный профиль, к которому должна стремиться программа управления печью
	uint32_t startTime; // веремя начала программы
	ControlState state; // состояние программы управления
	uint32_t integral;
	uint16_t prevMeasure;
} NRC_ControlData;
NRC_ControlData cd;

NrcUartBufBeta RxBuf, TxBuf;
NrcUartBufAlpha dmaRxBuf;
// соответствующие массивы
uint8_t RxArr[UART_RECEIVE_BUF_SIZE];
uint8_t TxArr[UART_TRANSMIT_BUF_SIZE];
uint8_t RxDmaArr[UART_RECEIVE_BUF_SIZE / 2];
uint8_t msgBuf[UART_RECEIVE_BUF_SIZE - 8];

#define MAX_CMD_COUNT_IN_QUEUE 5
typedef struct _CmdEx {
	OvenCommand data;
	bool isActual;
	struct _CmdEx *next;
} CmdEx;
CmdEx commandQueueBuf[MAX_CMD_COUNT_IN_QUEUE];
CmdEx *cmdQueueFront = NULL, *cmdQueueBack = NULL;

bool addCommand(OvenCommand *newCmd) {
	CmdEx *freePlace = NULL,
		*moreImportantCmd = NULL,
		*iter;
	uint8_t i = 0;
	bool success = false;

	// сначала ищем в буфере свободное место для новой команды
	for (; i < MAX_CMD_COUNT_IN_QUEUE; i++) {
		if (!commandQueueBuf[i].isActual) { freePlace = &commandQueueBuf[i]; break; }
	}
	// затем ищем ближайшую команду с более высоким приоритетом
	for (iter = cmdQueueFront; iter && iter->data.priority >= newCmd->priority; iter = iter->next) {
		moreImportantCmd = iter;
	}
	// если свободного места не было найдено, а итератор еще не в конце очереди
	if (!freePlace && iter) {
		for (; iter && iter->next; iter = iter->next) {} // ищем конец очереди
		freePlace = iter; // он будет перезаписан
	}

	// вставляем новую команду, с обновлением соответствующих ссылок
	if (freePlace) {
		freePlace->data = *newCmd;
		if (moreImportantCmd) {
			freePlace->next = (moreImportantCmd->next) ? (moreImportantCmd->next->next) : NULL;
			moreImportantCmd->next = freePlace;
		}
		else {
			freePlace->next = NULL;
			// обновляем голову очереди
			cmdQueueFront = freePlace;
		}
		success = true;
	}
	return success;
}

OvenCommand popCmdFromQueue() {
	OvenCommand result = cmdQueueFront->data;
	cmdQueueFront->isActual = false;
	cmdQueueFront = cmdQueueFront->next;
	return result;
}

void money_init()
{
	// инициализация буферов приема/передачи по uart
	RxBuf.arr = RxArr; RxBuf.size = UART_RECEIVE_BUF_SIZE; RxBuf.state = BufState_NEED_UPDATE; RxBuf.countBytes = 0; RxBuf.sem = xSemaphoreCreateBinary();
	TxBuf.arr = TxArr; TxBuf.size = UART_TRANSMIT_BUF_SIZE; TxBuf.state = BufState_NEED_UPDATE; TxBuf.countBytes = 0; TxBuf.sem = xSemaphoreCreateBinary();
	dmaRxBuf.arr = RxDmaArr; dmaRxBuf.size = UART_RECEIVE_BUF_SIZE / 2;
	dmaRxBuf.curCNDTR = dmaRxBuf.size;

	// инициализация структуры данных для управления печью
	cd.startTime = 0; // веремя начала программы
	cd.state = DISABLED;
	// задаем температурный профиль
	cd.tempProfile = (TempProfile)TempProfile_init_zero;
	TempMeasure *tp = cd.tempProfile.data;
	tp[0].time = 0; tp[0].temp = 26;
	tp[1].time = 10; tp[1].temp = 40;
	tp[2].time = 20; tp[2].temp = 60;
	tp[3].time = 30; tp[3].temp = 60;
	cd.tempProfile.countPoints = 4;
	// кодируем термопрофиль с помощью Protocol Buffers(nanopb)
	//uint8_t buffer[TempProfile_size];
	//pb_ostream_t ostream = pb_ostream_from_buffer(buffer, sizeof(buffer));
	//bool ostatus = pb_encode(&ostream, TempProfile_fields, &cd.tempProfile);

	//TempProfile inputMsg = TempProfile_init_zero;
	//pb_istream_t istream = pb_istream_from_buffer(buffer, sizeof(buffer));
	//bool istatus = pb_decode(&istream, TempProfile_fields, &inputMsg);
}

void money_defaultTask(void const *argument)
{
	uint8_t counter = 0;
	for (;;)
	{
		osDelay(500);
		counter++;

		uint8_t err2 = 0;
		uint16_t receivedData = oven_getTemp(err2);
		
		if (err2) {
			nrcLog("Receive error, errcode == %u", err2);
		}
		else {
			//myPrint("Received data == %x", receivedData);
			uint8_t coupleDisconnected = (receivedData & ((uint16_t)(1 << 2)));				
			if (coupleDisconnected) {
				nrcLog("Disconnected termocouple");
			}
			else {
				float temp = 0.0f;
				//temp = ((receivedData >> 3) & 0xfff) * 0.25;
				temp = ((receivedData >> 3) & 0xfff) * 0.25f;
				//myPrint("Current temperature == %f deg", temp);

				char msgContentBuf[20];
				uint16_t len = sprintf(msgContentBuf, "Temp %.2f\n", temp);
				//transmitMsg(msgContentBuf, len);
				//transmitMsg("ping\n", 5);
			}
		}
	}
}

void money_taskMsgReceiver(void const * argument)
{
	nrcLogD("Start Messenger");
	for (;;) {
		xSemaphoreTake(RxBuf.sem, portMAX_DELAY);
		RxBuf.state = BufState_USED_BY_PROC; // устанавливаем флаг того что сейчас буфер будет использоваться процессором
		MsgType msgType = getMsgType(RxBuf.arr, RxBuf.countBytes);
		if (msgType == MsgType_CMD) {
			OvenCommand cmd = OvenCommand_init_default;
			pb_istream_t istream = pb_istream_from_buffer(msgBuf, sizeof(msgBuf));
			bool status = pb_decode(&istream, OvenCommand_fields, &cmd);
			if (status) {
				addCommand(&cmd);
			}
		}
		RxBuf.state = BufState_NEED_UPDATE; // буфер можно перезаписывать

		// сбрасываем переменные, чтобы dma смог снова обновить буфер
		RxBuf.state = BufState_USED_BY_HARDWARE;
		RxBuf.countBytes = -2;

		if (msgType == MsgType_CMD) {
			OvenCommand cmd = popCmdFromQueue();
			pb_ostream_t ostream = pb_ostream_from_buffer(msgBuf, sizeof(msgBuf));
			bool status = pb_encode(&ostream, OvenCommand_fields, &cmd);
			if (status) {
				// ждем пока uart завершит передачу предыдущего сообщения
				xSemaphoreTake(TxBuf.sem, portMAX_DELAY);
				TxBuf.state = BufState_USED_BY_PROC;
				// минуем стадию UPDATED, в следующей функции данные будут паковаться и сразу начнется их передача
				long result = transmitMsg(msgType, msgBuf, ostream.bytes_written, TxBuf.arr);
				if (result == -2) {
					nrcLogD("Error sending data");
				}
				else {
					nrcLogD("Message successful transmitted");
				}
			}
		}
		else {
			nrcLogD("Receive error");
		}
	}
}

void money_taskMsgSender(void const * argument)
{
	for(;;) {
		// ждем новых данных
		xSemaphoreTake(RxBuf.sem, portMAX_DELAY);
		// распаковываем данные
	}
}

// обработчик прерывания по приему очередной порции байт
// частично позаимствовано отсюда:
// https://github.com/akospasztor/stm32-dma-uart/blob/master/Src/main.c
uint32_t NRC_UART_RxEvent(NRC_UART_EventType event, uint16_t curCNDTR)
{
	uint16_t start, length;
	static bool RxUartDmaOveflow = false; // буфер приема переполнен(слишком большое сообщение), в этом случае дожидаемся конца приема и сбрасываем буфер

	/* Determine start position in DMA buffer based on previous CNDTR value */
	start = (dmaRxBuf.curCNDTR < dmaRxBuf.size) ? (dmaRxBuf.size - dmaRxBuf.curCNDTR) : 0;

	if (event == NRC_EVENT_TRANSFER_COMPLETED) {
		length = (dmaRxBuf.curCNDTR < dmaRxBuf.size) ? (dmaRxBuf.curCNDTR - curCNDTR) : (dmaRxBuf.size - curCNDTR);
		dmaRxBuf.curCNDTR = curCNDTR;
	}
	else if (event == NRC_EVENT_HALF_BUF) { /* DMA Rx Half event */
		length = (dmaRxBuf.size >> 1) - start;
		dmaRxBuf.curCNDTR = (dmaRxBuf.size >> 1);
	}
	else if (event == NRC_EVENT_FULL_BUF) { /* DMA Rx Complete event */
		length = dmaRxBuf.size - start;
		dmaRxBuf.curCNDTR = dmaRxBuf.size;
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
				RxBuf.state = BufState_UPDATED;
				xSemaphoreGiveFromISR(RxBuf.sem, NULL); // буфером можно пользоваться
				nrcLog("Received %d bytes", RxBuf.countBytes);
			}
		}
	}
}


#ifdef NRC_WINDOWS_SIMULATOR // Windows - specific code

const uint32_t kReceiveIRQ_No = 1;
const uint32_t kTransmitIRQ_No = 2;

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
		UART_RECEIVE_BUF_SIZE,		// output buffer size
		UART_RECEIVE_BUF_SIZE,		// input buffer size
		NMPWAIT_USE_DEFAULT_WAIT,	// client time-out
		NULL);						// default security attribute

	if (hPipe == INVALID_HANDLE_VALUE) {
		nrcLogD("CreateNamedPipe failed, GLE=%d", GetLastError());
	}
	else {
		nrcLogD("Named pipe succesfull created");
	}

	while (hPipe != INVALID_HANDLE_VALUE)
	{
		if (ConnectNamedPipe(hPipe, NULL) != FALSE)   // wait for someone to connect to the pipe
		{
			// заполняем псевдо-DMA - буфер
			while (ReadFile(hPipe, dmaRxBuf.arr, dmaRxBuf.size, &dmaRxBuf.curCNDTR, NULL) != FALSE)
			{
				nrcLogD("receiverIRQ_generator - Received %d bytes", dmaRxBuf.curCNDTR);
				vPortGenerateSimulatedInterrupt(kReceiveIRQ_No);
				nrcLogD("receiverIRQ_handler exit");
				dmaRxBuf.curCNDTR = 0;
			}
		}
		DisconnectNamedPipe(hPipe);
	}

	return 0;
}

uint32_t receiverIRQ_handler()
{
	nrcLogD("receiverIRQ_handler start");
	NRC_UART_EventType type = NRC_EVENT_TRANSFER_COMPLETED;
	if (dmaRxBuf.curCNDTR == dmaRxBuf.size) { type = NRC_EVENT_FULL_BUF; }
	NRC_UART_RxEvent(type, dmaRxBuf.curCNDTR);
}

void money_initReceiverIRQ()
{
	SetThreadPriority(CreateThread(NULL, 0, receiverIRQ_generator, NULL, 0, NULL), THREAD_PRIORITY_ABOVE_NORMAL);
	vPortSetInterruptHandler(kReceiveIRQ_No, receiverIRQ_handler);
}

uint16_t oven_getTemp(uint8_t *err)
{
	return 0;
}

#else // далее следует реальный код для микроконтроллера

uint16_t oven_getTemp(uint8_t *err)
{
	if (!err) return 0;
	uint16_t receivedData = 0;
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
	*err = (uint8_t)HAL_SPI_Receive(&hspi3, (uint8_t*)&receivedData, 1, HAL_MAX_DELAY);
	//err3 = HAL_SPI_Receive(&hspi3, arr, 1, HAL_MAX_DELAY);
	HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);			
	return receivedData;
}

#endif

