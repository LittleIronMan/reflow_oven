#!/usr/bin/env python3
import subprocess
import sys
import os

sendData = "CAEQARgB"
msgType = "1"
isLinux = False
if os.name == 'nt': # windows
	prog = "windows_simulator/Release/uart-Tx_simulator.exe"
else: # linux
	isLinux = True
	prog = "uart-Tx.exe"
args = [prog, "-s", sendData, "-t", msgType, "-b", "-l", "2"]

if isLinux:
	tmp = os.getcwd()
	os.chdir(os.path.expanduser("~/reflow_oven/rpi-uart"))

if "--debug" in sys.argv:
    args = ["gdb", "--args"] + args
else:
    args[0] = "./" + args[0] # линукс почему-то не дает запустить команду просто, без префикса ./

print(args[0])
result = subprocess.run(args)
print(result)

if isLinux:
	os.chdir(tmp)
