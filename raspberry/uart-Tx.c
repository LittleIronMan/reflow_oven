#include <string.h> // strlen
#include <errno.h>
#include <stdbool.h>

#include <wiringSerial.h>

#include "nrc-safe-uart.h"
#include "nrc-print.h"
#include "base64.h" // base64(), unbase64()
#include "nrc-safe-uart.h" // UART_TRANSMIT_BUF_SIZE

#include <stdlib.h> // atoi
#include <getopt.h> // getopt(), getopt_long() + если проект компилируется под windows, то еще и переменные optarg, optind, opterr, optopt. Для linux эти переменные определены в unistd.h
#ifndef _MSC_VER
#include <unistd.h> // optarg, optind, opterr, optopt - для linux
#endif

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;

unsigned char logLevelGlobal = NRC_LOG_LEVEL_DEFAULT;

uint8_t uartTransmitBuf[UART_TRANSMIT_BUF_SIZE];

int main(int argc, char *argv[])
{
	static struct option long_opt[] = {
		{"help",  0, NULL, 'h'},
		{"send", 1, NULL, 's'},
		{"type", 1, NULL, 't'},
		{"base64", 0, NULL, 'b'},
		{"log", 1, NULL, 'l'},
		{0,0,0,0}
	};

	char *data = NULL;
	bool isBase64 = false;
	uint8_t dataType = 0;

	int opt, optIdx;
	while ((opt = getopt_long(argc, argv, "s:t:bl:h", long_opt, &optIdx)) != -1) {
		switch (opt) {
		case 'h': {
			nrcLog("Sorry, help not ready, bye."); return(-1);
		}
		case 's': {
			data = optarg;
			break;
		}
		case 't': {
			dataType = atoi(optarg);
			break;
		}
		case 'b': {
			isBase64 = true;
			break;
		}
		case 'l': {
			int tmp = atoi(optarg);
			if (tmp <= NRC_LOG_LEVEL_VERBATIM && tmp >= 0) {
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

		int len = strlen(data);
		uint8_t *decodedData;
		int decodedLen;

		if (isBase64) {
			nrcLogD("Transmit %d symbols base64 str: %s", len, data);
			decodedData = unbase64(data, len, &decodedLen);
		}
		else {
			decodedLen = len;
			decodedData = data;
		}

		if (!isBase64 && decodedData[0] == '\"') {
			decodedData++;
			decodedLen -= 2;
		}

		nrcPrintfD("Send %d bytes:", decodedLen);
		for (int i = 0; i < decodedLen; i++) {
			nrcPrintfD(" %02hhX", decodedData[i]);
		}
		nrcPrintfD("\n");

		transmitMsg(dataType, decodedData, decodedLen, uartTransmitBuf);
	}

#if (defined(NRC_WINDOWS_SIMULATOR) && defined(_DEBUG))
	printf("Press Any Key to Continue\n");
	getch();
#endif

	return 0;
}
