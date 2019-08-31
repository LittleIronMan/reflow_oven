#include "nrc_print.h"

void nrcPrintfEx(uint8_t viewMode, char *fmt, ...)
{
	static char printfBuf[256];
	static uint16_t printfCounter = 1;

	char *resultFmt;
	if (!viewMode) { resultFmt = fmt; }
	else {
		resultFmt = &printfBuf[0];
		if ((viewMode & NRC_LOG_ADD_EOL) && (viewMode & NRC_LOG_ADD_COUNTER)) {
			sprintf(resultFmt, "%d> %s\n", printfCounter, fmt); printfCounter++;
		}
		else if (viewMode & NRC_LOG_ADD_COUNTER) {
			sprintf(resultFmt, "%d> %s", printfCounter, fmt); printfCounter++;
		}
		else if (viewMode & NRC_LOG_ADD_EOL) {
			sprintf(resultFmt, "%s\n", fmt);
		}
	}

	va_list args;
	va_start(args, fmt);
	vprintf(resultFmt, args);
	va_end(args);
#ifdef NRC_LOG_NEED_FFLUSH
	fflush(stdout);
#endif
}