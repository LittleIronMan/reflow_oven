#include <stdint.h>
#include <uart_config.h>

#include "main.h"

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes)
{
	return HAL_CRC_Calculate(&hcrc, (uint32_t*)&pBuffer[0], NumOfBytes >> 2);
}

uint8_t uartReceiveByte()
{
	uint8_t receivedByte;
	HAL_StatusTypeDef result;
	do {
		result = HAL_UART_Receive(&huart1, &receivedByte, 1, HAL_MAX_DELAY);
	} while (result != HAL_OK);
	return receivedByte;
}

uint16_t uartTransmitData(uint8_t data[], uint16_t bytesCount)
{
	HAL_StatusTypeDef result = HAL_UART_Transmit(&huart1, data, bytesCount, HAL_MAX_DELAY);
	if (result == HAL_OK) {
		return bytesCount;
	}
	else {
		return 0;
	}
}
