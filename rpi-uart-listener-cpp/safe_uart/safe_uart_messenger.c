#include "safe_uart_messenger.h"
#include <string.h>
#include <stdio.h>

uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes)
{
	uint16_t offset = 0;

	// 1-st byte - start package symbol(gate 1)
	uartMsgBuf[offset] = '^';
	offset++;

	// 2 and 3 bytes - count of content bytes
	*((uint16_t*)&uartMsgBuf[offset]) = contentNumOfBytes;
	offset += 2;

	// 4-st byte - gate 2 symbol
	uartMsgBuf[offset] = '^';
	offset++;

	// copy content
	memcpy(&uartMsgBuf[offset], msgContentBuf, contentNumOfBytes);
	offset += contentNumOfBytes;

	uartMsgBuf[offset] = '$'; // end of content symbol
	offset++;

	uint8_t tmp = (contentNumOfBytes & 0x0003); // remainder of dividing by 4
	uint8_t dummyBytesCount = (tmp > 0 ? 4 - tmp : 0); // add dummy bytes for a multiplicity of 4 bytes (32-bit word)
	for (tmp = 0; tmp < dummyBytesCount; tmp++) {
		uartMsgBuf[offset + tmp] = '$'; // dummy byte symbol
	}
	offset += dummyBytesCount;

	uint32_t controlSum = crc_calc(msgContentBuf, contentNumOfBytes);
	*((uint32_t*)&uartMsgBuf[offset]) = controlSum;
	offset += 4;

	uartMsgBuf[offset] = '\0';
	return offset;
}

long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes)
{
	if (msgNumOfBytes <= 9) {
		printf("Too little bytes count: %d\n", msgNumOfBytes); fflush(stdout); return -1;
	}
	if (uartMsgBuf[0] != '^' || uartMsgBuf[3] != '^') {
		printf("Bad package gate\n"); fflush(stdout); return -1;
	}
	uint16_t contentLen = *((uint16_t*)&uartMsgBuf[1]);
	if (uartMsgBuf[4 + contentLen] != '$') {
		printf("Content close symbol != %02x, but %02x\n", '$', uartMsgBuf[4 + contentLen]); fflush(stdout); return -1;
	}
	else if (msgNumOfBytes - (4 + contentLen + 1) < 4) {
		printf("Bad uart package size\n"); fflush(stdout); return -1;
	}
	uint32_t packageSum = *((uint32_t*)&uartMsgBuf[msgNumOfBytes - 4]);
	printf("Calculate checksum\n"); fflush(stdout);
	uint32_t checkSum = crc_calc(&uartMsgBuf[4], contentLen);
	if (packageSum != checkSum) {
		printf("Check sum's are not equal: in package %x, but calculated %x\n", packageSum, checkSum); fflush(stdout);
		return -1;
	}
	memcpy(msgContentBuf, &uartMsgBuf[4], contentLen);
	return contentLen;
}
