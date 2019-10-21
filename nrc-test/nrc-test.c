#include "nrc-test.h"
#include "nrc-money-logic.h"
#include "nrc-print.h"
//#include "FreeRTOS.h"
#include "task.h"

#ifdef NRC_TEST

// тесты всех нетривиальных функций проекта
void nrc_testAll()
{
	// -------------->>>> NRC_getTime Begin <<<<----------------
	NRC_Time testTime = { 0, 0 }, tmp1 = prevTime;
	uint32_t fakeCurrentTickCount, tmp2 = prevTickCount;

	prevTime = (NRC_Time){ 1570000000, 0 };
	prevTickCount = 3000000;
	fakeCurrentTickCount = 3141592;
	NRC_getTime(&testTime, &fakeCurrentTickCount);
	NRC_AssertTest((testTime.unixSeconds == 1570000141) && (testTime.mills == 592));

	prevTime = (NRC_Time){ 1570000000, 0 };
	prevTickCount = 0xFFFFFFFF; // проверка переполнения счетчика lastTickCount
	fakeCurrentTickCount = 100200;
	NRC_getTime(&testTime, &fakeCurrentTickCount);
	NRC_AssertTest((testTime.unixSeconds == 1570000100) && testTime.mills == 201);

	// после теста восстанавливаем глобальным переменным их исходные величины
	prevTime = tmp1;
	prevTickCount = tmp2;
	// -------------->>>> NRC_getTime End <<<<----------------

	// -------------->>>> NRC_getInterpolatedTempProfileValue Begin <<<<----------------
	PB_TempProfile profile;
	Oven_setDefaultTempProfile(&profile);

#define TEST_INTERVAL(idx1,idx2) \
	NRC_AssertTest( \
	abs( \
		Oven_getInterpolatedTempProfileValue(&profile, \
			0.5f * ((profile.data[idx1].time + profile.data[idx2].time) * 1000) /* середина временного отрезка */ \
		) - 0.5f * (profile.data[idx1].temp + profile.data[idx2].temp) /* среднее арифметическое температуры */ \
	) < 1.0f)
	TEST_INTERVAL(0, 1);
	TEST_INTERVAL(1, 2);
	TEST_INTERVAL(2, 3);
	TEST_INTERVAL(3, 4);
	TEST_INTERVAL(4, 5);
	// -------------->>>> NRC_getInterpolatedTempProfileValue End <<<<----------------


	// -------------->>>> Finish <<<<----------------
	nrcLog("All tests completed succesfull");
}

void NRC_assertCall(unsigned long ulLine, const char* const pcFileName)
{
	nrcLog("NRC Assert! Line %d, file %s", ulLine, pcFileName);

	taskENTER_CRITICAL();
	{
		// блокируем всю ОС
		while (true) {
			__asm { NOP };
			__asm { NOP };
		}
	}
	taskEXIT_CRITICAL();
}

#endif // NRC_TEST
