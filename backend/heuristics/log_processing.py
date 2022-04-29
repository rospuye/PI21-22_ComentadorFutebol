import math
import sys
import re
import copy
from entities import Position, Entity, Ball, Player
from heuristics import process

def position_to_array(position):
    tmp = position.split(" ")
    pos = []
    for i in range(2, len(tmp)):
        pos.append(float(tmp[i].rstrip(")")))
    if len(pos) != 16:
        pos = [float(tmp[1])] + pos
    assert len(pos) == 16
    return pos

def order_by_distance_to_ball(entities):
    "Given the entities, returns their position relative to the Ball entity"

    ball = entities[0]
    players = entities[1:]

    teamLeft = []
    teamRight = []

    for player in players:        
        player.x -= ball.x
        player.y -= ball.y
        player.z -= ball.z
        player.distance_to_ball = math.sqrt(player.x**2 + player.y**2 + player.z**2)

        teamLeft.append(player) if "Left" in player.id else teamRight.append(player)
    
    teamLeft.sort(key = lambda p: p.distance_to_ball)
    teamRight.sort(key = lambda p: p.distance_to_ball)

    return [ball] + teamLeft + teamRight
    
def write_to_file(timestamp, entities, output):
    output_str = f"{timestamp},"+"".join([entity.to_csv() for entity in entities]).rstrip(",")

    output.write(output_str+"\n")

def process_log(log, skip=1, skip_flg=False):
    
    path = "logs/input/"
    # out = "logs/output/" + log.rstrip(".log") + ".csv"
    count = 0
    inpt = open(path + log, "r")
    # output = open(out, "w")
    flg = False
    events = []
    

    fieldParams = {}
    goalParams = {}
    # fieldParams["width"] = 0
    # fieldParams["length"] = 0
    # fieldParams["goal_width"] = 0
    # fieldParams["goal_height"] = 0
    # fieldParams["goal_depth"] = 0
    entities = []
    timestamp = 0
    # ((FieldLength 30)(FieldWidth 20)(FieldHeight 40)(GoalWidth 2.1)(GoalDepth 0.6)(GoalHeight 0.8)
    # ((FieldLength-30-(FieldWidth-20-(FieldHeight-40-(GoalWidth-2.1)-GoalDepth-0.6-(GoalHeight-0.8-
    for line in inpt:
        tmp = re.split('\s|\)', line)
        fieldParams["length"] = float(tmp[1])
        fieldParams["width"] = float(tmp[3])
        goalParams["width"] = float(tmp[7])
        goalParams["depth"] = float(tmp[9])
        goalParams["height"] = float(tmp[11])
        break

    for line in inpt:
        tmp = re.findall("soccerball.obj|models/naobody", line)
        if len(tmp) == 23 and not re.search("matTeam",line):
            timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
            #print(type(timestamp), timestamp)
            tmp = re.split("\(nd", line)
            tmp2 = [(tmp[i-1].strip(),i) for i in range(len(tmp)) if re.search("soccerball.obj", tmp[i])]
            for pos,i in tmp2:
                ball = Ball("ball",i, 1)
                position_array = position_to_array(pos)
                position = Position(position=position_array, timestamp=timestamp)
                ball.add_position(position)
                entities.append(ball)

            pattern = "\(resetMaterials .*?\)"
            tmp4 = [(tmp[i-2].strip(), re.findall(pattern, tmp[i])[0], i)  for i in range(len(tmp)) if re.search("naobody", tmp[i])]

            for pos, n, i in tmp4:
                l = n.split(" ")
                robotID = l[1] + l[2]
                team = True if "Right" in robotID else False
                position_array = position_to_array(pos)
                position = Position(position=position_array, timestamp=timestamp)
                robot = Player(id=robotID, index=i, offset=2, team=team)
                robot.add_position(position)
                entities.append(robot)

            # for entity in entities:
            #     print(entity.id, [pos.timestamp for pos in entity.positions])
            # print("======")

            #write_to_file(timestamp, entities, output) # substituir por heuristics
            events += process(entities, fieldParams, goalParams, timestamp)
            
            break

    

    for line in inpt:
        new_timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
        if new_timestamp != timestamp:
            break
    
    old_timestamp = timestamp
    count = 0
    for line in inpt:
        
        #if re.search("soccerball.obj|models/naobody", line):
        timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
        # print(type(timestamp), timestamp)
        if old_timestamp == timestamp:
            break
        old_timestamp = timestamp
        if not skip_flg or not count % skip == 0:
            # print(f"======== Count: {count} ===========")
            
            
            tmp = re.split("\(nd", line)
            had_changes = [False] * len(entities)
            for idx in range(len(entities)):
                entity = entities[idx]
                i = entity.index
                o = entity.offset
                if tmp[i-o]:
                    had_changes[idx] = True
                    new_pos = Position(position=position_to_array(tmp[i-o].strip()), timestamp=timestamp)
                    entity.add_position(new_pos)
            
            # If at least one entity has an updated value, other entities who didn't update should repeat the last position
            if any(had_changes):
                for idx in range(len(entities)):
                    if not had_changes[idx]:
                        entity = entities[idx]
                        new_pos = copy.deepcopy(entity.positions[-1])
                        new_pos.timestamp = timestamp
                        entity.add_position(new_pos)

            # for entity in entities:
            #     print(entity.id, [pos.timestamp for pos in entity.positions])

            # write_to_file(timestamp, entities, output) # Substituir pela heuristic
            events += process(entities, fieldParams, goalParams, timestamp)
        count += 1  
        
        if count == 5:
            break
        
        
    
    # output.write("}")
    # output.close()
    return events

if __name__ == "__main__":
    log = sys.argv[1]
    skip_lines = 1
    flg = False
    if len(sys.argv) > 2:
        flg = True
        skip_lines = int(sys.argv[2])
    events = process_log(log, skip=skip_lines, skip_flg=flg)
    print("Log processed!")
    # print(f"{events = }")



