import subprocess
import os

tmp = os.getcwd()
os.chdir(r"C:\reflow_oven\nrc_protocol_buffers")

result1 = subprocess.run(["nanopb/generator-bin/protoc.exe", "-I.", "-Inanopb/generator/proto", "-onrc_msg.pb", "nrc_msg.proto"])
result2 = subprocess.run(["nanopb/generator-bin/nanopb_generator.exe", "nrc_msg.pb"])

os.chdir(tmp)