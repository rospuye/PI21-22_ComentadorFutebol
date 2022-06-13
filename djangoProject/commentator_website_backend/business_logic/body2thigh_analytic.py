import numpy as np
# from global_var import cos, sin

R_rotx = lambda a: np.array([1, 0, 0, 0, np.cos(a), -np.sin(a), 0, np.sin(a), np.cos(a)]).reshape(3,3)
             
def f_rotx(a):
    cosa = np.cos(a)
    sina = np.sin(a)
    return np.array([1, 0, 0, 0, cosa, -sina, 0, sina, cosa]).reshape(3,3)

 

R_roty = lambda a: np.array([np.cos(a), 0, np.sin(a), 0,  1,  0, -np.sin(a), 0, np.cos(a)]).reshape(3,3)
             
def f_roty(a):
    cosa = np.cos(a)
    sina = np.sin(a)
    return np.array([cosa, 0, sina, 0, 1, 0, -sina, 0, cosa]).reshape(3,3)

      

R_rotz = lambda a: np.array([np.cos(a), -np.sin(a), 0, np.sin(a), np.cos(a), 0, 0, 0, 1]).reshape(3,3)


              
              
R_rotxz = lambda ux,uz,a: np.array([
                                        np.cos(a) + ux*ux*(1-np.cos(a)), -uz*np.sin(a), ux*uz*(1-np.cos(a)),
                                        uz*np.sin(a),                 np.cos(a),     -ux*np.sin(a),
                                        uz*ux*(1-np.cos(a)),          ux*np.sin(a),  np.cos(a)+uz*uz*(1-np.cos(a))
                                    ]).reshape(3,3)
      
def get_thighs(euler, isRight=True):

    #print(euler)
    rpy = np.array(euler) # [4.18841901e-01, 5.23588645e-01, 5.38159469e-07]   0 30 24
    #print(rpy)
    #rpy = [0.62858704 0.49691578 0.28833546]; # -15 30 24

    rpy2=rpy*180/np.pi
    #print(rpy2)


    pi4 = -np.pi/4 if isRight else np.pi/4

    R_rpy = R_rotz(rpy[2]) @ R_roty(rpy[1]) @ R_rotx(rpy[0])
    #print(R_rpy)

    RR = f_roty(-pi4)@R_rpy
    #print(RR)


    t2 = (np.arcsin(-RR[2,0]))+pi4
    cos_t2 = np.cos(t2-pi4)
    t1 = -np.arcsin(-RR[1,0]/cos_t2) if isRight else np.arcsin(-RR[1,0]/cos_t2)
    t3 = np.pi/2-np.arccos(RR[2,1]/cos_t2)

    #t1 = (t1+np.pi) % (2*np.pi) - np.pi
    #t2 = (t2+np.pi) % (2*np.pi) - np.pi
    #t3 = (t3+np.pi) % (2*np.pi) - np.pi

    return [t1, t2, t3]






