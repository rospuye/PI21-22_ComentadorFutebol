import numpy as np

from global_var import cos, sin

"""
    R_general = [cos(a)+ux*ux*(1-cos(a)),   ux*uy*(1-cos(a))-uz*sin(a),ux*uz*(1-cos(a))+uy*sin(a);
             uy*ux*(1-cos(a))+uz*sin(a),cos(a)+uy*uy*(1-cos(a)),   uy*uz*(1-cos(a))-ux*sin(a);
             uz*ux*(1-cos(a))-uy*sin(a),uz*uy*(1-cos(a))+ux*sin(a),cos(a)+uz*uz*(1-cos(a))];
"""

PRECISION = 1e-3


def R_general(ux, uz, a):
    """ General rotation matrix for x and z axis rotation """
    return np.array([
        cos(a) + ux*ux*(1-cos(a)), -uz*sin(a), ux*uz*(1-cos(a)),
        uz*sin(a),                    cos(a),     -ux*sin(a),
        uz*ux*(1-cos(a)),             ux*sin(a),  cos(a)+uz*uz*(1-cos(a))
    ]).reshape(3,3)

def R_x(a):
    return np.array([1, 0, 0, 0, cos(a), -sin(a), 0, sin(a), cos(a)]).reshape(3,3)

def R_y(a):
    return np.array([cos(a), 0, sin(a), 0, 1, 0, -sin(a), 0, cos(a)]).reshape(3,3)

def R_z(a):
    return np.array([cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1]).reshape(3,3)

def get_thighs(euler, prev,  isRight=True):

    R_roll_j1  = R_x
    R_pitch_j2 = R_y
    R_yaw_j3   = R_z

    rpy = np.array(euler) # -4.35 -1.81 3.47

    R_rpy = R_yaw_j3(rpy[2]) @ R_pitch_j2(rpy[1]) @ R_roll_j1(rpy[0]) 


    f_rpy_z = R_rpy @ np.array([0, 0, 1]).reshape(3,1)
    f_rpy_y = R_rpy @ np.array([0, 1, 0]).reshape(3,1)

    # if else for both legs

    sqrt_2 = np.sqrt(2)

    if isRight:
        R_llj1_j1 = lambda j1: R_general(-sqrt_2/2, sqrt_2/2,j1)
    else:
        R_llj1_j1 = lambda j1: R_general(-sqrt_2/2, -sqrt_2/2,j1)
    
    R_llj2_j2 = R_y
    R_llj3_j3 = R_x

    R_lHip_j1_j2_j3 = lambda j1,j2,j3: R_llj1_j1(j1) @ R_llj2_j2(j2) @ R_llj3_j3(j3)

    fz_j1_j2_j3 = lambda R_lHip: R_lHip @ np.array([0, 0, 1]).reshape(3,1)
    fy_j1_j2_j3 = lambda R_lHip: R_lHip @ np.array([0, 1, 0]).reshape(3,1)

    q = rpy.reshape(3,1)

    R_lHip1 = R_lHip_j1_j2_j3(q[0], q[1], q[2])

    fz = fz_j1_j2_j3(R_lHip1)
    fy = fy_j1_j2_j3(R_lHip1)
    fz_goal = f_rpy_z
    fy_goal = f_rpy_y

    q = np.array(prev).reshape(3,1)

    #err = (fz-fz_goal).T@(fz-fz_goal)


    fact=0.5
    prev_err=10
    fails=0

    c1 = 0
    
    while (fz-fz_goal).T@(fz-fz_goal)+(fy-fy_goal).T@(fy-fy_goal) > PRECISION:
        c1 += 1
        if c1 > 1000:
            break
        # step = np.array([np.random.random()-0.5, np.random.random()-0.5, np.random.random()-0.5]).reshape(3,1)*fact
        step = (np.random.random(size=3) - 0.5)*fact
        step = step.reshape(3, 1)
        q2 = q + step

        q2 = (q2+np.pi) % (2*np.pi) - np.pi

        R_lHip2 = R_lHip_j1_j2_j3(q2[0],q2[1],q2[2])

        fz2 = fz_j1_j2_j3(R_lHip2)
        fy2 = fy_j1_j2_j3(R_lHip2)
        err = (fz2-fz_goal).T@(fz2-fz_goal)+(fy2-fy_goal).T@(fy2-fy_goal)

        if err < prev_err:
            q=q2
            #q*180/np.pi
            fails = 0
            fz=fz2
            fy=fy2
            prev_err=err

            q2 = q2 + step
            R_lHip2 = R_lHip_j1_j2_j3(q2[0], q2[1], q2[2])

            fz2 = fz_j1_j2_j3(R_lHip2)
            fy2 = fy_j1_j2_j3(R_lHip2)
            err = (fz2-fz_goal).T@(fz2-fz_goal)+(fy2-fy_goal).T@(fy2-fy_goal)

            c2 = 0
            while err < prev_err:
                c2 += 1
                if c2 > 1000:
                    break

                #fails=0
                q=q2
                #q*180/np.pi

                fz=fz2
                fy=fy2
                prev_err=err

                q2 = q2 + step

                R_lHip2 = R_lHip_j1_j2_j3(q2[0], q2[1], q2[2])

                fz2 = fz_j1_j2_j3(R_lHip2)
                fy2 = fy_j1_j2_j3(R_lHip2)
                err = (fz2-fz_goal).T@(fz2-fz_goal)+(fy2-fy_goal).T@(fy2-fy_goal);
                #err2=err

        else:
            fails=fails+1
            if fails>4:
                fact=fact*0.5
                fails=0
    return q