#ifndef nrc_safe_uart_h
#define nrc_safe_uart_h

#include <stdint.h> // uint8_t, uint16_t etc...

#ifdef NRC_RPI_UART_TX
//#ifdef NRC_WINDOWS_SIMULATOR
	#define UART_RECEIVE_BUF_SIZE 1
	#define UART_TRANSMIT_BUF_SIZE 1024
	extern int uartDescriptor;
#elif NRC_RPI_UART_RX
//#ifdef NRC_WINDOWS_SIMULATOR
	#define UART_RECEIVE_BUF_SIZE 1024
	#define UART_TRANSMIT_BUF_SIZE 1
	extern int uartDescriptor;
#elif NRC_STM32
//#ifdef NRC_WINDOWS_SIMULATOR
	#define UART_RECEIVE_BUF_SIZE 256
	#define UART_TRANSMIT_BUF_SIZE 256
#else
#endif

uint8_t getMsgType(uint8_t uartMsgBuf[], uint16_t msgNumOfBytes);
uint8_t* getMsgContent(uint8_t uartMsgBuf[]);
long transmitMsg(uint8_t type, uint8_t msgContent[], uint16_t contentLen, uint8_t uartTransmitBuf[]);

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes);
uint16_t uartTransmitData(uint8_t[], uint16_t);

#endif // nrc_safe_uart_h
