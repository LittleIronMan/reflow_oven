#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h> 
#include <sys/stat.h> 
#include <sys/types.h> 
#include <unistd.h> 

#include <wiringSerial.h>

char *serialPortName = "/dev/ttyAMA0";
int serialBaudRate = 115200;
char *uartToServerFifo = "/tmp/uart-server.fifo";

bool isFileExists(const char *name);
void sendToServer(char *msg, int len);

int main() {
    int uartDescriptor;
    if ((uartDescriptor = serialOpen(serialPortName, serialBaudRate)) < 0) {
        fprintf(stderr, "Unable to open serial port: %s\n", strerror(errno));
        return 1;
    }  
	if (!isFileExists(uartToServerFifo)) {
		mkfifo(uartToServerFifo, 0666);
	}
  
	char buf[256]; // буфер, в котором будет храниться передаваемые из контроллера данные
	unsigned int charCounter = 0; // счетчик символов в буфере
    while (true) {
		// бесконечно читаем из uart'a по одному символу и передаем принятые строки серверу
        char ch = serialGetchar(uartDescriptor);
		buf[charCounter] = ch;
		if (ch == '\n') {
			sendToServer(buf, charCounter);
			charCounter = 0;
		}
		else {
			charCounter++;
		}
    }
}

bool isFileExists(const char *name) {
	if (FILE *file = fopen(name, "r")) {
		fclose(file);
		return true;
	}
	else {
		return false;
	}
}

void sendToServer(char *msg, int len) {
	int fifoDescriptor = open(uartToServerFifo, O_WRONLY);
	if (fifoDescriptor < 0) {
        fprintf(stderr, "Cannot open FIFO for read: %s\n", strerror(errno));
		return;
	}
	write(fifoDescriptor, msg, len); 
	close(fifoDescriptor); 
	
	//для примера код чтения из FIFO, просто чтобы был
	//fifoDescripror = open(myfifo, O_RDONLY); // Open FIFO for Read only
	//read(fifoDescripror, arr, sizeof(arr1)); // Read from FIFO
	//printf("User2: %s\n", arr); // Print the read message
	//close(fifoDescriptor); 
}