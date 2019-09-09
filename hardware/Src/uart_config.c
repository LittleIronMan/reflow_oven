#include <stdint.h>
#include <uart_config.h>

#include <nrc_print.h>
#include "main.h"

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes)
{
	return HAL_CRC_Calculate(&hcrc, (uint32_t*)&pBuffer[0], NumOfBytes >> 2);
}

uint8_t uartReceiveByte()
{
	static uint16_t lastGetIdx = 0;
	while(1) {
		if (RxBuf.state == UPDATED) {
			// буфер был обновлен, процессор начинает обрабатывать данные
			RxBuf.state = USED_BY_PROC;
			lastGetIdx = 0;
		}
		else if (RxBuf.state != USED_BY_PROC) {
			continue;
		}
		if (lastGetIdx >= RxBuf.countBytes) continue;
		break;
	}
	uint8_t result = RxArr[lastGetIdx];
	lastGetIdx++;
	return result;
}

uint16_t uartTransmitData(uint8_t data[], uint16_t bytesCount)
{
	while (1) {
		if (TxBuf.state != UPDATED) {
			continue;
		}
		break;
	}
	TxBuf.state = USED_BY_DMA;

	HAL_StatusTypeDef result = HAL_UART_Transmit_DMA(&huart1, data, bytesCount);

	if (result == HAL_OK) {
		return bytesCount;
	}
	else {
		nrcLogD("Transmit error. HAL status == %d", result);
		return 0;
	}
}
