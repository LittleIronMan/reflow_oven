#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <unistd.h> 

#include <wiringSerial.h>
#include <safe_uart/safe_uart_messenger.h>

char *serialPortName = "/dev/ttyAMA0";
unsigned long serialBaudRate = 115200;
char *uartToServerFifo = "/tmp/uart-server.fifo";

bool isFileExists(const char *name);
void sendToServer(char *msg, int len);

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
	char contentBuf[256]; // в этом буфере будут хранится распакованные данные
	unsigned int charCounter = 0; // счетчик символов в буфере
	while (true) {
		// бесконечно читаем из uart'a по одному символу и передаем принятые строки серверу
		char ch = serialGetchar(uartDescriptor);
		putchar(ch);
		uartBuf[charCounter] = ch;
		if (ch == '\0') {
			long contextLen = getMsgContent(contentBuf, uartBuf, charCounter - 1);
			if (contextLen < 0) {
				printf("\nWrong package!\n"); fflush();
			}
			else {
				contextBuf[contextLen] = '\n';
				//sendToServer(buf, charCounter);
				write(fifoDescriptor, uartBuf, contextLen + 1); 
			}
			charCounter = 0;
		}
		else {
			charCounter++;
		}
		fflush(stdout);
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
