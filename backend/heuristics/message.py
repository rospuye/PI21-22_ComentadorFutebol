from entities import Position

class Message():
    def __init__(self, event, start=0, end=0) -> None:
        self.event = event
        self.start = start
        self.end = end
        
    def __str__(self):
        return f"Message: {self.event}, {self.start}, {self.end}"

    def to_json(self):
        return {"event": self.event, "start": self.start, "end": self.end, "args": {} }

class Aggresion(Message):
    def __init__(self, id1, id2, start=0, end=0) -> None:
        super().__init__("aggression", start, end)
        self.id1 = id1
        self.id2 = id2

    def __str__(self):
        return f"Message: {self.event}, {self.start}, {self.end}, ({self.id1} - {self.id2})"

    def to_json(self):
        args = { "id1": self.id1, "id2": self.id2 }
        result = super().to_json()
        result["args"] = args
        return result

class Goal(Message):
    def __init__(self, team, start, end) -> None:
        super().__init__("goal", start, end)
        self.team = team
        
    def __str__(self):
        return f"Message: {self.event} from team {self.team}, {self.start}, {self.end}"

    def to_json(self):
        args = {"team": self.team}
        result = super().to_json()
        result["args"] = args
        return result

class Kick_Off(Message):
    def __init__(self, instant, player) -> None:
        super().__init__("kick_off", instant, instant)
        self.player = player # if playerid = -1 kick_off was failed

    def to_json(self):
        args = {"player": self.player.to_json()} if self.player is not None else {}
        result = super().to_json()
        result["args"] = args
        return result
        
class Pass(Message):
    def __init__(self, init_pos : Position, event, fromPlayer, toPlayer, start=0, end=0) -> None:
        super().__init__(event, start, end)
        self.init_pos = init_pos
        self.final_pos = 0
        self.fromPlayer = fromPlayer
        self.toPlayer = toPlayer

    def check_type(self) -> None:
        if self.init_pos.distance_between(self.final_pos) > 5:
            self.event = "long_pass"
        else:
            self.event = "short_pass"

    def __str__(self):
        return super().__str__() + f", from: {self.fromPlayer.id}, to: {self.toPlayer.id}"

    def to_json(self):
        args = {"from": self.fromPlayer.to_json(), "to": self.toPlayer.to_json()}
        result = super().to_json()
        result["args"] = args
        return result

class Dribble(Message):
    def __init__(self, event, player, start=0, end=0) -> None:
        super().__init__(event, start, end)
        self.player = player

    def __str__(self):
            return super().__str__() + f", {self.player.id}"

    def to_json(self):
        args = {"player": self.player.to_json()}
        result = super().to_json()
        result["args"] = args
        return result

class Defense(Message):
    def __init__(self, event, player, start=0, end=0):
        super().__init__(event, start, end)
        self.player = player

    def __str__(self):
        return super().__str__() + f", {self.player.id}"

    def to_json(self):
        args = {"player": self.player.to_json()}
        result = super().to_json()
        result["args"] = args
        return result

class Goal_Shot(Message):
    def __init__(self, event, player, start=0, end=0):
        super().__init__(event, start, end)
        self.player = player

    def __str__(self):
        return super().__str__() + f", {self.player.id}"

    def to_json(self):
        args = {"player": self.player.to_json()}
        result = super().to_json()
        result["args"] = args
        return result