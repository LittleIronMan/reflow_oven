import subprocess
#import os

commonArgs = ["gcc", # compiler
	"-lwiringPi", # lib for use UART in raspberry pi
	"my_software_stm32_crc.c", # calculate CRC by software identically stm32 hardware CRC
	"safe_uart/safe_uart_messenger.c", # safe package data before transmit by UART
	"../nrc_print.c", # logs, possible full disable or debug/verbatim modes
	
]
nanopbArgs = ["-I../nrc_protocol_buffers",
	"-I../nrc_protocol_buffers/nanopb"
	#"../nrc_protocol_buffers/nanopb/pb_common.c",
	#"../nrc_protocol_buffers/nanopb/pb_encode.c",
	#"../nrc_protocol_buffers/nanopb/pb_decode.c"
]
listenArgs = commonArgs + nanopbArgs + ["-o", "uart-listener", "-Iraspberry_config/uart-receiver", "uart-listener.c"]
speakArgs = commonArgs + ["-o", "uart-speaker", "-Iraspberry_config/uart-transmitter", "uart-speaker.c"]

listenResult = subprocess.run(listenArgs)
speakResult = subprocess.run(speakArgs)
