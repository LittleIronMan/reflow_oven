#include "nrc-safe-uart.h"
#include "nrc-print.h"
#include <string.h>

uint16_t createUartMsg(uint8_t uartMsgBuf[], uint8_t type, uint8_t msgContentBuf[], uint16_t contentNumOfBytes)
{
	uint16_t offset = 0;

	// первый байт - символ начала сообщения
	uartMsgBuf[offset] = '^';
	offset++;

	// второй и третий байты - количество байтов полезного контента передаваемого пакета
	*((uint16_t*)&uartMsgBuf[offset]) = contentNumOfBytes;
	offset += 2;

	// четвертый байт - второй символ начала пакета(вместе с первым символом они обрамляют количество байтов полезного контента)
	uartMsgBuf[offset] = '^';
	offset++;

	// пятый байт - тип сообщения, чтобы принимающая сторона смогла его правильно декодировать
	uartMsgBuf[offset] = type;
	offset++;

	// копируем полезный контент
	memcpy(&uartMsgBuf[offset], msgContentBuf, contentNumOfBytes);
	offset += contentNumOfBytes;

	uartMsgBuf[offset] = '$'; // символ конца полезного контента
	offset++;

	// добавляем несколько пустых байт(dummyBytesCount),
	// чтобы [5(байты в начале пакета) + contentNumOfBytes + 1(символ конца пакета) + dummyBytesCount] было кратно 4
	uint8_t tmp = ((5 + contentNumOfBytes + 1) & 0x0003); // остаток от деления на 4
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

uint8_t getMsgType(uint8_t uartMsgBuf[], uint16_t msgNumOfBytes)
{
	const uint8_t errType = 0; // MsgType_UNDEFINED
	if (msgNumOfBytes <= 9) {
		nrcLogD("Too little bytes count: %d", msgNumOfBytes); return errType;
	}
	if (uartMsgBuf[0] != '^' || uartMsgBuf[3] != '^') {
		nrcLogD("Bad package begin"); return errType;
	}
	uint16_t contentLen = *((uint16_t*)&uartMsgBuf[1]);
	int8_t dummyBytesCount = msgNumOfBytes - (5 + contentLen + 1 + 4);
	if (dummyBytesCount < 0) {
		nrcLogD("Bad uart package size, dummyBytesCount == %d", dummyBytesCount); return errType;
	}
	if (uartMsgBuf[5 + contentLen] != '$') {
		nrcLogD("Content close symbol != %02x, but %02x", '$', uartMsgBuf[5 + contentLen]); return errType;
	}
	uint32_t packageSum = *((uint32_t*)&uartMsgBuf[msgNumOfBytes - 4]);
	nrcLogV("Calculate checksum"); 
	uint32_t checkSum = crc_calc(uartMsgBuf, msgNumOfBytes - 4);
	if (packageSum != checkSum) {
		nrcLogD("Check sum's are not equal: in package %x, but calculated %x", packageSum, checkSum);
		return errType;
	}
	return uartMsgBuf[4];
}

long getMsgContent(uint8_t msgContentBuf[], uint8_t uartMsgBuf[], uint16_t msgNumOfBytes)
{
	uint16_t contentLen = *((uint16_t*)&uartMsgBuf[1]);
	memcpy(msgContentBuf, &uartMsgBuf[5], contentLen);
	return contentLen;
}

long transmitMsg(uint8_t type, uint8_t msgContent[], uint16_t contentLen, uint8_t uartTransmitBuf[])
{
	// проверяем что данные, будучи упакованными, "влезут" в массив uartTransmitBuf
	uint8_t rest = ((contentLen + 1) & 0x3); // остаток от деления на 4
	long msgLen = 4 + contentLen + 1 + (rest ? (4 - rest) : 0) + 4;
	if (msgLen > UART_TRANSMIT_BUF_SIZE) {
		nrcLog("Error: Too large bytesCount for transmit, current uartTransmitBufSize == %d, but required ", UART_TRANSMIT_BUF_SIZE, msgLen);
		return 0;
	}
	msgLen = createUartMsg(uartTransmitBuf, type, msgContent, contentLen);
	uint16_t result = uartTransmitData(uartTransmitBuf, msgLen);
	if (result != msgLen) {
		nrcLogD("Transmit error");
	}
	return result;
}

#include <wiringSerial.h>
#if defined(NRC_RPI_UART_TX) || defined(NRC_RPI_UART_RX)
#include "crc_software_as_stm32_hardware.h"
#elif defined(NRC_STM32)
#include "main.h"
#endif

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes) {
#if defined(NRC_RPI_UART_TX) || defined(NRC_RPI_UART_RX)
	return stm32_sw_crc32_by_byte(CRC_INITIALVALUE, pBuffer, NumOfBytes);
#elif defined(NRC_STM32)
	return HAL_CRC_Calculate(&hcrc, (uint32_t*)&pBuffer[0], NumOfBytes >> 2);
#endif
}

uint16_t uartTransmitData(uint8_t data[], uint16_t bytesCount) {
#ifdef NRC_RPI_UART_TX
	for (uint16_t i = 0; i < bytesCount; i++) {
		serialPutchar(uartDescriptor, data[i]);
	}
	return bytesCount;
#elif NRC_RPI_UART_RX
	return 0; // no action
#elif NRC_STM32
	TxBuf.state = BufState_USED_BY_HARDWARE;

	HAL_StatusTypeDef result = HAL_UART_Transmit_DMA(&huart1, data, bytesCount);

	if (result == HAL_OK) {
		return bytesCount;
	}
	else {
		nrcLogD("Transmit error. HAL status == %d", result);
		return 0;
	}
#endif
}
