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
			
			# конвертируем из cp1251 в utf-8
			try:
				f = codecs.open(file, 'r', 'cp1251')
				u = f.read() # now the contents have been transformed to a Unicode string
				out = codecs.open(file, 'w', 'utf-8-sig')
				out.write(u)
				out.close()
				print("\tFile " + file + " succesfull converted")
				
				# заодно обрезаем BOM, чтобы все файлы были в одном формате (utf-8 without BOM)
				with open(file, "r+b") as fp:
					print("\tCheck for BOM at beginning of file")
					chunk = fp.read(BUFSIZE)	
					if chunk.startswith(codecs.BOM_UTF8):
						i = 0
						chunk = chunk[BOMLEN:]
						while chunk:
							fp.seek(i)
							fp.write(chunk)
							i += len(chunk)
							fp.seek(BOMLEN, os.SEEK_CUR)
							chunk = fp.read(BUFSIZE)
						fp.seek(-BOMLEN, os.SEEK_CUR)
						fp.truncate()
						print("\tBOM deleted")
					else:
						print("\tBOM not found")
			except UnicodeDecodeError:
				print("\tError with convert file " + file)
				continue
		else:
			print("Good UTF-8 file " + file)
print("Script completed")
input("Press any key to exit")
