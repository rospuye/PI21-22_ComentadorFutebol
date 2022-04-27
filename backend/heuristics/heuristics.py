from entities import Position, Entity, Ball
from message import Message

AGGRESSION_DISTANCE_MARGIN = 10
TIMESTAMPS_TO_DRIBBLE = 100      # number of timestamps to be considered a dribble

def process(entities : list, field : dict, goal : dict) -> str:
    """If event is detected, the positions related to the event's timestamp are deleted from all entities.
    It returns a string event"""
    ball = entities[0]
    teamA = entities[1:12]
    teamB = entities[12:]
    
    aggressions = detect_aggressions(teamA=teamA, teamB=teamB) # TODO, fix the distance_margin default value
    

    pass



def detect_aggressions(teamA : list, teamB : list, distance_margin=AGGRESSION_DISTANCE_MARGIN) -> list:
    """Given the entities, returns a dictionary containing all the aggressions that happened.
        The structure follows: {"id1_id2": [{start: 0.01, end: 0.02}, {start: 1.0, end: 4.4}, ...]}
    """

    aggressions = {} 

    for entity1 in teamA:
        for entity2 in teamB:
            # Ignore if is the same entity or some entity is ball
            if isinstance(entity1, Ball) or isinstance(entity2, Ball):
                continue

            isNewTimeStamp = True

            for i in range(len(entity1.positions)):
                pos1 : Position = entity1.positions[i]
                pos2 : Position = entity2.positions[i]
                
                distance = pos1.distance_between(pos2)

                id1 = entity1.id
                id2 = entity2.id
                key = f"{id1}_{id2}" if id1 < id2 else f"{id2}_{id1}"

                if distance < distance_margin:
                    isNewTimeStamp = False
                    aggression_times = aggressions.get(key)

                    if aggression_times is None:
                        aggressions[key] = []
                        
                    aggressions[key].append({"start": pos1.timestamp})
            
                elif not isNewTimeStamp: # end time range condition
                    isNewTimeStamp = True    
                    aggressions.get(key)[-1]["end"] = pos1.timestamp

    return aggressions



def detect_pass_or_dribble(entities : list):
    """Given the entities checks if a pass or dribble is hapening"""
    ball = entities[0]
    players = entities[1:]
    
    for player in players:
        if ball.get_distance_from(player) > 1:
            return []
        
        if ball.get_distance_from(player) < 0.1:
            
            if ball.state != "dribble/pass":
                ball.state = "dribble/pass"
                ball.owner = player
                ball.event_start = ball.positions[0].timestamp
                return []
        
            if player == ball.owner:
                message = Message("dribble", ball.event_start, ball.positions[0].timestamp)
                return [message]
            elif player.team == ball.owner.team:
                message = Message("pass", ball.event_start, ball.positions[0].timestamp)
                return [message]
            else:

                event = "dribble"
                for p in players:
                    if p.team == ball.owner.team and ball.get_distance_from(p) < ball.get_distance_from(ball.owner):
                        event = "pass"
                        break
                
                m1 = Message(event, ball.event_start, ball.positions[0].timestamp)
                m2 = Message("intersect", ball.positions[0].timestamp, ball.positions[0].timestamp)
                ball.owner = player

                return [m1, m2]



def detect_dribble(ball : Ball, players : list):
    # Get closest player to ball
    player = min(players, key = lambda x: x.positions[-1].distance_between(ball.positions[-1]))
    
    # For the last X timestamps, check if player was the closest, and if ball velocity was increased
    
        

