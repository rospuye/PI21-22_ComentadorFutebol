import math
import sys
import re
import copy
import time
from entities import Position, Entity, Ball, Player
from heuristics import process


def position_to_array(position, flg=False):
    """ Given a log node with position matrix, return the matrix in form of array """
    # Extract Numbers
    tmp = re.findall("[-]?\d+[.]?\d*[eE]?[-]?\d*", position)
    pos = []
    for numb in tmp:
        pos.append(float(numb))

    assert len(pos) == 16
    return pos



def write_to_file(timestamp, entities, output):
    output_str = f"{timestamp}," + "".join([entity.to_csv() for entity in entities]).rstrip(",")
    output.write(output_str + "\n")


def process_log(log, skip=1, skip_flg=False):
    tik = time.time()
    count = 0
    flg = False
    events = []

    fieldParams = {}
    goalParams = {}
    entities = []
    timestamp = 0
    # Find the Field borders
    # ((FieldLength 30)(FieldWidth 20)(FieldHeight 40)(GoalWidth 2.1)(GoalDepth 0.6)(GoalHeight 0.8)
    for line in log:
        line = line.decode()
        if not ("FieldLength" in line and "FieldWidth" in line):
            continue

        tmp = re.split('\s|\)', line)
        #print(tmp)
        fieldParams["length"] = float(tmp[1])
        print("Length:", fieldParams["length"])
        fieldParams["width"] = float(tmp[3])
        print("Width:", fieldParams["width"])
        goalParams["width"] = float(tmp[7])
        print("Goal Width:", goalParams["width"])
        goalParams["depth"] = float(tmp[9])
        print("Goal Depth:", goalParams["depth"])
        goalParams["height"] = float(tmp[11])
        print("Goal Height:", goalParams["height"])
        break
    
    # Find and create each entity of the game
    for line in log:
        line = line.decode()
        tmp = re.findall("soccerball.obj|models/naobody", line)
        
        if len(tmp) == 23 and not re.search("matTeam", line):
            timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
            
            tmp = re.split("\(nd", line)
            tmp2 = [(tmp[i - 1].strip(), i) for i in range(len(tmp)) if re.search("soccerball.obj", tmp[i])]
            for pos, i in tmp2:
                ball = Ball("ball", i, 1)
                position_array = position_to_array(pos)
                position = Position(position=position_array, timestamp=timestamp)
                ball.add_position(position)
                entities.append(ball)

            pattern = "\(resetMaterials .*?\)"
            tmp4 = [(tmp[i - 2].strip(), re.findall(pattern, tmp[i])[0], i) for i in range(len(tmp)) if
                    re.search("naobody", tmp[i])]
            tmp5 = [(tmp[i - 1].strip(), i - 1, tmp[i]) for i in range(len(tmp)) if re.search("rfoot|lfoot", tmp[i])]
            
            
            for pos, n, i in tmp4:
                l = n.split(" ")
                robotID = l[1] + l[2]
                team = True if "Right" in robotID else False
                position_array = position_to_array(pos)
                position = Position(position=position_array, timestamp=timestamp)
                robot = Player(id=robotID, index=i, offset=2, team=team)
                robot.add_position(position)
                entities.append(robot)

            for pos, i, foot_dir in tmp5:
                position_array = position_to_array(pos)
                position = Position(position=position_array, timestamp=timestamp)
                robotID = ""
                for j in range(i, 0, -1):
                    if re.search("naobody", tmp[j]):
                        id_node = re.findall(pattern, tmp[j])[0]
                        l = id_node.split(" ")
                        robotID = l[1] + l[2]
                        for player in entities[1:]:
                            # print(robotID)
                            if player.id == robotID:
                                if re.search("lfoot", foot_dir):
                                    player.add_position_lfoot(position)
                                    player.lfootIndex = i
                                else:
                                    player.add_position_rfoot(position)
                                    player.rfootIndex = i
                                break
                        break

            # write_to_file(timestamp, entities, output) # substituir por heuristics
            events += process(entities, fieldParams, goalParams, timestamp)

            break

    teamA = ""
    teamB = ""

    for line in log:
        line = line.decode()
        
        if "team_left" in line:
            tmp = re.findall("\(team_left .*?\)",line)[0]
            teamA = tmp.split(" ")[1].rstrip(")")
        if "team_right" in line:
            tmp = re.findall("\(team_right .*?\)",line)[0]
            teamB = tmp.split(" ")[1].rstrip(")")

        if teamA and teamB:
            break
    
    print(f"{teamA = }")
    print(f"{teamB = }")

    for ent in entities[1:]:
        ent.teamName = teamB if ent.isTeamRight else teamA


    # Process the rest of the file
    old_timestamp = timestamp
    count = 0
    for line in log:
        line = line.decode()
        new_timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
        if new_timestamp==timestamp:
            continue

        timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
        if old_timestamp == timestamp:
            break

        
        old_timestamp = timestamp
        if not skip_flg or not count % skip == 0:

            tmp = re.split("\(nd", line)
            had_changes = [False] * len(entities)
            for idx in range(len(entities)):
                entity = entities[idx]
                i = entity.index
                o = entity.offset

                if tmp[i - o]:
                    had_changes[idx] = True
                    new_pos = Position(position=position_to_array(tmp[i - o].strip()), timestamp=timestamp)
                    entity.add_position(new_pos)

                if not isinstance(entity, Ball):
                    rIndex = entity.rfootIndex
                    lIndex = entity.lfootIndex

                    if tmp[rIndex]:
                        # print(f"{rIndex = }")
                        had_changes[idx] = True
                        new_pos = Position(position=position_to_array(tmp[rIndex].strip()), timestamp=timestamp)
                        # print(count)
                        entity.add_position_rfoot(new_pos)
                    if tmp[lIndex]:
                        had_changes[idx] = True
                        new_pos = Position(position=position_to_array(tmp[lIndex].strip()), timestamp=timestamp)
                        entity.add_position_lfoot(new_pos)

            # If at least one entity has an updated value, other entities who didn't update should repeat the last position
            if any(had_changes):
                for idx in range(len(entities)):
                    if not had_changes[idx]:
                        entity = entities[idx]
                        new_pos = copy.deepcopy(entity.positions[-1])
                        new_pos.timestamp = timestamp
                        entity.add_position(new_pos)

                        if not isinstance(entity, Ball):
                            new_pos = copy.deepcopy(entity.positions_rfoot[-1])
                            new_pos.timestamp = timestamp
                            entity.add_position_rfoot(new_pos)

                            new_pos = copy.deepcopy(entity.positions_lfoot[-1])
                            new_pos.timestamp = timestamp
                            entity.add_position_lfoot(new_pos)

            events += process(entities, fieldParams, goalParams, timestamp)
        count += 1

        if count == 5000:  # 1000 ~= 40 seg
            break

    tok = time.time()
    elapsed = tok - tik
    print(elapsed)
    return events


if __name__ == "__main__":
    log = sys.argv[1]
    skip_lines = 1
    flg = False
    if len(sys.argv) > 2:
        flg = True
        skip_lines = int(sys.argv[2])
    file = open(log, "rb")
    events = process_log(file, skip=skip_lines, skip_flg=flg)
    print("Log processed!")
