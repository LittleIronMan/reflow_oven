#!/usr/bin/env python3
import time
import random

while True:
    time.sleep(0.2)
    rand_temp = round(27 + 8 * random.random(), 2)
    curTime = round(time.time(), 2)
    #print("temp measure " + str(curTime) + " " + str(rand_temp))
    print("ping")
