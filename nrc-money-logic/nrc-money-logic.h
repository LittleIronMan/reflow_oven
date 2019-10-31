#ifndef main_logic_h
#define main_logic_h

#include "FreeRTOS.h"
#include "semphr.h"
#include "task.h"
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

#if (configSUPPORT_STATIC_ALLOCATION == 1)
	#define nrc_defineSemaphore(semaphoreName) \
		xSemaphoreHandle semaphoreName; \
		StaticSemaphore_t semaphoreName##Buffer
	#define nrc_semaphoreCreateCounting(semaphoreName,maxCount,initCount) semaphoreName = xSemaphoreCreateCountingStatic(maxCount, initCount, &semaphoreName##Buffer)
	#define nrc_semaphoreCreateBinary(semaphoreName) semaphoreName = xSemaphoreCreateBinaryStatic(&semaphoreName##Buffer)
	#define nrc_semaphoreCreateMutex(semaphoreName) semaphoreName = xSemaphoreCreateMutexStatic(&semaphoreName##Buffer)
	#define NRC_INIT_TASK(taskName,stackSize,priority) \
		static StaticTask_t taskName##Buffer; \
		static StackType_t taskName##Stack[stackSize]; \
		taskName##TaskHandle = xTaskCreateStatic(money_##taskName##Task, #taskName "Task", stackSize, NULL, tskIDLE_PRIORITY + priority, taskName##Stack, &taskName##Buffer)
	#define nrc_timerCreate(timerName,period,autoReload,id,callback) \
		static StaticTimer_t timerName##Buffer; \
		xTimerHandle timerName##Handle = xTimerCreateStatic(#timerName,period,autoReload,id,callback,&timerName##Buffer)
#else
	#define nrc_defineSemaphore(semaphoreName) xSemaphoreHandle semaphoreName
	#define nrc_semaphoreCreateCounting(semaphoreName,maxCount,initCount) semaphoreName = xSemaphoreCreateCounting(maxCount, initCount)
	#define nrc_semaphoreCreateBinary(semaphoreName) semaphoreName = xSemaphoreCreateBinary()
	#define nrc_semaphoreCreateMutex(semaphoreName) semaphoreName = xSemaphoreCreateMutex()
	#define NRC_INIT_TASK(taskName,stackSize,priority) \
		xTaskCreate(money_##taskName##Task, #taskName "Task", stackSize, NULL, tskIDLE_PRIORITY + priority, &taskName##TaskHandle)
	#define nrc_timerCreate(timerName,period,autoReload,id,callback) \
		xTimerHandle timerName##Handle = xTimerCreate(#timerName,period,autoReload,id,callback)
#endif

// буфер, которым раздельно владеют DMA и процессор
typedef volatile struct _NrcUartBufBeta {
	uint8_t *arr; // указатель на массив с данными
	uint16_t size;
	uint16_t countBytes; // количество актуальных байт в буфере
	BetaBufState state; // вся структура volatile только из-за этой переменной
} NrcUartBufBeta;
extern xSemaphoreHandle TxBufSem;

// циклический буфер, который используется DMA
typedef struct _NrcUartBufAlpha {
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
	const char* queueName; // имя очереди(чисто для отладки)
	NRC_QueueItem* firstItem; // превый элемент в очереди(с наивысшим приоритетом)
	NRC_QueueItem* items; // указатель на массив со всеми элементами этой очереди
	uint8_t *dataBuf; // указатель на выделенный массив данных для этой очереди
	const uint16_t itemDataSize; // размер единицы структуры данных в этой очереди, грубо говоря sizeof(*items[i].data)
	const uint8_t maxItemsCount; // максимальное количество элементов в очереди
	const PB_MsgType msgType; // тип структур данных в этой очереди
	const pb_field_t* protobufFields; // указатель на специальную область данных, которая используется как шифр при
										// кодировании/декодировании структуры данных элемента очереди в nanopb 
	nrc_defineSemaphore(mutex); // мютекс, предоставляет доступ к очереди для какой-то одной задачи
} NRC_Queue;

typedef struct {
	PB_TempProfile tempProfile; // идеальный температурный профиль, к которому должна стремиться программа управления печью
	PB_Time lastIterationTime; // веремя последней итерации пид регулятора
	PB_FullControlData fControlData;
	nrc_defineSemaphore(fControlDataMutex);
} NRC_GlobalData;

extern NrcUartBufBeta	RxBuf, // буфер данных, принятых по UART
						TxBuf; // буфер данных, передаваемых по UART
extern NrcUartBufAlpha dmaRxBuf; // циклический буфер принимаемых по UART данных для DMA

void money_init(void);
void money_initTasks(void);
void money_sendFullControlData(void);
void money_cmdManagerTask(void const* argument);
void money_pidControllerTask(void const *argument);
void money_msgReceiverTask(void const *argument);
void money_msgSenderTask(void const *argument);
// платформозависимые функции, которые должны быть определены по-разному для stm32 и для windows
void money_initReceiverIRQ(void);

float Oven_getTemp(uint16_t *receivedData, uint8_t *err);
void Oven_applyControl(float controlValue);
void Oven_setState(PB_OvenState newState);
void Oven_startControlMode(PB_ControlMode controlMode, bool inBackground);
void Oven_finishControlMode(PB_ControlMode controlMode);
void Oven_setDefaultTempProfile(PB_TempProfile* profile);
void Oven_setDefaultFullControlData(PB_FullControlData* fControlData);
float Oven_getInterpolatedTempProfileValue(PB_TempProfile* tp, uint32_t time /* в миллисекундах */);

void NRC_UART_RxEvent(NRC_UART_EventType event, uint16_t curCNDTR);

bool addItemToQueue(NRC_Queue* queue, uint8_t* newData, uint8_t newPriority, TaskHandle_t taskToNotify);
void popItemFromQueue(NRC_Queue* queue, uint8_t* resultBuf);

extern PB_Time prevTime;
extern uint32_t prevTickCount;
void NRC_getTime(PB_Time* time, uint32_t* argTickCount);
PB_Time NRC_getTimeDiff(PB_Time* time1, PB_Time* time2);
long NRC_getTimeDiffInMills(PB_Time* time1, PB_Time* time2);

#endif // main_logic_h
