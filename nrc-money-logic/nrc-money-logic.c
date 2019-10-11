#include "money_logic.h"

#include "safe_uart_messenger.h"
#include "nrc_print.h"
#include <uart_config.h> // UART_RECEIVE_BUF_SIZE, UART_TRANSMIT_BUF_SIZE
#include <string.h> // memcpy
#include <stdbool.h>

// protocol buffers
#include "nrc_msg.pb.h"
#include "pb_encode.h"
#include "pb_decode.h"

NrcUartBufBeta RxBuf, // буфер данных, принятых по UART
TxBuf; // буфер данных, передаваемых по UART
NrcUartBufAlpha dmaRxBuf; // циклический буфер принимаемых по UART данных для DMA
// соответствующие массивы
uint8_t RxArr[UART_RECEIVE_BUF_SIZE]; // массив с принятыми и упакованными данными
uint8_t TxArr[UART_TRANSMIT_BUF_SIZE]; // массив для буфера ПЕРЕДАЧИ данных
uint8_t RxDmaArr[UART_RECEIVE_BUF_SIZE / 2]; // массив для циклического буфера ПРИЕМА данных по uart
uint8_t msgBuf[UART_RECEIVE_BUF_SIZE - 8]; // массив для распакованных данных

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

void money_init()
{
	// инициализация буферов приема/передачи по uart
	RxBuf.arr = RxArr; RxBuf.size = UART_RECEIVE_BUF_SIZE; RxBuf.state = BufState_NEED_UPDATE; RxBuf.countBytes = 0; RxBuf.sem = xSemaphoreCreateBinary();
	TxBuf.arr = TxArr; TxBuf.size = UART_TRANSMIT_BUF_SIZE; TxBuf.state = BufState_NEED_UPDATE; TxBuf.countBytes = 0; TxBuf.sem = xSemaphoreCreateBinary();
	dmaRxBuf.arr = RxDmaArr; dmaRxBuf.size = UART_RECEIVE_BUF_SIZE / 2;
	dmaRxBuf.prevCNDTR = dmaRxBuf.size;

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

		uint16_t receivedData = 0;
		HAL_StatusTypeDef err2;
		HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
		err2 = HAL_SPI_Receive(&hspi3, (uint8_t*)&receivedData, 1, HAL_MAX_DELAY);
		//err3 = HAL_SPI_Receive(&hspi3, arr, 1, HAL_MAX_DELAY);
		HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);			
		
		if (err2 != HAL_OK) {
			nrcLog("Receive error, errcode == %u", (uint8_t)err2);
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

	}
}
