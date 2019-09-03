#include "safe_uart_messenger.h"
#include <string.h>
#include "../../nrc_print.h"
#include <uart_config.h> // UART_RECEIVE_BUF_SIZE, UART_TRANSMIT_BUF_SIZE

uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t msgContentBuf[], uint16_t contentNumOfBytes);
long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes);

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
		nrcLogD("Too little bytes count: %d", msgNumOfBytes); return -1;
	}
	if (uartMsgBuf[0] != '^' || uartMsgBuf[3] != '^') {
		nrcLogD("Bad package begin"); return -1;
	}
	uint16_t contentLen = *((uint16_t*)&uartMsgBuf[1]);
	if (uartMsgBuf[4 + contentLen] != '$') {
		nrcLogD("Content close symbol != %02x, but %02x", '$', uartMsgBuf[4 + contentLen]); return -1;
	}
	int8_t dummyBytesCount = msgNumOfBytes - (4 + contentLen + 1 + 4);
	if (dummyBytesCount < 0) {
		nrcLogD("Bad uart package size"); return -1;
	}
	uint32_t packageSum = *((uint32_t*)&uartMsgBuf[msgNumOfBytes - 4]);
	nrcLogV("Calculate checksum"); 
	uint32_t checkSum = crc_calc(uartMsgBuf, msgNumOfBytes - 4);
	if (packageSum != checkSum) {
		nrcLogD("Check sum's are not equal: in package %x, but calculated %x", packageSum, checkSum);
		return -1;
	}
	memcpy(msgContentBuf, &uartMsgBuf[4], contentLen);
	return contentLen;
}

typedef enum {
	NO_MSG = 0,
	MSG_BEGIN,
	CONTENT,
	MSG_END,
	CHECK_SUM
} MessageReceiverState;

uint8_t uartReceiveBuf[UART_RECEIVE_BUF_SIZE];

long receiveMsg(uint8_t contentBuf[])
{
	uint16_t byteCounter = 0; // счетчик принятых байтов
	uint16_t contentLen = 0; // ожидаемое количество байтов полезного контента в пакете
	MessageReceiverState state = NO_MSG;
	while (1) {
		// побайтно читаем данные из потока, и ищем упакованные сообщения
		uint8_t receivedByte = uartReceiveByte();
		if (state != NO_MSG) {
			if (byteCounter < UART_RECEIVE_BUF_SIZE) {
				uartReceiveBuf[byteCounter] = receivedByte;
			}
			else {
				nrcLog("Error: receive buffer overflow");
				return -1;
			}
		}

		switch (state) {
		case NO_MSG: {
			if (receivedByte == '^') {
				state++;
				byteCounter = 0; uartReceiveBuf[0] = '^';
			}
			break; }
		case MSG_BEGIN: {
			if (byteCounter == 3) {
				if (receivedByte == '^') {
					state++;
					contentLen = *((uint16_t*)&uartReceiveBuf[1]);
					if (contentLen > UART_RECEIVE_BUF_SIZE) {
						nrcLog("Error: too large packet, uartReceiveBufSize == %d, but required %d", UART_RECEIVE_BUF_SIZE, contentLen);
						return -1;
					}
					else {
						nrcLogV("Package begin detected: msg lenght == %d", contentLen);
					}
				}
				else {
					state = NO_MSG;
					nrcLog("Wrong package");
					nrcLogD("Because: bad begin");
				}
			}
			break; }
		case CONTENT: {
			if (byteCounter == 4 + contentLen) {
				if (receivedByte == '$') {
					state++;
					nrcLogV("Package end detected");
				}
				else {
					nrcLog("Wrong package")
						nrcLogD("Because: bad message end");
				}
			}
			break; }
		case MSG_END: {
			if ((byteCounter & 0x0003) == 0) { // последняя тетрада байт
				state++;
				nrcLogV("Check sum detected");
			}
			break; }
		case CHECK_SUM: {
			if ((byteCounter & 0x0003) == 3) { // последний байт пакета
				// перепроверяем пакет целиком, включая контрольную сумму
				long validContentLen = getMsgContent(contentBuf, uartReceiveBuf, byteCounter + 1);
				nrcLogV("Returned contentLen == %d", validContentLen);
				for (uint16_t i = 0; i < byteCounter + 1; i++) {
					nrcPrintfV("%02x ", uartReceiveBuf[i]);
				}
				nrcPrintfV("\n");

				if (validContentLen < 0) {
					nrcLog("Wrong package");
					nrcLogD("Because: bad checksum");
				}
				else {
					nrcLogD("Package received!");
					contentBuf[validContentLen] = '\0';
					return validContentLen;
				}
				state = NO_MSG;
			}
			break; }
		default: break;
		}

		byteCounter++;
	}
}

uint8_t uartTransmitBuf[UART_TRANSMIT_BUF_SIZE];

long transmitMsg(uint8_t msgContent[], uint16_t contentLen)
{
	long msgLen = createUartMsg(uartTransmitBuf, msgContent, contentLen);
	if (msgLen > UART_TRANSMIT_BUF_SIZE) {
		nrcLog("Error: Too large bytesCount for transmit, current uartTransmitBufSize == %d, but required ", UART_TRANSMIT_BUF_SIZE, msgLen);
		return 0;
	}
	return uartTransmitData(uartTransmitBuf, msgLen);
}
