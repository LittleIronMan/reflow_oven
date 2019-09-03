#ifndef safe_uart_messenger_hpp
#define safe_uart_messenger_hpp

#include <stdint.h> // uint8_t, uint16_t etc...

long receiveMsg(uint8_t msgContent[]);
long transmitMsg(uint8_t msgContent[], uint16_t contentLen);

// данные функции нужно определить в одном из своих модулей
extern uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes);
extern uint8_t uartReceiveByte(void);
extern uint16_t uartTransmitData(uint8_t[], uint16_t);

#endif // safe_uart_messenger_hpp
