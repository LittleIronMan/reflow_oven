#ifndef main_logic_h
#define main_logic_h

#include "FreeRTOS.h"
#include "semphr.h"
#include "reflow_oven.pb.h"

// состояния буфера, который могут раздельно использовать DMA и процессор
typedef enum {
	BufState_USED_BY_HARDWARE, // данные используются DMA, процессору доступ запрещен
	BufState_USED_BY_PROC // данные используются процессором, DMA доступ запрещен
} BetaBufState;

typedef enum {
	NRC_EVENT_HALF_BUF, // счетчик dma на середине буфера
	NRC_EVENT_FULL_BUF, // счетчик dma в конце буфера
	NRC_EVENT_TRANSFER_COMPLETED // передача/прием данных завершен(а) - поймано прерывание IDLE_LINE
} NRC_UART_EventType;

// буфер, которым раздельно владеют DMA и процессор
typedef volatile struct {
	uint8_t *arr; // указатель на массив с данными
	uint16_t size;
	uint16_t countBytes; // количество актуальных байт в буфере
	xSemaphoreHandle sem; // семафор, блокирующий задачу обработки этого буфера до тех пор пока он не заполнится
	BetaBufState state; // вся структура volatile только из-за этой переменной
} NrcUartBufBeta;

// циклический буфер, который используется DMA
typedef struct {
	uint8_t *arr; // указатель на массив с данными
	uint16_t size;
	uint16_t prevCNDTR; // предыдущая позиция DMA-указателя в буфере
} NrcUartBufAlpha;

// элемент очереди с приоритетами
typedef struct _NRC_QueueItem {
	bool isActual;
	uint8_t priority;
	uint8_t *data;
	struct _NRC_QueueItem *next;
} NRC_QueueItem;

// очередь с приоритетами
typedef struct {
	NRC_QueueItem* front; // превый элемент в очереди(с наивысшим приоритетом)
	NRC_QueueItem* items; // указатель на массив со всеми элементами этой очереди
	uint8_t *dataBuf; // указатель на выделенный массив данных для этой очереди
	uint16_t itemDataSize; // размер единицы структуры данных в этой очереди, грубо говоря sizeof(*items[i].data)
	uint8_t maxItemsCount; // максимальное количество элементов в очереди
	xSemaphoreHandle mutex; // мютекс, предоставляет доступ к очереди для какой-то одной задачи
	xSemaphoreHandle semCounter; // семафор - счетчик, блокирует задачу если очередь пуста
} NRC_Queue;

typedef struct {
	PB_TempProfile tempProfile; // идеальный температурный профиль, к которому должна стремиться программа управления печью
	uint32_t startTime; // веремя начала программы
	PB_State state; // состояние программы управления
	uint32_t integral;
	uint16_t prevMeasure;
} NRC_ControlData;

extern NrcUartBufBeta	RxBuf, // буфер данных, принятых по UART
						TxBuf; // буфер данных, передаваемых по UART
extern NrcUartBufAlpha dmaRxBuf; // циклический буфер принимаемых по UART данных для DMA

void money_init(void);
void money_cmdManagerTask(void const* argument);
void money_defaultTask(void const *argument);
void money_taskMsgReceiver(void const * argument);
void money_taskMsgSender(void const * argument);
// платформозависимые функции, которые должны быть определены по-разному для stm32 и для windows
void money_initReceiverIRQ(void);
void money_initSender(void);
float oven_getTemp(uint16_t *receivedData, uint8_t *err);
uint32_t getCurrentTime(void);

void NRC_UART_RxEvent(NRC_UART_EventType event, uint16_t curCNDTR);

bool addItemToQueue(NRC_Queue* queue, uint8_t* newData, uint8_t newPriority);
void popItemFromQueue(NRC_Queue* queue, uint8_t* resultBuf);

#endif // main_logic_h
