#include "unix_time.h"

#define JD0 2451911 // дней до 01 янв 2001 ПН

uint8_t day_in_month(ftime_t * t)
{
	const u8 arr[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
	u8 dm = arr[t->month - 1];
	if(t->month == 2){
		if(t->year % 4 != 0) return dm;
		if(t->year % 100 != 0) return dm + 1;
		return dm + (uint8_t)(t->year % 400 == 0);
	}
	return dm;
}

// функция преобразования григорианской даты и времени в значение счетчика
uint32_t FtimeToCounter(ftime_t * ftime)
{
	uint8_t a;
	uint16_t y;
	uint8_t m;
	uint32_t JDN;

	// Вычисление необходимых коэффициентов
	a=(14-ftime->month)/12;
	y=ftime->year+4800-a;
	m=ftime->month+(12*a)-3;
	// Вычисляем значение текущего Юлианского дня
	JDN=ftime->day;
	JDN+=(153*m+2)/5;
	JDN+=365*y;
	JDN+=y/4;
	JDN+=-y/100;
	JDN+=y/400;
	JDN+=-32045;
	JDN+=-JD0; // так как счетчик у нас нерезиновый, уберем дни которые прошли до 01 янв 2001
	JDN*=86400;     // переводим дни в секунды
	JDN+=(ftime->time.hour*3600); // и дополняем его скундами текущего дня
	JDN+=(ftime->time.minute*60);
	JDN+=(ftime->time.second);
	// итого имеем количество секунд с 00-00 01 янв 2001
	return JDN;
}

// функция преобразования значение счетчика в григорианскую дату и время
void CounterToFtime(uint32_t counter,ftime_t * ftime)
{
	uint32_t ace;
	uint8_t b;
	uint8_t d;
	uint8_t m;

	ace=(counter/86400);
	ftime->wday = (ace) % 7 + 1;
	ace += 32044+JD0;
	b=(4*ace+3)/146097; // может ли произойти потеря точности из-за переполнения 4*ace ??
	ace=ace-((146097*b)/4);
	d=(4*ace+3)/1461;
	ace=ace-((1461*d)/4);
	m=(5*ace+2)/153;
	ftime->day=ace-((153*m+2)/5)+1;
	ftime->month=m+3-(12*(m/10));
	ftime->year=100*b+d-4800+(m/10);
	ftime->time.hour=(counter/3600)%24;
	ftime->time.minute=(counter/60)%60;
	ftime->time.second=(counter%60);
}
