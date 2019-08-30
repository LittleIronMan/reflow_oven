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
	uint16_t msgLen = 3 + contentNumOfBytes + 1 + dummyBytesCount + 4;
	uartMsgBuf[msgLen] = '\0';
	return msgLen;
}

long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes)
{
	if (msgNumOfBytes <= 8) {
		printf("Too little bytes count: %d\n", msgNumOfBytes); return -1;
	}
	if (uartMsgBuf[0] != '^') {
		printf("First symbol != %02x, but %02x\n", '^', uartMsgBuf[0]); return -1;
	}
	uint16_t contentLen = *((uint16_t*)&uartMsgBuf[1]);
	if (uartMsgBuf[3 + contentLen] != '$') {
		printf("Content close symbol != %02x, but %02x\n", '$', uartMsgBuf[3 + contentLen]); return -1;
	}
	uint32_t packageSum = *((uint32_t*)&uartMsgBuf[msgNumOfBytes - 4]);
	uint32_t checkSum = crc_calc(&uartMsgBuf[3], contentLen);
	if (packageSum != checkSum) {
		printf("Check sum's are not equal: in package %x, but calculated %x", packageSum, checkSum);
		return -1;
	}
	memcpy(msgContentBuf, &uartMsgBuf[3], contentLen);
	return contentLen;
}
