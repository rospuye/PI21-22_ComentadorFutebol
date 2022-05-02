import math
import sys
import re
import copy
import time
from .entities import Position, Entity, Ball, Player
from .heuristics import process


def position_to_array(position, flg=False):
    tmp = re.findall("[-]?\d+[.]?\d*[eE]?[-]?\d*", position)
    # print(tmp)
    # print(position)
    pos = []
    for numb in tmp:
        pos.append(float(numb))
    # print(len(pos))
    assert len(pos) == 16
    return pos
    # tmp = position.split(" ")
    # pos = []
    # for i in range(2, len(tmp)):
    #    pos.append(float(tmp[i].rstrip(")")))
    # if len(pos) != 16:
    #    pos = [float(tmp[1])] + pos
    # assert len(pos) == 16
    # return pos


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
        player.distance_to_ball = math.sqrt(player.x ** 2 + player.y ** 2 + player.z ** 2)

        teamLeft.append(player) if "Left" in player.id else teamRight.append(player)

    teamLeft.sort(key=lambda p: p.distance_to_ball)
    teamRight.sort(key=lambda p: p.distance_to_ball)

    return [ball] + teamLeft + teamRight


def write_to_file(timestamp, entities, output):
    output_str = f"{timestamp}," + "".join([entity.to_csv() for entity in entities]).rstrip(",")

    output.write(output_str + "\n")


def process_log(log, skip=1, skip_flg=False):
    tik = time.time()
    #path = "logs/input/"
    #out = "logs/output/" + log.rstrip(".log")
    count = 0
    #inpt = open(path + log, "r")
    #output = open(out, "w")
    flg = False
    events = []

    fieldParams = {}
    goalParams = {}
    entities = []
    timestamp = 0
    # TODO get fields when all 3 exist on the line
    # ((FieldLength 30)(FieldWidth 20)(FieldHeight 40)(GoalWidth 2.1)(GoalDepth 0.6)(GoalHeight 0.8)
    for line in log:
        line = line.decode()
        if not ("FieldLength" in line and "FieldWidth" in line):
            continue

        tmp = re.split('\s|\)', line)
        print(tmp)
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
    c = 0
    for line in log:
        line = line.decode()
        tmp = re.findall("soccerball.obj|models/naobody", line)
        c += 1
        if len(tmp) == 23 and not re.search("matTeam", line):
            timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
            # print(timestamp)
            # print(c)
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
            # output.write(str(tmp5))
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

                                # print(player.id, position.distance_between(player.positions[-1]))
                                # print(player.positions[-1].timestamp, player.positions[-1].x,player.positions[-1].y,player.positions[-1].z)
                                # print(position.timestamp, position.x,position.y,position.z)
                                # print(f"{robotID =}, {player.lfootIndex = }, {player.rfootIndex = }")
                                break
                        break

            # j = 1
            # k = 0
            # print(len(tmp5))
            # for i in range(0,len(tmp5), 2):
            #     position_array = position_to_array(tmp5[i][0])
            #     position = Position(position=position_array, timestamp=timestamp)
            #     if k == 0:
            #         entities[j].add_position_rfoot(position)
            #         k += 1
            #     else:
            #         entities[j].add_position_lfoot(position)
            #         j += 1
            #         k = 0
            #     print(entities[j].id, position.distance_between(entities[j].positions[-1]))
            #     print(entities[j].positions[-1].timestamp, entities[j].positions[-1].x,entities[j].positions[-1].y,entities[j].positions[-1].z)
            #     print(position.timestamp, position.x,position.y,position.z)
            # for entity in entities:
            #     print(entity.id, [pos.timestamp for pos in entity.positions])
            # print("======")

            # write_to_file(timestamp, entities, output) # substituir por heuristics
            events += process(entities, fieldParams, goalParams, timestamp)

            break

    for line in log:
        line = line.decode()
        new_timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
        if new_timestamp != timestamp:
            break

    old_timestamp = timestamp
    count = 0
    for line in log:
        line = line.decode()
        # if re.search("soccerball.obj|models/naobody", line):
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

            # for entity in entities:
            #     print(entity.id, [pos.timestamp for pos in entity.positions])

            # write_to_file(timestamp, entities, output) # Substituir pela heuristic
            events += process(entities, fieldParams, goalParams, timestamp)
        count += 1

        if count == 5000:  # 1000 ~= 40 seg
            break

    #for event in events:
    #    output.write(str(event) + "\n")

    # output.write("}")
    #output.close()
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
    events = process_log(log, skip=skip_lines, skip_flg=flg)
    print("Log processed!")
