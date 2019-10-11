#ifndef nrc_safe_uart_h
#define nrc_safe_uart_h

#include <stdint.h> // uint8_t, uint16_t etc...

uint8_t getMsgType(uint8_t uartMsgBuf[], uint16_t msgNumOfBytes);
long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes);
long transmitMsg(uint8_t type, uint8_t msgContent[], uint16_t contentLen, uint8_t uartTransmitBuf[]);

// функции ниже нужно определить в одном из своих модулей
extern uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes);
extern uint16_t uartTransmitData(uint8_t[], uint16_t);

#endif // nrc_safe_uart_h
