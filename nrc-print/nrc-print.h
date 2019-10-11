#ifndef nrc_printf_h
#define nrc_printf_h

#include <stdio.h> // printf
#include <stdarg.h> // va_list
#include <stdint.h> // uint8_t, uint16_t etc...
#include <nrc-print_config.h> // NRC_LOG_LEVEL, NRC_LOG_NEED_FFLUSH

#define NRC_LOG_DISABLED 0
#define NRC_LOG_LEVEL_DEFAULT 1
#define NRC_LOG_LEVEL_DEBUG 2
#define NRC_LOG_LEVEL_VERBATIM 3

#ifndef NRC_LOG_LEVEL
#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEFAULT
#endif

#ifndef NRC_LOG_LEVEL_DYNAMIC
#define NRC_LOG_LEVEL_DYNAMIC 0
#elif NRC_LOG_LEVEL_DYNAMIC == 1
extern unsigned char logLevelGlobal;
#endif

#define NRC_LOG_ADD_EOL 0x1
#define NRC_LOG_ADD_COUNTER 0x2

#if (NRC_LOG_LEVEL >= NRC_LOG_LEVEL_DEFAULT) || NRC_LOG_LEVEL_DYNAMIC
void nrcPrintfEx(unsigned char logLevel, uint8_t viewMode, char *fmt, ...);
#define nrcPrintf(...) nrcPrintfEx(NRC_LOG_LEVEL_DEFAULT, 0, __VA_ARGS__)
#define nrcLog(...) nrcPrintfEx(NRC_LOG_LEVEL_DEFAULT, NRC_LOG_ADD_COUNTER | NRC_LOG_ADD_EOL, __VA_ARGS__)
#else
#define nrcPrintf(...)
#define nrcLog(...)
#endif

#if (NRC_LOG_LEVEL >= NRC_LOG_LEVEL_DEBUG) || NRC_LOG_LEVEL_DYNAMIC
#define nrcPrintfD(...) nrcPrintfEx(NRC_LOG_LEVEL_DEBUG, 0, __VA_ARGS__)
#define nrcLogD(...); nrcPrintfEx(NRC_LOG_LEVEL_DEBUG, NRC_LOG_ADD_COUNTER | NRC_LOG_ADD_EOL, __VA_ARGS__)
#else
#define nrcPrintfD(...)
#define nrcLogD(...)
#endif

#if (NRC_LOG_LEVEL >= NRC_LOG_LEVEL_VERBATIM) || NRC_LOG_LEVEL_DYNAMIC
#define nrcPrintfV(...) nrcPrintfEx(NRC_LOG_LEVEL_VERBATIM, 0, __VA_ARGS__)
#define nrcLogV(...) nrcPrintfEx(NRC_LOG_LEVEL_VERBATIM, NRC_LOG_ADD_COUNTER | NRC_LOG_ADD_EOL, __VA_ARGS__)
#else
#define nrcPrintfV(...)
#define nrcLogV(...)
#endif

#endif // nrc_printf_h
