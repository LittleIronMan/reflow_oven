#!/usr/bin/env python3
import subprocess
import sys
#import os

commonArgs = ["gcc"] # компилятор
if len(sys.argv) > 1:
    commonArgs += sys.argv[1:] # передаем дополнительные аргументы для компилятора, которые были переданы скрипту

commonArgs += [
	"-lwiringPi", # библиотека для обмена данными по последовательному протоколу для rapsberry pi
	"my_software_stm32_crc.c", # вычисление crc тем-же способом, что и в аппаратном модуле stm32
	"safe_uart/safe_uart_messenger.c", # библиотека для безопасной упаковки данных перед их отправкой по последовательному протоколу
	"../nrc_print.c", # логи, с возможностью их выключать совсем или делать чрезчур подробными
	
]
nanopbArgs = ["-I../nrc_protocol_buffers",
	"-I../nrc_protocol_buffers/nanopb"
	#"../nrc_protocol_buffers/nanopb/pb_common.c",
	#"../nrc_protocol_buffers/nanopb/pb_encode.c",
	#"../nrc_protocol_buffers/nanopb/pb_decode.c"
]
commonArgs += nanopbArgs
uartConf = "raspberry_config/uart-receiver"
listenArgs = commonArgs + ["-o", "uart-listener", "-I" + uartConf, uartConf + "/uart_config.c", "uart-listener.c"]

uartConf = "raspberry_config/uart-transmitter"
speakArgs = commonArgs + ["-o", "uart-speaker", "-I" + uartConf, uartConf + "/uart_config.c",  "uart-speaker.c"]

print("--------------->>> compile uart-listener <<<-----------------")
listenResult = subprocess.run(listenArgs)
print("--------------->>> compile uart-speaker <<<-----------------")
speakResult = subprocess.run(speakArgs)
