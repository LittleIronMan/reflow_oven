import os, codecs

BUFSIZE = 4096
BOMLEN = len(codecs.BOM_UTF8)

for root, dirs, files in os.walk("."):
	for fileShort in files:
		if fileShort == "cast_all_to_UTF-8_without_BOM.py":
			continue
		file = os.path.join(root, fileShort).replace("\\", "/")
		
		invalidUtf8Detected = False
		
		with open(file, mode="rb") as f:
			try:
				data = f.read()
				udata = None
				udata = data.decode('utf-8') # Returns a Unicode object on success, or None on failure
			except UnicodeDecodeError:
				invalidUtf8Detected = True
		
		if invalidUtf8Detected:
			print("Detected bad UTF-8 file " + file)
			print("Try convert it")
			try:
				f = codecs.open(file, 'r', 'cp1251')
				u = f.read() # now the contents have been transformed to a Unicode string
				out = codecs.open(file, 'w', 'utf-8-sig')
				out.write(u)
				print("\tFile " + file + " succesfull converted")
			except UnicodeDecodeError:
				print("\tError with convert file " + file)
				continue
		else:
			print("Good file " + file)
print("Script completed")
input("Press any key to exit")
