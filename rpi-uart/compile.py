import subprocess
#import os

commonArgs = ["gcc", # компилятор
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
listenArgs = commonArgs + nanopbArgs + ["-o", "uart-listener", "-Iraspberry_config/uart-receiver", "uart-listener.c"]
speakArgs = commonArgs + ["-o", "uart-speaker", "-Iraspberry_config/uart-transmitter", "uart-speaker.c"]

listenResult = subprocess.run(listenArgs)
speakResult = subprocess.run(speakArgs)
