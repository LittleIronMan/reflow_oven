#ifndef safe_uart_messenger_hpp
#define safe_uart_messenger_hpp

#include <stdint.h> // uint8_t, uint16_t etc...

extern uint32_t(*crc_calc) (uint8_t pBuffer[], uint16_t NumOfBytes);
uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes);
long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes);

#endif // safe_uart_messenger_hpp
