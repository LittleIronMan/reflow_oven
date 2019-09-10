#include <stdint.h>
#include <uart_config.h>

#include <wiringSerial.h>
#include "../../my_software_stm32_crc.h"

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes) {
	return stm32_sw_crc32_by_byte(CRC_INITIALVALUE, pBuffer, NumOfBytes);
}

uint16_t uartTransmitData(uint8_t data[], uint16_t bytesCount) {
	return 0; // no action
}
