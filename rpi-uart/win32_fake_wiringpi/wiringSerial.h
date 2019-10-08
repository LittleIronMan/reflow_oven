#ifndef wiringSerial_h
#define wiringSerial_h

int serialOpen(const char *device, const int baud);
//void serialClose(const int fd);
//void serialFlush(const int fd);
void serialPutchar(const int fd, const unsigned char c);
void serialPuts(const int fd, const char *s);
//void serialPrintf(const int fd, const char *message, ...);
//int serialDataAvail(const int fd);
int serialGetchar(const int fd);

#endif // wiringSerial_h
