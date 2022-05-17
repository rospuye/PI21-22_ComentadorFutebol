import math
from xmlrpc.client import boolean

POSITIONS_SIZE = 2 # TODO random choice ()

class Position():
    def __init__(self, position, timestamp):
        self.x = position[-4]
        self.y = position[-3]
        self.z = position[-2]
        
        self.timestamp = timestamp
        # self.position = position

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

    def add_position(self, position):
        # if len(self.positions) >= self.number_of_positions:
        #     self.positions = self.positions[1:]
        self.positions.append(position)

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
    
    def to_header(self):
        return f"{self.id}_x,{self.id}_y,{self.id}_z,"

    def to_csv(self):
        current_pos = self.positions[-1]
        return f"{current_pos.x},{current_pos.y},{current_pos.z},"
    
    def to_distance_csv(self):
        return f"{self.distance_to_ball},"


class Ball(Entity):
    def __init__(self, id, index, offset):
        super().__init__(id, index, offset)
        self.state = "stoped"
        self.owner = None

    def get_distance_from(self, player):
        return min(self.positions[-1].distance_between(player.positions_rfoot[-1]), self.positions[-1].distance_between(player.positions_lfoot[-1]))

    def get_closest_player(self, players):
        return min(players, key=lambda x: x.positions[-1].distance_between(self.positions[-1]))

    def is_in_goal_direction(self, teamRight : boolean, field : dict, goal : dict, flag = False):
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
    

class Player(Entity):
    def __init__(self, id, index, offset, team : boolean):
        super().__init__(id, index, offset)
        self.isTeamRight = team
        self.lfootIndex = 0
        self.rfootIndex = 0
        self.positions_rfoot = []
        self.positions_lfoot = []
    
    def add_position_rfoot(self, position):
        self.positions_rfoot.append(position)

    def add_position_lfoot(self, position):
        self.positions_lfoot.append(position)  

    def to_json(self):
        return {"id": self.id, "team":self.isTeamRight}





    