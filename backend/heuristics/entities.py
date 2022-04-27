import math
from xmlrpc.client import boolean

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



    def to_json(self):
        return {"id": self.id, "position": self.position}
    
    def to_header(self):
        return f"{self.id}_x,{self.id}_y,{self.id}_z,"

    def to_csv(self):
        return f"{self.x},{self.y},{self.z},"
    
    def to_distance_csv(self):
        return f"{self.distance_to_ball},"


class Ball(Entity):
    def __init__(self, id, index, offset):
        super().__init__(id, index, offset)
        self.state = "stoped"

    def get_distance_from(self, player):
        return self.positions[0].distance_between(player.positions[0])

    

class Player(Entity):
    def __init__(self, id, index, offset, team : boolean):
        super.__init__(id, index, offset)
        self.team = team