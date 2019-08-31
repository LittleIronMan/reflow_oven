#include "safe_uart_messenger.h"
#include <string.h>
#include <stdio.h>

uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes)
{
	uint16_t offset = 0;

	// первый байт - символ начала сообщения
	uartMsgBuf[offset] = '^';
	offset++;

	// второй и третий байты - количество байтов полезного контента передаваемого пакета
	*((uint16_t*)&uartMsgBuf[offset]) = contentNumOfBytes;
	offset += 2;

	// второй символ начала пакета(вместе с первым символом они обрамляют количество байтов полезного контента)
	uartMsgBuf[offset] = '^';
	offset++;

	// копируем полезный контент
	memcpy(&uartMsgBuf[offset], msgContentBuf, contentNumOfBytes);
	offset += contentNumOfBytes;

	uartMsgBuf[offset] = '$'; // символ конца полезного контента
	offset++;

	// добавляем несколько пустых байт(dummyBytesCount),
	// чтобы [contentNumOfBytes + 1(символ конца пакета) + dummyBytesCount] было кратно 4
	uint8_t tmp = ((contentNumOfBytes + 1) & 0x0003); // остаток от деления на 4
	uint8_t dummyBytesCount = (tmp > 0 ? 4 - tmp : 0);
	for (tmp = 0; tmp < dummyBytesCount; tmp++) {
		uartMsgBuf[offset + tmp] = '$'; // пустые байты будут такими-же как и символ конца полезного контента
	}
	offset += dummyBytesCount;

	// вычисляем контрольную сумму байтов пакета,
	//	но вместе с дополнительными символами, которые доводят размер массива до кратности 4-ем
	uint32_t controlSum = crc_calc(uartMsgBuf, offset);
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
	int8_t dummyBytesCount = msgNumOfBytes - (4 + contentLen + 1 + 4);
	if (dummyBytesCount < 0) {
		printf("Bad uart package size\n"); fflush(stdout); return -1;
	}
	uint32_t packageSum = *((uint32_t*)&uartMsgBuf[msgNumOfBytes - 4]);
	printf("Calculate checksum\n"); fflush(stdout);
	uint32_t checkSum = crc_calc(uartMsgBuf, msgNumOfBytes - 4);
	if (packageSum != checkSum) {
		printf("Check sum's are not equal: in package %x, but calculated %x\n", packageSum, checkSum); fflush(stdout);
		return -1;
	}
	memcpy(msgContentBuf, &uartMsgBuf[4], contentLen);
	return contentLen;
}
