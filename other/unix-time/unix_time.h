#ifndef UNIX_TIME_H
#define UNIX_TIME_H

#include "stm32f10x.h"

typedef struct{
uint8_t hour;
uint8_t minute;
uint8_t second;
} time_t;

typedef struct{
uint16_t year;
uint8_t month;
uint8_t day;
time_t time;
uint8_t wday;
} ftime_t;

uint32_t FtimeToCounter(ftime_t * ftime);
void CounterToFtime(uint32_t counter,ftime_t * ftime);

#endif
