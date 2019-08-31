#include <stdio.h> // printf
#include <stdarg.h> // va_list
#include <stdint.h> // uint8_t, uint16_t etc...

#ifndef nrc_printf_h
#define nrc_printf_h

#define NRC_LOG_LEVEL_DEFAULT 1
#define NRC_LOG_LEVEL_DEBUG 2
#define NRC_LOG_LEVEL_VERBATIM 3

//#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEFAULT
#define NRC_LOG_LEVEL NRC_LOG_LEVEL_DEBUG
//#define NRC_LOG_LEVEL NRC_LOG_LEVEL_VERBATIM

#define NRC_LOG_ADD_EOL 0x1
#define NRC_LOG_ADD_COUNTER 0x2

void nrcPrintfEx(uint8_t viewMode, char *fmt, ...);

#define nrcPrintf(...) nrcPrintfEx(0, __VA_ARGS__)
#define nrcLog(...) nrcPrintfEx(NRC_LOG_ADD_COUNTER | NRC_LOG_ADD_EOL, __VA_ARGS__)
#define nrcPrintfD(...)
#define nrcLogD(...)
#define nrcPrintfV(...)
#define nrcLogV(...)

#if NRC_LOG_LEVEL >= NRC_LOG_LEVEL_DEBUG
#define nrcPrintfD(...) nrcPrintfEx(0, __VA_ARGS__)
#define nrcLogD(...) nrcPrintfEx(NRC_LOG_ADD_COUNTER | NRC_LOG_ADD_EOL, __VA_ARGS__)
#endif

#if NRC_LOG_LEVEL >= NRC_LOG_LEVEL_VERBATIM
#define nrcPrintfV(...) nrcPrintfEx(0, __VA_ARGS__)
#define nrcLogV(...) nrcPrintfEx(NRC_LOG_ADD_COUNTER | NRC_LOG_ADD_EOL, __VA_ARGS__)
#endif

#endif // nrc_printf_h