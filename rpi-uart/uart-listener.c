#include <string.h> // strcpy() memcpy()
#include <stdbool.h> // bool
#include <errno.h> // errno
#include <fcntl.h>  // O_RDONLY, O_WRONLY, etc.
#include <sys/stat.h> // stat() - used in isFileExists()
//#include <sys/types.h> 
#include <unistd.h> // read(), open(), write(), pipe() etc.

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h" // getMsgContent()
#include <uart_config.h> // UART_RECEIVE_BUF_SIZE
#include <stdio.h> // printf, stdout etc.
#include "../nrc_print.h" // nrcLog?() nrcPrintf?()

#include <stdlib.h> // atoi
#include <unistd.h> // getopt(), getopt_long()
#include <getopt.h> // ^

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;

unsigned char logLevelGlobal = NRC_LOG_LEVEL_DEFAULT;

long receiveMsg(uint8_t contentBuf[]);
bool isFileExists(const char *name);

typedef enum {
	NO_MSG = 0,
	MSG_BEGIN,
	CONTENT,
	MSG_END,
	CHECK_SUM
} MessageReceiverState;

uint8_t uartReceiveBuf[UART_RECEIVE_BUF_SIZE];


int main(int argc, char *argv[])
{
	static struct option long_opt[] = {
		{"help",  0, NULL, 'h'},
		{"log", 1, NULL, 'l'},
		{0,0,0,0}
	};

	int opt, optIdx;
	while ((opt = getopt_long(argc, argv, "l:h", long_opt, &optIdx)) != -1) {
		switch (opt) {
		case 'h': {
			nrcLog("Sorry, help not ready, bye."); return(-1);
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
			printf("%s\n", msgContent); fflush(stdout);
		}
	}
	//close(fifoDescriptor); 
}

long receiveMsg(uint8_t contentBuf[])
{
	uint16_t byteCounter = 0; // счетчик принятых байтов
	uint16_t contentLen = 0; // ожидаемое количество байтов полезного контента в пакете
	uint8_t receivedByte;
	MessageReceiverState state = NO_MSG;
	while (1) {
		// побайтно читаем данные из потока, и ищем упакованные сообщения
		receivedByte = serialGetchar(uartDescriptor);

		if (state != NO_MSG) {
			if (byteCounter < UART_RECEIVE_BUF_SIZE) {
				uartReceiveBuf[byteCounter] = receivedByte;
			}
			else {
				nrcLog("Error: receive buffer overflow");
				return -1;
			}
		}

		switch (state) {
		case NO_MSG: {
			if (receivedByte == '^') {
				state++;
				byteCounter = 0; uartReceiveBuf[0] = '^';
			}
			break; }
		case MSG_BEGIN: {
			if (byteCounter == 3) {
				if (receivedByte == '^') {
					state++;
					contentLen = *((uint16_t*)&uartReceiveBuf[1]);
					if (contentLen > UART_RECEIVE_BUF_SIZE) {
						nrcLog("Error: too large packet, uartReceiveBufSize == %d, but required %d", UART_RECEIVE_BUF_SIZE, contentLen);
						return -1;
					}
					else {
						//nrcLogV("Package begin detected: msg lenght == %d", contentLen);
					}
				}
				else {
					nrcLog("Wrong package");
					nrcLogD("Because: bad begin");
					return -1;
				}
			}
			break; }
		case CONTENT: {
			if (byteCounter == 4 + contentLen) {
				if (receivedByte == '$') {
					state++;
					//nrcLogV("Package end detected");
				}
				else {
					state = NO_MSG;
					nrcLog("Wrong package")
						nrcLogD("Because: bad message end");
					return -1;
				}
			}
			break; }
		case MSG_END: {
			if ((byteCounter & 0x0003) == 0) { // последняя тетрада байт
				state++;
				//nrcLogV("Check sum detected");
			}
			break; }
		case CHECK_SUM: {
			if ((byteCounter & 0x0003) == 3) { // последний байт пакета
				// перепроверяем пакет целиком, включая контрольную сумму
				long validContentLen = getMsgContent(contentBuf, uartReceiveBuf, byteCounter + 1);
				nrcLogV("Returned contentLen == %d", validContentLen);
				for (uint16_t i = 0; i < byteCounter + 1; i++) {
					nrcPrintfV("%02x ", uartReceiveBuf[i]);
				}
				nrcPrintfV("\n");

				if (validContentLen < 0) {
					state = NO_MSG;
					nrcLog("Wrong package");
					nrcLogD("Because: bad checksum");
					return -1;
				}
				else {
					nrcLogD("Package received!");
					contentBuf[validContentLen] = '\0';
					nrcLogV("Received content: %s", contentBuf);
					return validContentLen;
				}
			}
			break; }
		default: break;
		}

		byteCounter++;
	}
	return -1;
}

bool isFileExists(const char *file)
{
	struct stat buf;
	return (stat(file, &buf) == 0);
}


//для примера код чтения из FIFO, просто чтобы был
//fifoDescripror = open(myfifo, O_RDONLY); // Open FIFO for Read only
//read(fifoDescripror, arr, sizeof(arr1)); // Read from FIFO
//nrcLog("User2: %s", arr); // Print the read message
//close(fifoDescriptor); 