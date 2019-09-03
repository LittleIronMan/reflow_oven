#include <string.h> // strcpy() memcpy()
#include <stdbool.h> // bool
#include <errno.h> // errno
#include <fcntl.h>  // O_RDONLY, O_WRONLY, etc.
#include <sys/stat.h> // stat() - used in isFileExists()
//#include <sys/types.h> 
#include <unistd.h> // read(), open(), write(), pipe() etc.

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h" // receiveMsg()
#include "../nrc_print.h" // nrcLog?() nrcPrintf?()

#include <stdlib.h> // atoi
#include <unistd.h> // getopt(), getopt_long()
#include <getopt.h> // ^

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;

unsigned char logLevelGlobal = NRC_LOG_LEVEL_DEFAULT;

bool isFileExists(const char *name);

int main(int argc, char *argv[])
{
	static struct option long_opt[] = {
		{"help",  0, NULL, 'h'},
		{"log", 1, NULL, 'l'},
		{0,0,0,0}
	};

	while ((opt = getopt_long(argc, argv, "l:h", long_opt, &optIdx)) != -1) {
		int opt, optIdx;

		switch (opt) {
		case 'h': {
			nrcLog("Sorry, help not ready, bye."); return(-1);
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

	nrcLogV("Main func started!");
	if ((uartDescriptor = serialOpen(serialPortName, serialBaudRate)) < 0) {
		nrcLog("Unable to open serial port: %s", strerror(errno));
		return 1;
	}  
	else {
		nrcLog("Serial port opened successful!");
	}

	nrcLogV("Start loop");

	uint8_t msgContent[256];

	while (true) {
		long msgLen = receiveMsg(msgContent);
		if (msgLen < 0) {
			nrcLog("Wrong message");
		}
		else {
			printf("%s\n", msgContent);
		}
	}
	//close(fifoDescriptor); 
}

bool isFileExists(const char *file) {
	struct stat buf;
	return (stat(file, &buf) == 0);
}

//для примера код чтения из FIFO, просто чтобы был
//fifoDescripror = open(myfifo, O_RDONLY); // Open FIFO for Read only
//read(fifoDescripror, arr, sizeof(arr1)); // Read from FIFO
//nrcLog("User2: %s", arr); // Print the read message
//close(fifoDescriptor); 
