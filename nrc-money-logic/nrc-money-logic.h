#ifndef main_logic_h
#define main_logic_h

#include "FreeRTOS.h"
#include "semphr.h"

// состояния буфера, который могут раздельно использовать DMA и процессор
typedef enum {
	BufState_NEED_UPDATE = 0, // данные неактуальны, их нужно обновить
	BufState_USED_BY_HARDWARE, // данные используются DMA, процессору доступ запрещен
	BufState_UPDATED, // данные обновлены и актуальны
	BufState_USED_BY_PROC // данные используются процессором, DMA доступ запрещен
} BetaBufState;

// буфер, которым раздельно владеют DMA и процессор
typedef volatile struct {
	uint8_t *arr; // указатель на массив с данными
	uint16_t size;
	uint16_t countBytes; // количество актуальных байт в буфере
	xSemaphoreHandle sem; // буфер доступен для использования Операционной системой(процессором)
	BetaBufState state;
} NrcUartBufBeta;

// циклический буфер, который используется DMA
typedef struct {
	uint8_t *arr; // указатель на массив с данными
	uint16_t size;
	uint16_t curCNDTR; // предыдущая позиция DMA-указателя в буфере
} NrcUartBufAlpha;

extern NrcUartBufBeta	RxBuf, // буфер данных, принятых по UART
						TxBuf; // буфер данных, передаваемых по UART
extern NrcUartBufAlpha dmaRxBuf; // циклический буфер принимаемых по UART данных для DMA
extern uint8_t	RxArr[], // массив с принятыми и упакованными данными
				TxArr[], // массив для буфера ПЕРЕДАЧИ данных
				RxDmaArr[], // массив для циклического буфера ПРИЕМА данных по uart
				msgBuf[]; // массив для распакованных данных

void money_init();

void money_defaultTask(void const *argument);
void money_taskMsgReceiver(void const * argument);
void money_taskMsgSender(void const * argument);

typedef enum {
	NRC_EVENT_HALF_BUF, // счетчик dma на середине буфера
	NRC_EVENT_FULL_BUF, // счетчик dma в конце буфера
	NRC_EVENT_TRANSFER_COMPLETED // передача/прием данных завершен(а) - поймано прерывание IDLE_LINE
} NRC_UART_EventType;

uint32_t NRC_UART_RxEvent(NRC_UART_EventType event, uint16_t curCNDTR);

// платформозависимые функции, которые должны быть определены по-разному для stm32 и для windows
void money_initReceiverIRQ();
void money_initSender();
uint16_t oven_getTemp(uint8_t *err);

#endif // main_logic_h
