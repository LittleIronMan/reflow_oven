#include <string.h> // strcpy() memcpy()
#include <stdbool.h> // bool
#include <errno.h> // errno
#include <fcntl.h>  // O_RDONLY, O_WRONLY, etc.
#include <sys/stat.h> // stat() - used in isFileExists()

#include <wiringSerial.h>

#include "nrc-safe-uart.h" // getMsgContent()
#include <stdio.h> // printf, stdout etc.
#include "nrc-print.h" // nrcLog?() nrcPrintf?()
#include "base64.h" // base64(), unbase64()

#include <stdlib.h> // atoi
#include <getopt.h> // getopt(), getopt_long()
#ifndef NRC_WINDOWS_SIMULATOR
#include <unistd.h> // optarg
#endif

const uint8_t errMsgType = 0; // PB_MsgType_UNDEFINED

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
int uartDescriptor;

unsigned char logLevelGlobal = NRC_LOG_LEVEL_DEFAULT;

uint8_t receiveMsg(uint8_t contentBuf[], uint16_t *contentLen);
bool isFileExists(const char *name);

typedef enum {
	NO_MSG = 0,
	MSG_BEGIN,
	MSG_TYPE,
	CONTENT,
	MSG_END,
	CHECK_SUM,
	MSG_SUCCESFULL_RECEIVED
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
		nrcLogD("Serial port opened successful!");
	}

	nrcLogV("Start loop");

	uint8_t pbEncodedMsgContent[UART_RECEIVE_BUF_SIZE];
	uint8_t msgType = errMsgType;
	uint16_t msgLen = 0;

	while (true) {
		msgType = receiveMsg(pbEncodedMsgContent, &msgLen);
		if (msgType == errMsgType) {
			nrcLogD("Wrong message");
		}
		else {
			nrcLogD("Received message with type %d and length %d bytes!", msgType, msgLen);
			int b64Len = 0;
			char *b64encoded = base64(pbEncodedMsgContent, msgLen, &b64Len);
			nrcLogD("base64 content: %s", b64encoded);
		}
	}
	//close(fifoDescriptor); 
}

uint8_t receiveMsg(uint8_t contentBuf[], uint16_t *contentLen)
{
	uint16_t byteCounter = 0; // счетчик принятых байтов
	uint8_t receivedByte;
	MessageReceiverState state = NO_MSG;
	uint8_t msgType = errMsgType;

	while (1) {
		// побайтно читаем данные из потока, и ищем упакованные сообщения
		receivedByte = serialGetchar(uartDescriptor);

		if (state != NO_MSG) {
			if (byteCounter < UART_RECEIVE_BUF_SIZE) {
				uartReceiveBuf[byteCounter] = receivedByte;
			}
			else {
				nrcLogD("Error: receive buffer overflow");
				return errMsgType;
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
					*contentLen = *((uint16_t*)&uartReceiveBuf[1]);
					if (*contentLen > UART_RECEIVE_BUF_SIZE) {
						nrcLogD("Error: too large packet, uartReceiveBufSize == %d, but required %d", UART_RECEIVE_BUF_SIZE, *contentLen);
						return errMsgType;
					}
					else {
						//nrcLogV("Package begin detected: msg lenght == %d", contentLen);
					}
				}
				else {
					nrcLogD("Wrong package: bad begin");
					return errMsgType;
				}
			}
			break; }
		case MSG_TYPE: {
			if (byteCounter == 4) {
				if (receivedByte != errMsgType) {
					state++;
				}
				else {
					nrcLogD("Wrong package: undefined message type");
					return errMsgType;
				}
			}
			break; }
		case CONTENT: {
			if (byteCounter == 5 + *contentLen) {
				if (receivedByte == '$') {
					state++;
					//nrcLogV("Package end detected");
				}
				else {
					state = NO_MSG;
					nrcLogD("Wrong package: bad message end");
					return errMsgType;
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
			if ((byteCounter & 0x0003) == 3) { // последний байт всего пакета
				// перепроверяем пакет целиком, включая контрольную сумму
				msgType = getMsgType(uartReceiveBuf, byteCounter + 1);
				if (msgType == errMsgType) {
					state = NO_MSG;
					nrcLogD("Wrong package: bad checksum... or something else");
					return errMsgType;
				}
				else {
					state++; // MSG_SUCCESFULL_RECEIVED
				}
			}
			break; }
		default: break;
		}

		if (state == MSG_SUCCESFULL_RECEIVED) {
			uint8_t *dataBegin = getMsgContent(uartReceiveBuf, contentLen);
			memcpy(contentBuf, dataBegin, *contentLen);
			return msgType;
		}

		byteCounter++;
	}
	return errMsgType;
}

bool isFileExists(const char *file)
{
	struct stat buf;
	return (stat(file, &buf) == 0);
}


//для примера код чтения из FIFO для linux, просто чтобы был
//fifoDescripror = open(myfifo, O_RDONLY); // Open FIFO for Read only
//read(fifoDescripror, arr, sizeof(arr1)); // Read from FIFO
//nrcLog("User2: %s", arr); // Print the read message
//close(fifoDescriptor); 