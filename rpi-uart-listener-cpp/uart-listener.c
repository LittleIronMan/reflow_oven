#include <string.h>
#include <stdbool.h>
#include <errno.h>
#include <fcntl.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <unistd.h> 

#include <wiringSerial.h>

#include "safe_uart/safe_uart_messenger.h"
#include "my_software_stm32_crc.h"
#include "../nrc_print.h"
#define NRC_LOG_NEED_FFLUSH // call fflush(stdout) after each printf(...) call

uint32_t crc_calc_software(uint8_t pBuffer[], uint16_t NumOfBytes) {
	return stm32_sw_crc32_by_byte(CRC_INITIALVALUE, pBuffer, NumOfBytes);
}
uint32_t(*crc_calc) (uint8_t pBuffer[], uint16_t NumOfBytes) = crc_calc_software;

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;

bool isFileExists(const char *name);
void sendToServer(char *msg, int len);

typedef enum {
	NO_MSG = 0,
	MSG_BEGIN,
	CONTENT,
	MSG_END,
	CHECK_SUM
} MessageReceiverState;

int main() {
	nrcLogV("Main func started!");
	int uartDescriptor;
	if ((uartDescriptor = serialOpen(serialPortName, serialBaudRate)) < 0) {
		nrcLog("Unable to open serial port: %s", strerror(errno));
		return 1;
	}  
	else {
		nrcLog("Serial port opened successfull!");
	}

	nrcLogV("Start loop");
	char uartBuf[256]; // буфер, в котором будет храниться передаваемые из контроллера данные(упакованные в посылки)
	uint16_t charCounter = 0; // счетчик символов в буфере
	char contentBuf[256]; // в этом буфере будут хранится распакованные данные
	uint16_t contentLen = 0; // количество ожидаемых символов в буфере
	MessageReceiverState state = NO_MSG;
	while (true) {
		// бесконечно читаем из uart'a по одному символу и передаем принятые строки серверу
		char ch = serialGetchar(uartDescriptor);
		if (state != NO_MSG && charCounter < 256) { uartBuf[charCounter] = ch; }

		switch (state) {
		case NO_MSG: {
			if (ch == '^') {
				state++;
				charCounter = 0; uartBuf[0] = '^';
			}
			break; }
		case MSG_BEGIN: {
			if (charCounter == 3) {
				if (ch == '^') {
					state++;
					contentLen = *((uint16_t*)&uartBuf[1]);
					nrcLogV("Package begin detected: msg lenght == %d", contentLen);
				}
				else {
					state = NO_MSG;
					nrcLog("Wrong package");
					nrcLogD("Because: bad begin");
				}
			}
			break; }
		case CONTENT: {
			if (charCounter == 4 + contentLen) {
				if (ch == '$') {
					state++;
					nrcLogV("Package end detected");
				}
				else {
					nrcLog("Wrong package")
					nrcLogD("Because: bad message end");
				}
			}
			break; }
		case MSG_END: {
			if ((charCounter & 0x0003) == 0) { // последняя тетрада байт
				state++;
				nrcLogV("Check sum detected");
			}
			break; }
		case CHECK_SUM: {
			if ((charCounter & 0x0003) == 3) { // последний байт пакета
				// перепроверяем пакет целиком, включая контрольную сумму
				long validContentLen = getMsgContent(contentBuf, uartBuf, charCounter + 1);
				nrcLogV("Returned contentLen == %d", validContentLen);
				for (uint16_t i = 0; i < charCounter + 1; i++) {
					nrcPrintfV("%02x ", uartBuf[i]);
				}
				nrcPrintfV("\n");

				if (validContentLen < 0) {
					nrcLog("Wrong package");
					nrcLogD("Because: bad checksum");
				}
				else {
					nrcLogD("Package received!");
					contentBuf[validContentLen] = '\0';
					nrcPrintf("%s", contentBuf);
				}
				state = NO_MSG;
			}
			break; }
		default: break;
		}

		charCounter++;
	}
	//close(fifoDescriptor); 
}

bool isFileExists(const char *file) {
	struct stat buf;
	return (stat(file, &buf) == 0);
}

void sendToServer(char *msg, int len) {
	
	//для примера код чтения из FIFO, просто чтобы был
	//fifoDescripror = open(myfifo, O_RDONLY); // Open FIFO for Read only
	//read(fifoDescripror, arr, sizeof(arr1)); // Read from FIFO
	//nrcLog("User2: %s", arr); // Print the read message
	//close(fifoDescriptor); 
}
