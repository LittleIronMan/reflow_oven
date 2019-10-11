#include <stdint.h>
#include "nrc-safe-uart_config.h"

#include <wiringSerial.h>
#include "crc_software_as_stm32_hardware.h"

uint32_t crc_calc(uint8_t pBuffer[], uint16_t NumOfBytes) {
	return stm32_sw_crc32_by_byte(CRC_INITIALVALUE, pBuffer, NumOfBytes);
}

uint16_t uartTransmitData(uint8_t data[], uint16_t bytesCount) {
	for (uint16_t i = 0; i < bytesCount; i++) {
		serialPutchar(uartDescriptor, data[i]);
	}
	return bytesCount;
}
