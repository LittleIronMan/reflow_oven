#!/usr/bin/env python3
import subprocess
import sys
import os

sendData = "CAEQARgB"
msgType = "1"
args = ["uart-speaker", "-s", sendData, "-t", msgType, "-b", "-l", "2"]

tmp = os.getcwd()
os.chdir(os.path.expanduser("~/reflow_oven/rpi-uart"))

if "--release" not in sys.argv:
    args = ["gdb", "--args"] + args
else:
    args[0] = "./" + args[0] # линукс почему-то не дает запустить команду просто, без префикса ./

result = subprocess.run(args)
print(result)

os.chdir(tmp)
