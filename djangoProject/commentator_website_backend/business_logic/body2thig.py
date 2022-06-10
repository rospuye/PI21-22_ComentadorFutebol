import numpy as np

"""
    R_general = [cos(a)+ux*ux*(1-cos(a)),   ux*uy*(1-cos(a))-uz*sin(a),ux*uz*(1-cos(a))+uy*sin(a);
             uy*ux*(1-cos(a))+uz*sin(a),cos(a)+uy*uy*(1-cos(a)),   uy*uz*(1-cos(a))-ux*sin(a);
             uz*ux*(1-cos(a))-uy*sin(a),uz*uy*(1-cos(a))+ux*sin(a),cos(a)+uz*uz*(1-cos(a))];
"""

def R_general(ux, uy, uz, a):
    return np.array([
        np.cos(a) + ux*ux*(1-np.cos(a)), ux*uy*(1-np.cos(a))-uz*np.sin(a), ux*uz*(1-np.cos(a)) + uy*np.sin(a),
        uy*ux*(1-np.cos(a))+uz*np.sin(a),np.cos(a)+uy*uy*(1-np.cos(a)),   uy*uz*(1-np.cos(a))-ux*np.sin(a),
        uz*ux*(1-np.cos(a))-uy*np.sin(a),uz*uy*(1-np.cos(a))+ux*np.sin(a),np.cos(a)+uz*uz*(1-np.cos(a))
    ]).reshape(3,3)

def R_x(a):
    return np.array([1, 0, 0, 0, np.cos(a), -np.sin(a), 0, np.sin(a), np.cos(a)]).reshape(3,3)

def R_y(a):
    return np.array([np.cos(a), 0, np.sin(a), 0, 1, 0, -np.sin(a), 0, np.cos(a)]).reshape(3,3)

def R_z(a):
    return np.array([np.cos(a), -np.sin(a), 0, np.sin(a), np.cos(a), 0, 0, 0, 1]).reshape(3,3)

def get_thighs(euler):

    R_roll_j1  = lambda j1: R_x(j1)
    R_pitch_j2 = lambda j2: R_y(j2)
    R_yaw_j3   = lambda j3: R_z(j3)

    rpy = np.array(euler) # -4.35 -1.81 3.47

    R_rpy = R_yaw_j3(rpy[2]) @ R_pitch_j2(rpy[1]) @ R_roll_j1(rpy[0]) 


    f_rpy_z = R_rpy @ np.array([0, 0, 1]).reshape(3,1)
    f_rpy_y = R_rpy @ np.array([0, 1, 0]).reshape(3,1)

    # if else for both legs
    R_llj1_j1 = lambda j1: R_general(-np.sqrt(2)/2, 0, -np.sqrt(2)/2,j1)
    R_llj2_j2 = lambda j2: R_y(j2)
    R_llj3_j3 = lambda j3: R_x(j3)

    R_lHip_j1_j2_j3 = lambda j1,j2,j3: R_llj1_j1(j1) @ R_llj2_j2(j2) @ R_llj3_j3(j3)

    fz_j1_j2_j3 = lambda j1,j2,j3: R_lHip_j1_j2_j3(j1,j2,j3) @ np.array([0, 0, 1]).reshape(3,1)
    fy_j1_j2_j3 = lambda j1,j2,j3: R_lHip_j1_j2_j3(j1,j2,j3) @ np.array([0, 1, 0]).reshape(3,1)

    q = rpy.reshape(3,1)

    fz = fz_j1_j2_j3(q[0],q[1],q[2])
    fy = fy_j1_j2_j3(q[0],q[1],q[2])
    fz_goal = f_rpy_z
    fy_goal = f_rpy_y

    #err = (fz-fz_goal).T@(fz-fz_goal)


    fact=1.0
    prev_err=10
    fails=0

    c1 = 0
    
    while (fz-fz_goal).T@(fz-fz_goal)+(fy-fy_goal).T@(fy-fy_goal) > 1e-3:

        c1 += 1
        if c1 > 1000:
            break
        step = np.array([np.random.random()-0.5, np.random.random()-0.5, np.random.random()-0.5]).reshape(3,1)*fact

        q2 = q + step

        q2 = (q2+np.pi) % (2*np.pi) - np.pi

        fz2 = fz_j1_j2_j3(q2[0],q2[1],q2[2])
        fy2 = fy_j1_j2_j3(q2[0],q2[1],q2[2])
        err = (fz2-fz_goal).T@(fz2-fz_goal)+(fy2-fy_goal).T@(fy2-fy_goal)

        if err < prev_err:
            q=q2
            #q*180/np.pi
            fails = 0
            fz=fz2
            fy=fy2
            prev_err=err

            q2 = q2 + step
            fz2 = fz_j1_j2_j3(q2[0],q2[1],q2[2])
            fy2 = fy_j1_j2_j3(q2[0],q2[1],q2[2])
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
                fz2 = fz_j1_j2_j3(q2[0],q2[1],q2[2])
                fy2 = fy_j1_j2_j3(q2[0],q2[1],q2[2])
                err = (fz2-fz_goal).T@(fz2-fz_goal)+(fy2-fy_goal).T@(fy2-fy_goal);
                #err2=err

        else:
            fails=fails+1
            if fails>2:
                fact=fact*0.5
                fails=0
 
    return q