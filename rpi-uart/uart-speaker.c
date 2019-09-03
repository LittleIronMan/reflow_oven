#include <string.h> // strlen
#include <errno.h>
#include <stdbool.h>

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h"
#include "../nrc_print.h"

#include <stdlib.h> // atoi
#include <unistd.h> // getopt(), getopt_long()
#include <getopt.h> // ^

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;

unsigned char logLevelGlobal = NRC_LOG_LEVEL_DEFAULT;

int main(int argc, char *argv[])
{
	static struct option long_opt[] = {
		{"help",  0, NULL, 'h'},
		{"send", 1, NULL, 's'},
		{"log", 1, NULL, 'l'},
		{0,0,0,0}
	};

	char *data = NULL;

	while ((opt = getopt_long(argc, argv, "s:l:h", long_opt, &optIdx)) != -1) {
		int opt, optIdx;

		switch (opt) {
		case 'h': {
			nrcLog("Sorry, help not ready, bye."); return(-1);
		}
		case 's': {
			data = optarg;
			break;
		}
		case 'l': {
			int tmp = atoi(optarg);
			if (tmp < NRC_LOG_LEVEL_VERBATIM && tmp >= 0) {
				logLevelGlobal = tmp;
			}
			break;
		}
		default:
			return(-1);
		}
	}

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
			nrcLogD("Serial port opened successful!");
		}

		uint16_t len = strlen(data);
		nrcLog("Send data: %s", data);
		if (data[0] == '\"') {
			transmitMsg(&data[1], len - 2);
		}
		else {
			transmitMsg(data, len);
		}
	}

	return 0;
}
