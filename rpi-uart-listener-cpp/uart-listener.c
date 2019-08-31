#include <stdio.h>
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
uint32_t crc_calc_software(uint8_t pBuffer[], uint16_t NumOfBytes) {
	return stm32_sw_crc32_by_byte(CRC_INITIALVALUE, pBuffer, NumOfBytes);
}
uint32_t(*crc_calc) (uint8_t pBuffer[], uint16_t NumOfBytes) = crc_calc_software;

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
char *uartToServerFifo = "/tmp/uart-server.fifo";

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
	printf("Main func started!\n"); fflush(stdout);
	int uartDescriptor;
	if ((uartDescriptor = serialOpen(serialPortName, serialBaudRate)) < 0) {
	printf("Unable to open serial port: %s\n", strerror(errno)); fflush(stdout);
		return 1;
	}  
	else {
		printf("Serial port opened successfull!\n"); fflush(stdout);
	}

	printf("Check fifo\n"); fflush(stdout);
	if (!isFileExists(uartToServerFifo)) {
		printf("Create new fifo\n"); fflush(stdout);
		mkfifo(uartToServerFifo, 0666);
	}
  
	int fifoDescriptor = open(uartToServerFifo, O_WRONLY);
	if (fifoDescriptor < 0) {
	fprintf(stderr, "Cannot open FIFO for read: %s\n", strerror(errno));
		return 1;
	}

	printf("Start loop\n"); fflush(stdout);
	char uartBuf[256]; // буфер, в котором будет храниться передаваемые из контроллера данные(упакованные в посылки)
	uint16_t charCounter = 0; // счетчик символов в буфере
	char contentBuf[256]; // в этом буфере будут хранится распакованные данные
	uint16_t contentLen = 0; // количество ожидаемых символов в буфере
	MessageReceiverState state = NO_MSG;
	while (true) {
		// бесконечно читаем из uart'a по одному символу и передаем принятые строки серверу
		char ch = serialGetchar(uartDescriptor);
		if (state != NO_MSG && charCounter < 256) { uartBuf[charCounter] = ch; }
		// putchar(ch); fflush(stdout);
		printf("%02x ", ch);

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
					printf("Package begin detected: msg lenght == %d\n", contentLen); fflush(stdout);
				}
				else {
					state = NO_MSG;
					printf("Wrong package: bad begin\n"); fflush(stdout);
				}
			}
			break; }
		case CONTENT: {
			if (charCounter == 4 + contentLen) {
				if (ch == '$') {
					state++;
					printf("Package end detected\n"); fflush(stdout);
				}
				else {
					printf("Wrong package: bad message end\n"); fflush(stdout);
				}
			}
			break; }
		case MSG_END: {
			if ((charCounter & 0x0003) == 0) {
				state++;
				printf("Check sum detected\n"); fflush(stdout);
			}
			else if (charCounter >= 4 + contentLen + 4) {
				state = NO_MSG;
			}
			break; }
		case CHECK_SUM: {
			if ((charCounter & 0x0003) == 0) {
				// перепроверяем пакет целиком, включая контрольную сумму
				long validContentLen = getMsgContent(contentBuf, uartBuf, charCounter + 1);
				printf("Returned contentLen == %d\n", validContentLen); fflush(stdout);
				for (uint16_t i = 0; i < charCounter + 1; i++) {
					printf("%02x ", uartBuf[i]);
				}
				printf("\n"); fflush(stdout);

				if (validContentLen < 0) {
					printf("Wrong package: bad checksum\n"); fflush(stdout);
				}
				else {
					printf("Package received!\n"); fflush(stdout);
					contentBuf[validContentLen] = '\n';
					//sendToServer(buf, charCounter);
					write(fifoDescriptor, uartBuf, validContentLen + 1);
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
	//printf("User2: %s\n", arr); // Print the read message
	//close(fifoDescriptor); 
}
