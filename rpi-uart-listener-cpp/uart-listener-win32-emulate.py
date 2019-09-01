import time
import random

while True:
    time.sleep(0.5)
    rand_temp = round(27 + 8 * random.random(), 2)
    print("Temp " + str(rand_temp))
