import numpy as np
from global_var import cos, sin

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
                     
def f_rotxz(ux,uz,a):
    cosa=np.cos(a)
    sina=np.sin(a)
    return np.array([
                        np.cos(a) + ux*ux*(1-np.cos(a)), -uz*np.sin(a), ux*uz*(1-np.cos(a)),
                        uz*np.sin(a),                 np.cos(a),     -ux*np.sin(a),
                        uz*ux*(1-np.cos(a)),          ux*np.sin(a),  np.cos(a)+uz*uz*(1-np.cos(a))
                    ]).reshape(3,3)
 
      
def get_thighs(euler, prev,  isRight=True):

    rpy = np.array([4.18841901e-01, 5.23588645e-01, 5.38159469e-07]) # 0 30 24
    #print(rpy)
    #rpy = [0.62858704 0.49691578 0.28833546]; # -15 30 24

    rpy2=rpy*180/np.pi
    #print(rpy2)

    R_rpy = R_rotz(rpy[2]) @ R_roty(rpy[1]) @ R_rotx(rpy[0])
    #print(R_rpy)

    RR = f_roty(-np.pi/4)@R_rpy
    #print(RR)

    t2 = (np.arcsin(-RR[2,0]))+np.pi/4
    t1 = np.arcsin(-RR[1,0]/np.cos(t2-np.pi/4))
    t3 = np.pi/2-np.arccos(RR[2,1]/np.cos(t2-np.pi/4))

    return [t2*180/np.pi, t1*180/np.pi, t3*180/np.pi]






