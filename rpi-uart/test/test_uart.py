#!/usr/bin/env python3
# реакция на нажатия клавиш позаимствовано отсюда: https://rosettacode.org/wiki/Keyboard_input/Keypress_check#Python

# from __future__ import absolute_import, division, unicode_literals, print_function
 
import nrc_msg_pb2

isLinux = False
isWindows = False

try:
	import tty, termios
	isLinux = True
except:
	try:
		import msvcrt
		isWindows = True
	except:
		pass

import sys, _thread, time
 
if isWindows:
	from msvcrt import getch as _getch # try to import Windows version
	def getch():   # define non-Windows version
		ch = _getch()
		try:
			ch = ch.decode('utf-8')
		except UnicodeDecodeError:
			print("character can not be decoded, sorry!")
			ch = None
		return ch
elif isLinux:
	def getch():   # define non-Windows version
		fd = sys.stdin.fileno()
		old_settings = termios.tcgetattr(fd)
		try:
			tty.setraw(sys.stdin.fileno())
			ch = sys.stdin.read(1)
		finally:
			termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
		return ch
else:
	def getch():
		return None

def keypressThread():
	global char
	while True:
		char = getch()

allKeys = dict()
allKeys["r"] = ["r", "run", "Запуск программы нагревания", nrc_msg_pb2.MsgType.CMD, nrc_msg_pb2.OvenCommand]

def handleKey(key):
	if key in allKeys:
		data = allKeys[key]

def main():
	global char
	char = None
	_thread.start_new_thread(keypressThread, ())
 
	while True:
		if char is not None:
			#print("Key pressed is " + char)
			if char == 'q' or char == '\x1b':  # x1b is ESC
				exit()
			handleKey(char)
			char = None
		time.sleep(0.1)
 
if __name__ == "__main__":
	main()