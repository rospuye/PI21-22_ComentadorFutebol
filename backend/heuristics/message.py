class Message():
    def __init__(self, event, start=0, end=0) -> None:
        self.event = event
        self.start = start
        self.end = end

class Aggresion(Message):
    def __init__(self, id1, id2, start=0, end=0) -> None:
        super().__init__("aggression", start, end)
        self.id1 = id1
        self.id2 = id2

class Goal(Message):
    def __init__(self, team, start, end) -> None:
        super().__init__("goal", start, end)
        self.team = team
        