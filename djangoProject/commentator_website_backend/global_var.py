import numpy

angle_cache = {}
PRECISION = 4

def createCache():
    global angle_cache
    angle_cache = {str(a / (10**PRECISION)): \
                  {"cos": numpy.cos(a / (10**PRECISION)), "sin": numpy.sin(a / (10**PRECISION))} for a in range(-31415, 31416, 1)}