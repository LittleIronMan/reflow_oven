#include <string.h> // strlen
#include <algorithm> // find

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h"
#include "../nrc_print.h"

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;

// следующие 2 функции взяты отсюда:
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

		if ((uartDescriptor = serialOpen(serialPortName, serialBaudRate)) < 0) {
			nrcLog("Unable to open serial port: %s", strerror(errno));
			return 1;
		}
		else {
			nrcLog("Serial port opened successful!");
		}

		uint16_t len = strlen(data);
		if (data[0] == '\"') {
			transmitMsg(&data[1], len - 2);
		}
		else {
			transmitMsg(data, len);
		}
	}

	return 0;
}