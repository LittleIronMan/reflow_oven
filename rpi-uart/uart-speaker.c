#include <string.h> // strlen
#include <errno.h>
#include <stdbool.h>

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h"
#include "../nrc_print.h"

#include <unistd.h>
#include <getopt.h>

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;


int main(int argc, char *argv[])
{
	char *data = NULL;

	static struct option long_opt[] = {
		{"help",  0, 0, 'h'},
		{"send", 1, 0, 's'},
		{0,0,0,0}
	};

	while (1) {
		int opt;
		int optIdx;

		if ((opt = getopt_long(argc, argv, "s:h", long_opt, &optIdx)) == -1) {
			break;
		}

		switch (opt) {
		case 'h': {
			nrcLog("Sorry, help not ready, bye.");
			//usage(argv[0]);
			return(-1);
		}
		case 's': {
			//printf("option 'c' selected, filename: %s\n", optarg);
			//return(0);
			data = optarg;
			break;
		}
		default:
			//usage(argv[0]);
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
