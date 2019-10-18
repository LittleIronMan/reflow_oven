#ifndef main_logic_h
#define main_logic_h

#include "FreeRTOS.h"
#include "semphr.h"
#include "reflow_oven.pb.h"

#define NRC_MAX(x,y) ((x) > (y) ? (x) : (y))

#ifdef NRC_WINDOWS_SIMULATOR
	#define NRC_TIME_ACCELERATION 10
#else
	#define NRC_TIME_ACCELERATION 1
#endif

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

typedef enum {
	NRC_MsgDirection_INCOMING, // входящее сообщение
	NRC_MsgDirection_OUTGOING // исходящее сообщение
} NRC_MsgDirection;

// очередь с приоритетами
typedef struct {
	NRC_QueueItem* firstItem; // превый элемент в очереди(с наивысшим приоритетом)
	NRC_QueueItem* items; // указатель на массив со всеми элементами этой очереди
	uint8_t *dataBuf; // указатель на выделенный массив данных для этой очереди
	const uint16_t itemDataSize; // размер единицы структуры данных в этой очереди, грубо говоря sizeof(*items[i].data)
	const uint8_t maxItemsCount; // максимальное количество элементов в очереди
	xSemaphoreHandle mutex; // мютекс, предоставляет доступ к очереди для какой-то одной задачи
	const PB_MsgType msgType; // тип структур данных в этой очереди
	const pb_field_t* protobufFields; // указатель на специальную область данных, которая используется как шифр при
										// кодировании/декодировании структуры данных элемента очереди в nanopb 
} NRC_Queue;

xSemaphoreHandle semCounterIncomingMessages; // семафор - счетчик для ВХОДЯЩИХ сообщений
xSemaphoreHandle semCounterOutgoingMessages; // семафор - счетчик для ИСХОДЯЩИХ сообщений

typedef struct {
	uint32_t unixSeconds; // секунд с начала эпохи(UNIX - время)
	uint16_t mills; // миллисекунды последней секунды
} NRC_Time;

typedef enum {
	OvenState_TurnOFF,
	OvenState_TurnON
} OvenState;

typedef struct {
	PB_TempProfile tempProfile; // идеальный температурный профиль, к которому должна стремиться программа управления печью
	NRC_Time startTime; // веремя начала программы
	NRC_Time lastIterationTime; // веремя последней итерации пид регулятора
	PB_State state; // состояние программы управления
	OvenState ovenState; // состояние самой печки(включена/выключена)
} NRC_ControlData;

extern NrcUartBufBeta	RxBuf, // буфер данных, принятых по UART
						TxBuf; // буфер данных, передаваемых по UART
extern NrcUartBufAlpha dmaRxBuf; // циклический буфер принимаемых по UART данных для DMA

void money_init(void);
void money_cmdManagerTask(void const *argument);
void money_pidControllerTask(void const *argument);
void money_defaultTask(void const *argument);
void money_taskMsgReceiver(void const *argument);
void money_taskMsgSender(void const *argument);
// платформозависимые функции, которые должны быть определены по-разному для stm32 и для windows
void money_initReceiverIRQ(void);
void money_initSender(void);

float Oven_getTemp(uint16_t *receivedData, uint8_t *err);
void Oven_applyControl(float controlValue);
void Oven_setState(OvenState newState);
void Oven_finishHeatingProgram();
void Oven_setDefaultTempProfile(PB_TempProfile* profile);
float Oven_getInterpolatedTempProfileValue(PB_TempProfile* tp, uint32_t time /* в миллисекундах */ );

void NRC_UART_RxEvent(NRC_UART_EventType event, uint16_t curCNDTR);

bool addItemToQueue(NRC_Queue* queue, uint8_t* newData, uint8_t newPriority, xSemaphoreHandle semCounter);
void popItemFromQueue(NRC_Queue* queue, uint8_t* resultBuf);

extern NRC_Time prevTime;
extern uint32_t prevTickCount;
void NRC_getTime(NRC_Time* time, uint32_t* argTickCount);
uint32_t NRC_getTimeDiffInMills(NRC_Time* time1, NRC_Time* time2);

#endif // main_logic_h
