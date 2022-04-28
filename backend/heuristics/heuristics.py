from entities import Position, Entity, Ball
from message import Message, Aggresion, Goal, Kick_Off, Pass

AGGRESSION_DISTANCE_MARGIN = 2      # Distance to be considered collision between players
CONTACT_DISTANCE = 0.1              # Distance to be considered contact between entities
TIMESTAMPS_TO_KICKOFF = 900         # Around 18 seconds from goal (15 segs when restart positions)
events = {}                         # TODO, add start when game starts

def process(entities : list, field : dict, goal : dict, curr_timestamp : float) -> list:
    """If event is detected, the positions related to the event's timestamp are deleted from all entities.
    It returns a string event"""
    ball = entities[0]
    teamA = entities[1:12] # Left (False)
    teamB = entities[12:] # Right (True)
    messages = []
    if curr_timestamp == 0:
        events["start"] = None
    
    # Event detection
    messages += detect_kick_off(ball, teamA, teamB, curr_timestamp)
    messages += detect_outs(field, ball)
    messages += detect_corner_shot(ball, teamA, teamB, curr_timestamp)
    messages += detect_goal_shot(ball, field, goal, curr_timestamp)
    messages += detect_goal(ball, field, goal, curr_timestamp)
    messages += detect_aggressions(teamA=teamA, teamB=teamB)
    messages += detect_defense(ball, teamA, teamB, curr_timestamp)
    messages += detect_pass_or_dribble(ball, entities[1:], curr_timestamp) 

    return messages

def detect_kick_off(ball : Ball, teamA, teamB, timestamp):
    if not "start" in events and not "goal" in events and not "out" in events:
        return []
    elif "start" in events: # start of game
        if timestamp > 15: # kick_off timeout
            events.pop("start")
            return [Kick_Off(timestamp, -1)]
        player = ball.get_closest_player(teamA+teamB)
        if ball.get_distance_from(player) <= CONTACT_DISTANCE: # kick_off!
            events.pop("start")
            return [Kick_Off(timestamp, player.id)]
        else: return [] # still waiting on kick_off
    elif "goal" in events:
        goal = events["goal"]
        if timestamp - goal.end > 18: # kick_off timeout
            events.pop("goal")
            return [Kick_Off(timestamp, -1)]
        player = ball.get_closest_player(teamA+teamB)
        if ball.get_distance_from(player) <= CONTACT_DISTANCE: # kick_off!
            events.pop("goal")
            return [Kick_Off(timestamp, player.id)]
        else: return [] # still waiting on kick_off
    elif "out" in events:
        out = events["out"]
        if timestamp - out.end > 18: # kick_off timeout
            events.pop("out")
            return [Kick_Off(timestamp, -1)]
        player = ball.get_closest_player(teamA+teamB)
        if ball.get_distance_from(player) <= CONTACT_DISTANCE: # kick_off!
            events.pop("out")
            return [Kick_Off(timestamp, player.id)]
        else: return [] # still waiting on kick_off

def detect_corner_shot(ball : Ball, teamA : list, teamB : list, curr_timestamp : float):

    if "corner" in events:
        if start_outside_shot("corner", ball, teamA, teamB, curr_timestamp):
            return []
    
    elif "out" in events:
        if start_outside_shot("out", ball, teamA, teamB, curr_timestamp):
            return []

    elif "corner_shot" in events:
        message = outside_shot("corner", ball, teamA, teamB, curr_timestamp)
        if message is not None:
            return [message]
    
    elif "out_shot" in events:
        message = outside_shot("out", ball, teamA, teamB, curr_timestamp)
        if message is not None:
            return [message]

    return []

def start_outside_shot(event : str, ball : Ball, teamA : list, teamB : list, curr_timestamp : float):
    """If a outside shot is kicked, returns True and add to the events. Returns False otherwise"""
    atk_team = teamA if ball.owner.isTeamRight else teamB
        
    for player in atk_team:

        # If attacking team has a player that entered in contact with the ball
        if ball.get_distance_from(player) < CONTACT_DISTANCE:
            events.pop("corner")
            events["{event}_shot"] = {"start": curr_timestamp}
            return True
            
    return False

def outside_shot(event : str, ball : Ball, teamA : list, teamB : list, curr_timestamp : float):

    # The shot ends when the ball stops moving
    if has_ball_stopped(ball, teamA, teamB):
        message = Message(event=f"{event}_shot", start=events[f"{event}_shot"]["start"], end=curr_timestamp)
        events.pop("corner_shot")
        return [message]
            
def has_ball_stopped(ball : Ball, teamA : list, teamB : list):
    """Returns True if the ball collides with some player of if its velocity is 0"""
    if ball.get_current_velocity == 0:
        return True

    for player in teamA + teamB:
        if ball.get_distance_from(player) < CONTACT_DISTANCE:
            return True

    return False
    
def detect_outs(field : dict, ball : Ball):
    """Given the field and the ball, detect if the ball has exited the field"""
    position : Position = ball.positions[-1]
    length = field["length"]
    width = field["width"]
    if position.x < -length/2 or position.x > length/2 or position.y < -width/2 or position.y > width/2:
        message = Message(event="out", start=position.timestamp, end=position.timestamp)

        # If ball exited by the opposite side of a team
        if (position.x > length/2 and ball.owner.isTeamRight) or (position.x < -length/2 and not ball.owner.isTeamRight):
            message = Message(event="corner", start=position.timestamp, end=position.timestamp)
            events["corner"] = message
        else:
            events["out"] = message

        return [message]
    return []
       
def detect_goal(ball: Ball, field : dict, goal : dict, timestamp : float):
    """Length is the bigger field parameter"""
    ball_pos = ball.positions[-1]
    team = None
    if -goal["width"]/2 < ball_pos.y < goal["width"]/2 and 0 < ball_pos.z < goal["height"]:
        if -field["length"]/2-goal["depth"] < ball_pos.x < -field["length"]/2:
            team = "Left"
        elif -field["length"]/2 < ball_pos.x < field["length"]/2+goal["depth"]:
            team = "Right"
        if team:
            m1 = Goal(team, timestamp, timestamp)
            events["goal"] = m1
            if "goal_shot" in events:
                m2 = events["goal_shot"]
                m2.end = timestamp
                events.pop("goal_shot", None)
            return [m2, m1]
    return []

def detect_goal_shot(ball: Ball, field : dict, goal : dict, timestamp : float):
    """Detects if a goal shot is currently happening"""
    
    # check if ball is in goal area and the owner is correct
    if not (ball.positions[-1].x < -field["length"]/4 and not ball.owner.isTeamRight or ball.positions[-1].x > field["length"]/4 and ball.owner.isTeamRight):
        return []
    # ball velocity increases in direction of goal
    if not ball.is_in_goal_direction(not ball.owner.isTeamRight, field, goal):
        return []
    
    if "goal_shot" in events:
        events["goal_shot"].end = timestamp
    else:
        message = Message(event="goal_shot", start=timestamp, end=timestamp)
        events["goal_shot"] = message
    return []

def detect_defense(ball : Ball, teamA : list, teamB : list, timestamp : float):
    if not "goal_shot" in events:
        return []
    oponent_team = teamB if ball.owner.isTeamRight else teamA
    
    for player in oponent_team:
        if ball.get_distance_from(player) < CONTACT_DISTANCE:
            m1 = Message("defense", start=timestamp, end=timestamp)
            m2 = events["goal_shot"]
            m2.end = timestamp
            events.pop("goal_shot", None)
            ball.owner = player
            return [m1, m2]
    return []

def detect_aggressions(teamA : list, teamB : list, distance_margin=AGGRESSION_DISTANCE_MARGIN):
    """Given teams, returns a list of Aggressions."""

    aggressions = {} 

    for entity1 in teamA:
        key = ""
        for entity2 in teamB:
            # Ignore if some entity is ball
            if isinstance(entity1, Ball) or isinstance(entity2, Ball):
                continue

            isNewTimeStamp = True

            # TODO
            for i in range(len(entity1.positions)):
                pos1 : Position = entity1.positions[i]

                print(f"{len(entity1.positions) = }")
                print(f"{len(entity2.positions) = }")
            
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

        # If one Aggression still haven't finish
        if not isNewTimeStamp:
            aggressions.get(key).pop(-1)

    aggressions_list = []

    for aggression in aggressions.values():
        aggressions_list += aggression

    return aggressions_list


def detect_pass_or_dribble(ball : Ball, players : list, timestamp : float):
    """Given the entities checks if a pass or dribble is hapening"""
    
    # If Ball isn't moving then there isn't a pass/dribble
    if ball.get_current_velocity() == 0:
        return []


    for player in players:        
        # If player touch the ball
        if ball.get_distance_from(player) < CONTACT_DISTANCE:
            
            # The dribble/pass was initialized
            if "dribble/pass" not in events:
                events["dribble/pass"] = Pass(ball.position[-1],  "dribble/pass", timestamp, timestamp)
                ball.owner = player
                return []
        
            # If the player who touch the ball is the same, then dribble
            if player == ball.owner:
                message = events["dribble/pass"]
                message.end = timestamp
                message.event = "dribble"
                events.pop("dribble/pass")
                return [message]
            # If the player belongs to the same team, then pass
            elif player.isTeamRight == ball.owner.isTeamRight:
                message = events["dribble/pass"]
                message.end = timestamp
                message.event = "pass"
                message.final_pos = ball.positions[-1]
                message.check_type()
                events.pop("dribble/pass")
                return [message]
            # If the player is an opponent then intersect
            else:

                # if the closest player to the ball o the same team is the owner then dribble
                event = "dribble"
                for p in players:
                    if p.isTeamRight == ball.owner.isTeamRight and ball.get_distance_from(p) < ball.get_distance_from(ball.owner):
                        event = "pass"
                        break
                
                m1 = events["dribble/pass"]
                m1.end = timestamp
                m1.event = event
                m1.final_pos = ball.positions[-1]
                message.check_type()
                events.pop("dribble/pass")

                m2 = Message("intersect", timestamp, timestamp)
                ball.owner = player

                return [m1, m2]