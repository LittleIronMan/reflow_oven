gcc -o uart-listener -lwiringPi -Iraspberry_config -Iraspberry_config/uart-receiver uart-listener.c my_software_stm32_crc.c safe_uart/safe_uart_messenger.c ../nrc_print.c raspberry_config/uart-receiver/uart_config.c
#gcc -o uart-listener -lwiringPi -I./raspberry_config -I./raspberry_config/uart-transmitter uart-speaker.c my_software_stm32_crc.c safe_uart/safe_uart_messenger.c ../nrc_print.c raspberry_config/uart-transmitter/uart_config.c
