#!/usr/bin/env python3
# реакция на нажатия клавиш позаимствовано отсюда: https://rosettacode.org/wiki/Keyboard_input/Keypress_check#Python

# from __future__ import absolute_import, division, unicode_literals, print_function

import base64
import reflow_oven_pb2
import subprocess

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

cmdStart = reflow_oven_pb2.OvenCommand()
cmdStart.type = reflow_oven_pb2.OvenCommand.Type.START
cmdStart.priority = 2

cmdStop = reflow_oven_pb2.OvenCommand()
cmdStop.type = reflow_oven_pb2.OvenCommand.Type.STOP
cmdStop.priority = 4

cmdProfile = reflow_oven_pb2.OvenCommand()
cmdProfile.type = reflow_oven_pb2.OvenCommand.Type.GET_TEMP_PROFILE
cmdProfile.priority = 1

cmdState = reflow_oven_pb2.OvenCommand()
cmdState.type = reflow_oven_pb2.OvenCommand.Type.GET_STATE
cmdState.priority = 1
#cmd.ParseFromString(base64.b64decode(b64str))

allKeys["r"] = ["run", "Запуск программы нагревания", reflow_oven_pb2.MsgType.CMD, cmdStart]
allKeys["s"] = ["stop", "Остановка программы", reflow_oven_pb2.MsgType.CMD, cmdStop]
allKeys["p"] = ["profile", "Получить от контроллера термопрофиль", reflow_oven_pb2.MsgType.CMD, cmdProfile]
allKeys["g"] = ["get_state", "Получить от контроллера его состояние", reflow_oven_pb2.MsgType.CMD, cmdState]

sendProg = "../uart-speaker"
if isWindows:
	sendProg += ".exe"

def handleKey(key):
	global cmdId
	if key in allKeys:
		data = allKeys[key]

		shortName = data[0]
		print("> " + shortName)

		type = data[2]
		cmd = data[3]
		cmd.id = cmdId
		cmdId += 1
		b64str = base64.b64encode(cmd.SerializeToString()).decode("utf-8")

		ls_output = subprocess.Popen([sendProg, "-s", b64str, "-t", str(type), "-b", "-l", "2"])
		#ls_output.communicate()

def main():
	print("Все возможные команды:")
	for key in allKeys:
		data = allKeys[key]
		print("> " + key + "(" + data[0] + ")" + " - " + data[1])

	global char
	char = None
	global cmdId
	cmdId = 0
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