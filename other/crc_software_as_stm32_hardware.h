#ifndef my_software_stm32_crc_h
#define my_software_stm32_crc_h

#include <stdint.h>

extern const uint32_t CRC_INITIALVALUE;

uint32_t stm32_sw_crc32_by_bit(uint32_t crc32, uint8_t pBuffer[], uint32_t NumOfByte);
uint32_t stm32_sw_crc32_by_nibble(uint32_t crc32, uint8_t pBuffer[], uint32_t NumOfByte);
uint32_t stm32_sw_crc32_by_byte(uint32_t crc32, uint8_t pBuffer[], uint32_t NumOfByte);

#endif // my_software_stm32_crc_h
