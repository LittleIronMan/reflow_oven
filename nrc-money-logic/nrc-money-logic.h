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
	uint16_t prevCNDTR; // предыдущая позиция DMA-указателя в буфере
} NrcUartBufAlpha;

extern NrcUartBufBeta RxBuf, TxBuf;
extern uint8_t RxArr[]; // массив с принятыми и упакованными данными

void money_init();

void money_defaultTask(void const *argument);
void money_taskMsgReceiver(void const * argument);
void money_taskMsgSender(void const * argument);

// платформозависимые функции, которые должны быть определены вне модуля money_logic
void money_initReceiver();
void money_initSender();

#endif // main_logic_h
