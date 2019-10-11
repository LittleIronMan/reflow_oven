#!/usr/bin/env python3
import subprocess
import sys
import os

isLinux = False
isWindows = False
if os.name == 'nt':
	isWindows = True
elif os.name == 'posix':
	isLinux = True
if not isWindows and not isLinux:
	print("Error: undefined platform")
	input("Press any key to exit")
	quit()

compilerArgs = []
compileSourceFiles = []
compileLibs = []
includeDirs = []

compiler = "gcc"
chDir = ""
if isWindows:
	compiler += ".exe"
	chDir = r"C:\MinGW\bin" # gcc под Windows должен запускаться в своей директории, ему нужны там какие-то библиотеки
	if not os.path.exists(chDir):
		chDir = r"C:\msys32\mingw32\bin"
	if not os.path.exists(chDir):
		print("Error: mingw compiler not found")
		input("Press any key to exit")
		quit()

compilerArgs += [compiler] # компилятор
if len(sys.argv) > 1:
	compilerArgs += sys.argv[1:] # передаем дополнительные аргументы для компилятора, которые были переданы скрипту

compileSourceFiles += [
	"../other/crc_software_as_stm32_hardware.c", # вычисление crc тем-же способом, что и в аппаратном модуле stm32
	"../nrc-safe-uart/nrc-safe-uart.c", # библиотека для безопасной упаковки данных перед их отправкой по последовательному протоколу
	"../nrc-print/nrc-print.c" # логи, с возможностью их выключать совсем или делать чрезчур подробными
]
includeDirs += ["../nrc-print"]

if isLinux:
	compileLibs += ["-lwiringPi"] # библиотека для обмена данными по последовательному протоколу для rapsberry pi
elif isWindows:
	includeDirs += ["wiringpi_simulator_for_windows"] # фейковая библиотека, имитирует uart на Windows
	compileSourceFiles += ["wiringpi_simulator_for_windows/wiringSerial.c"]

# nanopb
includeDirs += ["../protobuf", "../protobuf/nanopb"]

progs = ["uart-Rx", "uart-Tx"]
for prog in progs:
	# добавляем зависимые от конкретной программы файлы
	incDirs = list(includeDirs) + [prog, "../nrc-print/config_rpi_" + prog, "../nrc-safe-uart/config_rpi_" + prog]
	compileSrc = list(compileSourceFiles) + [prog + "/" + prog + ".c", "../nrc-safe-uart/config_rpi_" + prog + "/nrc-safe-uart_config.c"]
	outFile = prog

	# для Windows будут использоваться абсолютные пути к файлам
	if isWindows:
		for i in range(len(incDirs)):
			incDirs[i] = os.path.abspath(incDirs[i])
		for i in range(len(compileSrc)):
			compileSrc[i] = os.path.abspath(compileSrc[i])
		outFile = os.path.abspath(outFile) + ".exe"

	# добавляем префикс -I к директориям с заголовочниками файлами
	for i in range(len(incDirs)):
		incDirs[i] = "-I" + incDirs[i]

	print("--------------->>> compile " + prog + " <<<-----------------")
	args = compilerArgs + compileLibs + incDirs + compileSrc + ["-o", outFile]
	if chDir != "":
		tmpCwd = os.getcwd() # запоминаем на всякий current working directory, чтобы потом вернуть её на место
		os.chdir(chDir)
	listenResult = subprocess.run(args)
	if chDir != "":
		os.chdir(tmpCwd)

print("Script completed")
input("Press any key to exit")
