#include <stdint.h>
#include <uart_config.h>

#include <nrc_print.h>
#include "main.h"

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes)
{
	return HAL_CRC_Calculate(&hcrc, (uint32_t*)&pBuffer[0], NumOfBytes >> 2);
}

uint16_t uartTransmitData(uint8_t data[], uint16_t bytesCount)
{
	TxBuf.state = BufState_USED_BY_DMA;

	HAL_StatusTypeDef result = HAL_UART_Transmit_DMA(&huart1, data, bytesCount);

	if (result == HAL_OK) {
		return bytesCount;
	}
	else {
		nrcLogD("Transmit error. HAL status == %d", result);
		return 0;
	}
}
