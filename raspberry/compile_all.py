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
includeDirs += ["../nrc-print", "../nrc-safe-uart", "../other"]

if isLinux:
	compileLibs += ["-lwiringPi"] # библиотека для обмена данными по последовательному протоколу для rapsberry pi
elif isWindows:
	includeDirs += ["windows_specific_code/wiringpi"]
	compileSourceFiles += ["windows_specific_code/wiringpi/wiringSerial.c"] # фейковая библиотека, имитирует uart на Windows

# nanopb
includeDirs += ["../protobuf", "../protobuf/nanopb"]

progs = ["uart-Rx", "uart-Tx"]
for prog in progs:
	# добавляем зависимые от конкретной программы файлы
	incDirs = list(includeDirs)
	compilerDefines = ["NRC_RPI_" + prog.upper().replace("-", "_")]
	compileSrc = list(compileSourceFiles) + [prog + ".c"]
	outFile = prog + ".exe" # даже для линукса исполняемый файл будет иметь расширение exe, это сделано только для того чтобы в других программах меньше if(linux) писать

	# для Windows будут использоваться абсолютные пути к файлам
	if isWindows:
		for i in range(len(incDirs)):
			incDirs[i] = os.path.abspath(incDirs[i])
		for i in range(len(compileSrc)):
			compileSrc[i] = os.path.abspath(compileSrc[i])
		outFile = os.path.abspath(outFile)

	# добавляем префикс -I к директориям с заголовочниками файлами
	for i in range(len(incDirs)):
		incDirs[i] = "-I" + incDirs[i]
	# добавляем префикс -D к макросам для компилятора
	for i in range(len(compilerDefines)):
		compilerDefines[i] = "-D" + compilerDefines[i]

	print("--------------->>> compile " + prog + " <<<-----------------")
	args = compilerArgs + compileLibs + incDirs + compileSrc + compilerDefines + ["-fstack-usage", "-o", outFile]
	if chDir != "":
		tmpCwd = os.getcwd() # запоминаем на всякий current working directory, чтобы потом вернуть её на место
		os.chdir(chDir)
	listenResult = subprocess.run(args)
	if chDir != "":
		os.chdir(tmpCwd)

print("Script completed")
input("Press any key to exit")
