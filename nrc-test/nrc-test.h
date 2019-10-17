#ifndef nrc_test_h
#define nrc_test_h

#ifdef NRC_TEST

void nrc_testAll();

void NRC_assertCall(unsigned long ulLine, const char* const pcFileName);
#define NRC_AssertTest( x ) if( ( x ) == 0 ) NRC_assertCall( __LINE__, __FILE__ )

#endif // NRC_TEST


#endif // nrc_test_h
