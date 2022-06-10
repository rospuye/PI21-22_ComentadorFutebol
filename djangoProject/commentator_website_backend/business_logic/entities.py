import math
import numpy as np
import MDAnalysis as mda
from body2thig import get_thighs

POSITIONS_SIZE = 2 # TODO random choice ()

def rotation_from_matrix(matrix):
    """Return rotation angle and axis from rotation matrix.
    >>> angle = (random.random() - 0.5) * (2*math.pi)
    >>> direc = np.random.random(3) - 0.5
    >>> point = np.random.random(3) - 0.5
    >>> R0 = rotation_matrix(angle, direc, point)
    >>> angle, direc, point = rotation_from_matrix(R0)
    >>> R1 = rotation_matrix(angle, direc, point)
    >>> is_same_transform(R0, R1)
    True
    """
    R = np.array(matrix, dtype=np.float64, copy=False)
    R33 = R[:3, :3]
    # direction: unit eigenvector of R33 corresponding to eigenvalue of 1
    l, W = np.linalg.eig(R33.T)
    i = np.where(abs(np.real(l) - 1.0) < 1e-4)[0]
    if not len(i):
        print(matrix)
        u0 = matrix[0,0:3]
        u1 = matrix[1,0:3]
        u2 = matrix[2,0:3]
        print(np.linalg.norm(u0), np.linalg.norm(u1), np.linalg.norm(u2))
        raise ValueError("no unit eigenvector corresponding to eigenvalue 1")
    direction = np.real(W[:, i[-1]]).squeeze()
    # point: unit eigenvector of R33 corresponding to eigenvalue of 1
    l, Q = np.linalg.eig(R)
    i = np.where(abs(np.real(l) - 1.0) < 1e-4)[0]
    if not len(i):
        print(matrix)
        u0 = matrix[0,0:3]
        u1 = matrix[1,0:3]
        u2 = matrix[2,0:3]
        print(np.linalg.norm(u0), np.linalg.norm(u1), np.linalg.norm(u2))
        raise ValueError("no unit eigenvector corresponding to eigenvalue 1")
    point = np.real(Q[:, i[-1]]).squeeze()
    point /= point[3]
    # rotation angle depending on direction
    cosa = (np.trace(R33) - 1.0) / 2.0
    if abs(direction[2]) > 1e-8:
        sina = (R[1, 0] + (cosa - 1.0) * direction[0] * direction[1]) / direction[2]
    elif abs(direction[1]) > 1e-8:
        sina = (R[0, 2] + (cosa - 1.0) * direction[0] * direction[2]) / direction[1]
    else:
        sina = (R[2, 1] + (cosa - 1.0) * direction[1] * direction[2]) / direction[0]
    angle = math.atan2(sina, cosa)
    return angle, direction, point

def get_quaternion(arr):
    r90 = np.array([[0, -1, 0, 0], [1, 0, 0, 0], [0, 0, 1, 0], [0, 0 ,0 ,1]])
    #print(arr.pos)
    r = np.array(arr).reshape(4,4).T
    #print(r)
    u0 = r[0,0:3]
    u1 = r[1,0:3]
    u2 = r[2,0:3]

    u1 = u1/np.linalg.norm(u1)
    u2 = u2/np.linalg.norm(u2)
    #print(u1, u2)
    u01 = np.cross(u1,u2)
    #print("u01", u01)

    r[0,0:3] = u01
    r[1,0:3] = u1
    r[2,0:3] = u2

    #print("V", v)

    V1 = r90@r
    V2 = rotation_from_matrix(V1)
    #print(V2)
    q = mda.lib.transformations.quaternion_about_axis(V2[0], V2[1])
    return [-q[0], -q[2], q[1], -q[3]]

def get_euler_angles(pos, pos_r):

    h = np.array(pos).reshape(4,4).T
    r = np.array(pos_r).reshape(4,4).T

    u0 = h[0,0:3]
    u1 = h[1,0:3]
    u2 = h[2,0:3]

    u1 = u1/np.linalg.norm(u1)
    u2 = u2/np.linalg.norm(u2)

    u01 = np.cross(u1,u2)

    h[0,0:3] = u01
    h[1,0:3] = u1
    h[2,0:3] = u2

    # Coord mundo -> coord robo
    T1 = np.linalg.inv(r)@h

    T2 = rotation_from_matrix(T1)
    q = mda.lib.transformations.quaternion_about_axis(T2[0], T2[1])
    e = mda.lib.transformations.euler_from_quaternion(q)

    return e

class Position():
    def __init__(self, position, timestamp):
        self.x = position[-4]
        self.y = position[-3]
        self.z = position[-2]
        
        self.timestamp = timestamp
        self.position = position

    def distance_between(self, position):
        """Returns the euclidian distance to given position."""
        return math.sqrt((self.x - position.x)**2 + (self.y - position.y)**2 + (self.z - position.z)**2)
    
    def __str__(self):
        return f"{self.timestamp = }, {self.x = }, {self.y = }, {self.z = }"

class Entity():
    def __init__(self, id, index, offset):
        self.id = id
        self.number_of_positions = 300
        self.index = index
        self.offset = offset
        self.positions = []
        self.cur_pos = []
        self.quartenion = []

    def add_position(self, position):
        # if len(self.positions) >= self.number_of_positions:
        #     self.positions = self.positions[1:]
        #print(self.id)
        
        self.positions.append(position)
        self.cur_pos = position.position
        self.quartenion = get_quaternion(self.cur_pos)

    def get_current_velocity(self):
        if len(self.positions) < 2:
            return 0.0
        now = self.positions[-1]
        then = self.positions[-2]
        time_delta = now.timestamp - then.timestamp
        distance = now.distance_between(then)
        return distance/time_delta

    def get_velocity_at(self, timestamp):
        timestamps = [position.timestamp for position in self.positions]
        index = timestamps.index(timestamp)

        now = self.positions[index]
        then = self.positions[index-1]
        time_delta = now.timestamp - then.timestamp
        distance = now.distance_between(then)
        return distance/time_delta

    def get_recent_positions(self):
        return self.positions[-POSITIONS_SIZE:]

    def to_json(self):
        return {"id": self.id, "position": self.position}
    
    def to_replay(self):
        x = self.cur_pos[-4]
        y = self.cur_pos[-3]
        z = self.cur_pos[-2]

        return f"{x} {y} {z} {np.round(self.quartenion[0],3)} {np.round(self.quartenion[1],3)} {np.round(self.quartenion[2],3)} {np.round(self.quartenion[3],3)}"

class Ball(Entity):
    def __init__(self, id, index, offset):
        super().__init__(id, index, offset)
        self.owner = None

    def get_distance_from(self, player):
        return min(self.positions[-1].distance_between(player.positions_rfoot[-1]), self.positions[-1].distance_between(player.positions_lfoot[-1]))

    def get_closest_player(self, players):
        return min(players, key=lambda x: x.positions[-1].distance_between(self.positions[-1]))

    def is_in_goal_direction(self, teamRight : bool, field : dict, goal : dict, flag = False):
        ball_pos_i = self.positions[-2]
        ball_pos_f = self.positions[-1]
        delta_x = (ball_pos_f.x-ball_pos_i.x)
        # Moving in goal direction at all?
        if (delta_x == 0): return False
        # Moving towards desired goal?
        directionRight = True if ball_pos_f.x - ball_pos_i.x > 0 else False
        if not (teamRight == directionRight): return False # not moving toward goal
        # Get tragectory slope and offset
        m = (ball_pos_f.y-ball_pos_i.y)/delta_x
        b = ball_pos_i.y-(m*ball_pos_i.x)
        # Decides which goal we're evaluating
        operand = 1 if teamRight else -1
        # Get the y of the intersection between goal line and ball tragectory 
        intersection = m*((field["length"]/2)*operand)+b
        if flag:
            print("====DEBUG====")
            print("i", ball_pos_i)
            print("f", ball_pos_f)
            print(f"{m = }")
            print(f"{b = }")
            print(f"{intersection = }")
            print(f"{teamRight = }")
            print(f"{directionRight = }")
        return True if abs(intersection) < goal["width"]/2 else False
    
    def to_replay(self):
        return "b " + super().to_replay() + "\n"

class Player(Entity):
    def __init__(self, id, index, offset, team : bool):
        super().__init__(id, index, offset)
        self.isTeamRight = team

        self.has_extra_foot = False

        self.headIndex = 0
        self.rupperarmIndex = 0
        self.rlowerarmIndex = 0
        self.lupperarmIndex = 0
        self.llowerarmIndex = 0
        self.rthighIndex = 0
        self.rshankIndex = 0
        self.lthighIndex = 0
        self.lshankIndex = 0
        self.lfootIndex = 0
        self.rfootIndex = 0

        self.head_pos = []
        self.rupperarm_pos = []
        self.rlowerarm_pos = []
        self.lupperarm_pos = []
        self.llowerarm_pos = []
        self.rthigh_pos = []
        self.rshank_pos = []
        self.lthigh_pos = []
        self.lshank_pos = []
        self.rfoot_pos = []
        self.lfoot_pos = []
        self.positions_rfoot = []
        self.positions_lfoot = []
        self.joints = [0]*22
    
    def add_joint(self, name):
        if name == "head":
            e = get_euler_angles(self.head_pos, self.cur_pos)
            self.joints[0] = np.around(e[2]*180/np.pi,2)
            self.joints[1] = np.around(e[0]*180/np.pi,2)
        elif name == "rupperarm":
            e = get_euler_angles(self.rupperarm_pos, self.cur_pos)
            self.joints[2] = np.around(e[0]*180/np.pi,2)
            self.joints[3] = np.around(e[1]*180/np.pi,2)
        elif name == "rlowerarm":
            e = get_euler_angles(self.rlowerarm_pos, self.rupperarm_pos)
            self.joints[4] = np.around(-e[1]*180/np.pi,2)
            self.joints[5] = np.around(-e[2]*180/np.pi,2)
        elif name == "lupperarm":
            e = get_euler_angles(self.lupperarm_pos, self.cur_pos)
            self.joints[6] = np.around(e[0]*180/np.pi,2)
            self.joints[7] = np.around(e[1]*180/np.pi,2)
        elif name == "llowerarm":
            e = get_euler_angles(self.rlowerarm_pos, self.rupperarm_pos)
            self.joints[8] = np.around(-e[1]*180/np.pi,2)
            self.joints[9] = np.around(-e[2]*180/np.pi,2)
        elif name == "rthigh":
            e = get_euler_angles(self.rthigh_pos, self.cur_pos)
            new_e = get_thighs(e)
            self.joints[10] = np.around(new_e[0]*180/np.pi,2)
            self.joints[11] = np.around(new_e[1]*180/np.pi,2)
            self.joints[12] = np.around(new_e[2]*180/np.pi,2)
        elif name == "rshank":
            #e = get_euler_angles(self.rshank_pos, self.cur_pos)
            #self.joints[11] = np.around(e[1]*180/np.pi,2)
            e = get_euler_angles(self.rshank_pos, self.rthigh_pos)
            self.joints[13] = np.around(e[0]*180/np.pi,2)
        elif name == "rfoot":
            e = get_euler_angles(self.rfoot_pos, self.rshank_pos)
            self.joints[14] = np.around(e[0]*180/np.pi,2)
            e = get_euler_angles(self.rfoot_pos, self.rthigh_pos)
            self.joints[15] = np.around(e[1]*180/np.pi,2)
        elif name == "lthigh":
            e = get_euler_angles(self.lthigh_pos, self.cur_pos)
            new_e = get_thighs(e)
            self.joints[16] = np.around(new_e[0]*180/np.pi,2)
            self.joints[17] = np.around(new_e[1]*180/np.pi,2)
            self.joints[18] = np.around(new_e[2]*180/np.pi,2)
        elif name == "lshank":
            #e = get_euler_angles(self.lshank_pos, self.cur_pos)
            #self.joints[17] = np.around(e[1]*180/np.pi,2)
            e = get_euler_angles(self.lshank_pos, self.lthigh_pos)
            self.joints[19] = np.around(e[0]*180/np.pi,2)
        elif name == "lfoot":
            e = get_euler_angles(self.lfoot_pos, self.lshank_pos)
            self.joints[20] = np.around(e[0]*180/np.pi,2)
            e = get_euler_angles(self.lfoot_pos, self.lthigh_pos)
            self.joints[21] = np.around(e[1]*180/np.pi,2)

    def add_position_rfoot(self, position):
        self.positions_rfoot.append(position)

    def add_position_lfoot(self, position):
        self.positions_lfoot.append(position)  

    def to_json(self):
        return {"id": self.id, "team":self.isTeamRight}

    def to_replay(self):
        team = "r" if self.isTeamRight else "l"
        joints = " (j"

        for i in range(len(self.joints)):
            if self.has_extra_foot and i == 16:
                joints += " 0"
            joints += f" {self.joints[i]}"

        if self.has_extra_foot:
            joints += " 0"
        joints += ")\n"

        tmp_id = [x for x in self.id if x.isdigit()]
        id = "".join(str(x) for x in tmp_id)

        return f"{team} {id} 0x0 " + super().to_replay() + joints