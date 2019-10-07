import subprocess
import os

tmp = os.getcwd()
os.chdir(r"C:\reflow_oven\nrc_protocol_buffers")

result1 = subprocess.run(["nanopb/generator-bin/protoc.exe", "-I.", "-Inanopb/generator/proto", "-onrc_msg.pb", "nrc_msg.proto"])
result2 = subprocess.run(["nanopb/generator-bin/nanopb_generator.exe", "nrc_msg.pb"])
result3 = subprocess.run(["nanopb/generator-bin/protoc.exe", "-I.", "-Inanopb/generator/proto", "--python_out=../rpi-uart/test", "nrc_msg.proto"])

os.chdir(r"C:\reflow_oven\web")
subprocess.run(["node", r"node_modules\protobufjs\cli\bin\pbjs", "-t", "static-module", "-p", r"C:\reflow_oven\nrc_protocol_buffers", "-o", r"nrc_msg.pb.js", "nrc_msg.proto"])

os.chdir(tmp)