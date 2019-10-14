#include "wiringSerial.h"
#include <stdbool.h> // bool
#include <windows.h>
#include <stdint.h> // uint8_t, uint16_t
#include "nrc-safe-uart.h" // UART_RECEIVE_BUF_SIZE
#include "nrc-print.h" // nrcLogD

#if (defined(NRC_RPI_UART_RX) && defined(NRC_WINDOWS_SIMULATOR))
	#define USE_WINDOWS_PIPE 1
#else
	#define USE_WINDOWS_PIPE 0
#endif

#if USE_WINDOWS_PIPE
HANDLE hPipe = INVALID_HANDLE_VALUE;
#endif

int serialOpen(const char *device, const int baud)
{
#if USE_WINDOWS_PIPE
	nrcLogD("Try create named pipe");
	// пример кода взят отсюда: https://stackoverflow.com/questions/26561604/create-named-pipe-c-windows
	LPTSTR pipename = TEXT("\\\\.\\pipe\\nrc_tx_pipe");
	hPipe = CreateNamedPipe(pipename,
		PIPE_ACCESS_INBOUND,		// read/write access
		PIPE_TYPE_BYTE |			// pipe type
		PIPE_READMODE_BYTE |		// pipe mode
		PIPE_WAIT |					// blocking mode
		(false ? FILE_FLAG_FIRST_PIPE_INSTANCE : 0), // is not needed but forces CreateNamedPipe(..) to fail if the pipe already exists...
		1,							// max. instances
		0,							// output buffer size
		UART_RECEIVE_BUF_SIZE,		// input buffer size
		NMPWAIT_USE_DEFAULT_WAIT,	// client time-out
		NULL);						// default security attribute

	if (hPipe == INVALID_HANDLE_VALUE) {
		nrcLogD("CreateNamedPipe failed, GLE=%d", GetLastError());
		return -1;
	}
	else {
		nrcLogD("Named pipe succesfull created");
		return 1;
	}
#else
	return 1;
#endif
}

void serialPutchar(const int fd, const unsigned char c)
{

}

void serialPuts(const int fd, const char *s)
{

}

int serialGetchar(const int fd)
{
#if USE_WINDOWS_PIPE
	static uint8_t buf[UART_RECEIVE_BUF_SIZE];
	static uint16_t byteCounter = 0;
	static uint16_t lastMsgLen = 0;

	if (byteCounter == 0) {
		bool success = true;
		if (hPipe != INVALID_HANDLE_VALUE) {
			if (ConnectNamedPipe(hPipe, NULL) != FALSE) { // wait for someone to connect to the pipe
				// несмотря на то что функция называется getchar - читать блок байт из fifo целиком, а возвращать его побайтово
				BOOL readResult = ReadFile(hPipe, buf, sizeof(buf), &lastMsgLen, NULL);
				if (readResult) {
					nrcLogD("serialGetchar simulator - Received %d bytes", lastMsgLen);
					byteCounter = lastMsgLen;
				}
				else { success = false; }
			}
			else { success = false; }
			DisconnectNamedPipe(hPipe);
		}
		else { success = false; }

		if (!success) { return 0; }
	}
	// побайтово возвращаем принятое сообщение
	uint8_t result = buf[lastMsgLen - byteCounter];
	byteCounter--;
	return result;
#else
	return 0;
#endif
}
