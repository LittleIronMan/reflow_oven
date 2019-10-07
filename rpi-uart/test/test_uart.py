#!/usr/bin/env python3
# реакция на нажатия клавиш позаимствовано отсюда: https://rosettacode.org/wiki/Keyboard_input/Keypress_check#Python

# from __future__ import absolute_import, division, unicode_literals, print_function
 
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
	from msvcrt import getch  # try to import Windows version
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
 
def keypress():
	global char
	char = getch()
 
def main():
	global char
	char = None
	_thread.start_new_thread(keypress, ())
 
	while True:
		if char is not None:
			try:
				char = char.decode('utf-8')
				print("Key pressed is " + char)
			except UnicodeDecodeError:
				print("character can not be decoded, sorry!")
				char = None
			if char == 'q' or char == '\x1b':  # x1b is ESC
				exit()
			char = None
			_thread.start_new_thread(keypress, ())
		#print("Program is running")
		time.sleep(0.1)
 
if __name__ == "__main__":
	main()