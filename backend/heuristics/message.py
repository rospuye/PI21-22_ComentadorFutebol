from entities import Position

class Message():
    def __init__(self, event, start=0, end=0) -> None:
        self.event = event
        self.start = start
        self.end = end
        
    def __str__(self):
        return f"Message: {self.event}, {self.start}, {self.end}"

class Aggresion(Message):
    def __init__(self, id1, id2, start=0, end=0) -> None:
        super().__init__("aggression", start, end)
        self.id1 = id1
        self.id2 = id2

    def __str__(self):
        return f"Message: {self.event}, {self.start}, {self.end}, ({self.id1} - {self.id2})"

class Goal(Message):
    def __init__(self, team, start, end) -> None:
        super().__init__("goal", start, end)
        self.team = team
        
    def __str__(self):
        return f"Message: {self.event} from team {self.team}, {self.start}, {self.end}"

class Kick_Off(Message):
    def __init__(self, instant, playerid) -> None:
        super().__init__("kick_off", instant, instant)
        self.id = playerid # if playerid = -1 kick_off was failed
        
class Pass(Message):
    def __init__(self, init_pos : Position, event, fromId, toId, start=0, end=0) -> None:
        super().__init__(event, start, end)
        self.init_pos = init_pos
        self.final_pos = 0
        self.fromId = fromId
        self.toId = toId

    def check_type(self) -> None:
        if self.init_pos.distance_between(self.final_pos) > 5:
            self.event = "long_pass"
        else:
            self.event = "short_pass"

    def __str__(self):
        return super().__str__() + f", from: {self.fromId}, to: {self.toId}"

class Dribble(Message):
    def __init__(self, event, id, start=0, end=0) -> None:
        super().__init__(event, start, end)
        self.id = id

    def __str__(self):
            return super().__str__() + f", {self.id}"