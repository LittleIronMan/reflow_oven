#include <string.h> // strlen
#include <algorithm> // find

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h"
#include "my_software_stm32_crc.h"
#include "../nrc_print.h"

uint32_t crc_calc_software(uint8_t pBuffer[], uint16_t NumOfBytes) {
	return stm32_sw_crc32_by_byte(CRC_INITIALVALUE, pBuffer, NumOfBytes);
}
uint32_t(*crc_calc) (uint8_t pBuffer[], uint16_t NumOfBytes) = crc_calc_software;

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;

// следующие 2 функции вз€ты отсюда:
// https://stackoverflow.com/a/868894
char * getCmdOption(char **begin, char **end, const std::string &option)
{
	char **itr = std::find(begin, end, option);
	if (itr != end && ++itr != end) {
		return *itr;
	}
	return 0;
}

bool cmdOptionExists(char **begin, char **end, const std::string &option)
{
	return std::find(begin, end, option) != end;
}

int main(int argc, char *argv[])
{
	if (cmdOptionExists(argv, argv + argc, "--send")) {

	}

	char *data = getCmdOption(argv, argv + argc, "--send");

	if (data) {
		//Sends the single byte to the serial device identified by the given file descriptor.
		// void serialPutchar(int fd, unsigned char c);

		//Sends the null - terminated string to the serial device identified by the given file descriptor.
		// void serialPuts(int fd, char *s);

		//Emulates the system printf function to the serial device.
		// void serialPrintf(int fd, char *message, Е);

		int uartDescriptor;
		if ((uartDescriptor = serialOpen(serialPortName, serialBaudRate)) < 0) {
			nrcLog("Unable to open serial port: %s", strerror(errno));
			return 1;
		}
		else {
			nrcLog("Serial port opened successful!");
		}

		uint16_t len = strlen(data);
		for (uint16_t i = 0; i < len; i++) {

		}
	}

	return 0;
}