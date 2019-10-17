#include "nrc-test.h"
#include "nrc-money-logic.h"
#include "nrc-print.h"

#ifdef NRC_TEST

// тесты всех нетривиальных функций проекта
void nrc_testAll()
{
	// -------------->>>> NRC_getTime <<<<----------------
	NRC_Time testTime;
	uint32_t fakeCurrentTickCount;

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



	// -------------->>>> Finish <<<<----------------
	nrcLog("All tests completed succesfull");
}

#endif // NRC_TEST
