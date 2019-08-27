#include <stdio.h>
#include <string.h>
#include <errno.h>

#include <wiringSerial.h>

int main(){
    int fd;
    if((fd = serialOpen("/dev/ttyS1", 9600)) < 0){
        fprintf(stderr, "Unable to open: %s\n", strerror(errno));
        return 1;
    }
    for(;;){
        putchar(serialGetchar(fd));
        fflush(stdout);
    }
}
