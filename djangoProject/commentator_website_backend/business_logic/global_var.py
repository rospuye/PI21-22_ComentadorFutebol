import numpy as np

angle_cache = {}
PRECISION = 4


def cos(a):
    if isinstance(a, np.ndarray):
        a = a[0]
    a = (a+np.pi) % (2*np.pi) - np.pi    
    #print(round(a, PRECISION), type(a))
    return angle_cache.get(round(a, PRECISION)).get("cos") 

def sin(a):
    if isinstance(a, np.ndarray):
        a = a[0]
    a = (a+np.pi) % (2*np.pi) - np.pi  
    #print(round(a, PRECISION), type(a))
    return angle_cache.get(round(a, PRECISION)).get("sin") 

def createCache():
    global angle_cache
    angle_cache = {a / (10**PRECISION): \
                  {"cos": np.cos(a / (10**PRECISION)), "sin": np.sin(a / (10**PRECISION))} for a in range(-31416, 31417, 1)}