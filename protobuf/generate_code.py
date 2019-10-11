import subprocess
import os

proj = "reflow_oven"
protoDir = r"C:\reflow_oven\protobuf"
os.chdir(protoDir)
tmp = os.getcwd()
# C lang (nanopb)
result1 = subprocess.run(["nanopb/generator-bin/protoc.exe", "-I.", "-Inanopb/generator/proto", "-o" + proj + ".pb", proj + ".proto"])
result2 = subprocess.run(["nanopb/generator-bin/nanopb_generator.exe", proj + ".pb"])
# python
result3 = subprocess.run(["nanopb/generator-bin/protoc.exe", "-I.", "-Inanopb/generator/proto", "--python_out=.", proj + ".proto"])
# javascript
result4 = subprocess.run(["node", "../web/node_modules/protobufjs/cli/bin/pbjs", "-t", "static-module", "-p", protoDir, "-o", proj + ".pb.js", proj + ".proto"])

os.chdir(tmp)