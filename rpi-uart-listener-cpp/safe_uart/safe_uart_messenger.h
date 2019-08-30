#ifndef safe_uart_messenger_hpp
#define safe_uart_messenger_hpp

#include <stdint.h>

extern uint32_t(*crc_calc) (uint8_t pBuffer[], uint16_t NumOfByte);
uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes);

#endif // safe_uart_messenger_hpp
