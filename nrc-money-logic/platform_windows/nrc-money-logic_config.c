#include "nrc-money-logic.h"
//#include "nrc-money-logic_config.h"
#include "nrc-safe-uart_config.h"
#include "nrc-print.h"
#include <windows.h>

const uint32_t kReceiveIRQ_No = 1;
const uint32_t kTransmitIRQ_No = 2;

DWORD WINAPI receiverIRQ_generator(LPVOID lpParameter)
{
	nrcLogD("Run receiverIRQ_generator");
	nrcLogD("Try create named pipe");
	// пример кода взят отсюда: https://stackoverflow.com/questions/26561604/create-named-pipe-c-windows
	HANDLE hPipe;
	LPTSTR pipename = TEXT("\\\\..\\temp\\Rx_pipe");
	hPipe = CreateNamedPipe(pipename,
		PIPE_ACCESS_INBOUND,		// read/write access
		PIPE_TYPE_BYTE |			// pipe type
		PIPE_READMODE_BYTE |		// pipe mode
		PIPE_WAIT,					// blocking mode
		// FILE_FLAG_FIRST_PIPE_INSTANCE // is not needed but forces CreateNamedPipe(..) to fail if the pipe already exists...
		1,							// max. instances
		UART_RECEIVE_BUF_SIZE,		// output buffer size
		UART_RECEIVE_BUF_SIZE,		// input buffer size
		NMPWAIT_USE_DEFAULT_WAIT,	// client time-out
		NULL);						// default security attribute

	if (hPipe == INVALID_HANDLE_VALUE) {
		nrcLogD("CreateNamedPipe failed, GLE=%d", GetLastError());
	}
	else {
		nrcLogD("Named pipe succesfull created");
	}

	while (hPipe != INVALID_HANDLE_VALUE)
	{
		if (ConnectNamedPipe(hPipe, NULL) != FALSE)   // wait for someone to connect to the pipe
		{
			// заполняем псевдо-DMA - буфер
			while (ReadFile(hPipe, dmaRxBuf.arr, dmaRxBuf.size, &dmaRxBuf.curCNDTR, NULL) != FALSE)
			{
				nrcLogD("receiverIRQ_generator - Received %d bytes", dmaRxBuf.curCNDTR);
				vPortGenerateSimulatedInterrupt(kReceiveIRQ_No);
				nrcLogD("receiverIRQ_handler exit");
				dmaRxBuf.curCNDTR = 0;
			}
		}
		DisconnectNamedPipe(hPipe);
	}

	return 0;
}

uint32_t receiverIRQ_handler()
{
	nrcLogD("receiverIRQ_handler start");
	NRC_UART_EventType type = NRC_EVENT_TRANSFER_COMPLETED;
	if (dmaRxBuf.curCNDTR == dmaRxBuf.size) { type = NRC_EVENT_FULL_BUF; }
	NRC_UART_RxEvent(type, dmaRxBuf.curCNDTR);
}

void money_initReceiverIRQ()
{
	SetThreadPriority(CreateThread(NULL, 0, receiverIRQ_generator, NULL, 0, NULL), THREAD_PRIORITY_ABOVE_NORMAL);
	vPortSetInterruptHandler(kReceiveIRQ_No, receiverIRQ_handler);
}
