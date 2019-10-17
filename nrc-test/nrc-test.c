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
	NRC_Time testTime;
	uint32_t fakeCurrentTickCount, tmp1 = lastSyncUnixTime, tmp2 = lastTickCount;

	lastSyncUnixTime = 1570000000;
	lastTickCount = 3000000;
	fakeCurrentTickCount = 3141592;
	NRC_getTime(&testTime, &fakeCurrentTickCount);
	NRC_AssertTest((testTime.unixSeconds == 1570000141) && (testTime.mills == 592));

	lastSyncUnixTime = 1570000000;
	lastTickCount = 0xFFFFFFFF; // проверка переполнения счетчика lastTickCount
	fakeCurrentTickCount = 100200;
	NRC_getTime(&testTime, &fakeCurrentTickCount);
	NRC_AssertTest((testTime.unixSeconds == 1570000100) && testTime.mills == 201);

	// после теста восстанавливаем глобальным переменным их исходные величины
	lastSyncUnixTime = tmp1;
	lastTickCount = tmp2;
	// -------------->>>> NRC_getTime End <<<<----------------

	// -------------->>>> NRC_getInterpolatedTempProfileValue Begin <<<<----------------
	PB_TempProfile profile;
	NRC_setDefaultTempProfile(&profile);

#define TEST_INTERVAL(idx1,idx2) NRC_AssertTest(abs(NRC_getInterpolatedTempProfileValue(&profile, 0.5f * (profile.data[idx1].time + profile.data[idx2].time)) - 0.5f * (profile.data[idx1].temp + profile.data[idx2].temp)) < 1.0f)
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
