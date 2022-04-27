from entities import Position, Entity, Ball
from message import Message, Aggresion, Goal

AGGRESSION_DISTANCE_MARGIN = 2      # Distance to be considered collision between players
#TIMESTAMPS_TO_DRIBBLE = 100        # number of timestamps to be considered a dribble

def process(entities : list, field : dict, goal : dict) -> list:
    """If event is detected, the positions related to the event's timestamp are deleted from all entities.
    It returns a string event"""
    ball = entities[0]
    teamA = entities[1:12]
    teamB = entities[12:]
    goals = detect_goal(ball, field, goal)
    outs = detect_outs(field, ball)
    aggressions = detect_aggressions(teamA=teamA, teamB=teamB) # TODO, fix the distance_margin default value

    pass

def detect_outs(field : dict, ball : Ball):
    """Given the field and the ball, detect if the ball has exited the field"""
    position : Position = ball.positions[-1]
    length = field["length"]
    width = field["width"]
    if position.x < -length/2 or position.x > length/2 or position.y < -width/2 or position.y > width/2:
        return [Message(event="out", start=position.timestamp, end=position.timestamp)]
    return []
       

def detect_goal(ball: Ball, field : dict, goal : dict):
    """Length is the bigger field parameter"""
    ball_pos = ball.positions[0]
    if -goal["width"]/2 < ball_pos.y < goal["width"]/2 and 0 < ball_pos.z < goal["height"]:
        if -field["length"]/2-goal["depth"] < ball_pos.x < -field["length"]/2:
            return Goal("Left", ball_pos.timestamp, ball_pos.timestamp)
        elif -field["length"]/2 < ball_pos.x < field["length"]/2+goal["depth"]:
            return Goal("Right", ball_pos.timestamp, ball_pos.timestamp)

def detect_goal_shot(ball: Ball, field : dict, goal : dict):
    """"""
    
    # check if ball is in goal area and the owner is correct
    if not (ball.positions[-1] < -field["length"]/4 and not ball.owner.team or ball.positions[-1] > field["length"]/4 and ball.owner.team):
        return []
    # ball velocity increases in direction of goal

    #
    pass

def detect_aggressions(teamA : list, teamB : list, distance_margin=AGGRESSION_DISTANCE_MARGIN) -> list:
    """Given teams, returns a list of Aggressions."""

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
                    message = Aggresion(id1, id2)
                    message.start = pos1.timestamp
                    aggressions[key].append(message)
            
                elif not isNewTimeStamp: # end time range condition
                    isNewTimeStamp = True    
                    aggressions.get(key)[-1].end = pos1.timestamp

    aggressions_list = []

    for aggression in aggressions.values():
        aggressions_list += aggression

    return aggressions_list



def detect_pass_or_dribble(ball : Ball, players : list):
    """Given the entities checks if a pass or dribble is hapening"""
    
    # If Ball isn't moving then there isn't a pass/dribble
    if ball.get_current_velocity() == 0:
        return []


    for player in players:
        # Stop when players are too far away
        if ball.get_distance_from(player) > 1:
            return []
        
        # If player touch the ball
        if ball.get_distance_from(player) < 0.1:
            
            # The dribble/pass was initialized
            if ball.state != "dribble/pass":
                ball.state = "dribble/pass"
                ball.owner = player
                ball.event_start = ball.positions[0].timestamp
                return []
        
            # If the player who touch the ball is the same, then dribble
            if player == ball.owner:
                message = Message("dribble", ball.event_start, ball.positions[0].timestamp)
                return [message]
            # If the player belongs to the same team, then pass
            elif player.team == ball.owner.team:
                message = Message("pass", ball.event_start, ball.positions[0].timestamp)
                return [message]
            # If the player is an opponent then intersect
            else:

                # if the closest player to the ball o the same team is the owner then dribble
                event = "dribble"
                for p in players:
                    if p.team == ball.owner.team and ball.get_distance_from(p) < ball.get_distance_from(ball.owner):
                        event = "pass"
                        break
                
                m1 = Message(event, ball.event_start, ball.positions[0].timestamp)
                m2 = Message("intersect", ball.positions[0].timestamp, ball.positions[0].timestamp)
                ball.owner = player

                return [m1, m2]


# Deprecated for now
# def detect_dribble(ball : Ball, players : list):
#     # Get closest player to ball
#     player = min(players, key = lambda x: x.positions[-1].distance_between(ball.positions[-1]))
    
#     # For the last X timestamps, check if player was the closest, and if ball velocity was increased
    
        

