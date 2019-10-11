#ifndef crc_software_as_stm32_hardware_h
#define crc_software_as_stm32_hardware_h

#include <stdint.h>

extern const uint32_t CRC_INITIALVALUE;

uint32_t stm32_sw_crc32_by_bit(uint32_t crc32, uint8_t pBuffer[], uint32_t NumOfByte);
uint32_t stm32_sw_crc32_by_nibble(uint32_t crc32, uint8_t pBuffer[], uint32_t NumOfByte);
uint32_t stm32_sw_crc32_by_byte(uint32_t crc32, uint8_t pBuffer[], uint32_t NumOfByte);

#endif // crc_software_as_stm32_hardware_h
