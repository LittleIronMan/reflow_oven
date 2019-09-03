#ifndef safe_uart_messenger_hpp
#define safe_uart_messenger_hpp

#include <stdint.h> // uint8_t, uint16_t etc...

extern uint32_t(*crc_calc) (uint8_t pBuffer[], uint16_t NumOfBytes);
uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes);
long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes);
long receiveMsg(uint8_t msgContent[]);
long transmitMsg(uint8_t msgContent[], uint16_t contentLen);

extern uint8_t(*uartReceiveByte) ();
extern uint16_t(*uartTransmitData) (uint8_t[], uint16_t);

extern const uint16_t uartReceiveBufSize;
extern const uint16_t uartTransmitBufSize;
extern uint8_t uartReceiveBuf[];
extern uint8_t uartTransmitBuf[];

#endif // safe_uart_messenger_hpp
