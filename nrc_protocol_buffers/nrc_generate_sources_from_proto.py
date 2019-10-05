import subprocess

#result1 = subprocess.Popen(["nanopb/generator-bin/protoc.exe", "-onrc_msg.pb", "nrc_msg.proto"], stdout=subprocess.PIPE).communicate()[0]
#result1 = subprocess.run(["nanopb/generator-bin/protoc-gen-nanopb.exe", "-onrc_msg.pb", "nrc_msg.proto"])
result1 = subprocess.run(["nanopb/generator-bin/protoc.exe", "-onrc_msg.pb", "nrc_msg.proto"])

#result2 = subprocess.run(["nanopb/generator-bin/nanopb_generator.exe", "nrc_msg.pb"])