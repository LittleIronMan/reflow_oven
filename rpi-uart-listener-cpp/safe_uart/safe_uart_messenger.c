#include "safe_uart_messenger.h"
#include <string.h>

uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes)
{
	uartMsgBuf[0] = '^'; // 1-st byte - start message symbol
	*((uint16_t*)&uartMsgBuf[1]) = contentNumOfBytes; // 2 and 3 bytes - count of content bytes
	memcpy(&uartMsgBuf[3], msgContentBuf, contentNumOfBytes); // copy content
	uartMsgBuf[3 + contentNumOfBytes] = '$'; // end of content symbol
	uint8_t tmp = (contentNumOfBytes & 0x0003); // remainder of dividing by 4
	uint8_t dummyBytesCount = (tmp > 0 ? 4 - tmp : 0); // add dummy bytes for a multiplicity of 4 bytes (32-bit word)
	for (tmp = 0; tmp < dummyBytesCount; tmp++) {
		uartMsgBuf[3 + contentNumOfBytes + 1 + tmp] = '@'; // dummy byte symbol
	}
	uint32_t controlSum = crc_calc(msgContentBuf, contentNumOfBytes);
	*((uint32_t*)&uartMsgBuf[3 + contentNumOfBytes + 1 + dummyBytesCount]) = controlSum;
	return 3 + contentNumOfBytes + 1 + dummyBytesCount + 4;
}
