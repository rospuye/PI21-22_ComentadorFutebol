import math
import sys
import re
import copy
import time
from .entities import Position, Entity, Ball, Player
from .heuristics import process
from .analytics import analytics, get_analytics


def position_to_array(position, flg=False):
    tmp = re.findall("[-]?\d+[.]?\d*[eE]?[-]?\d*", position)
    pos = []
    for numb in tmp:
        pos.append(float(numb))
    # assert len(pos) == 16
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
    count = 0
    flg = False
    events = []

    fieldParams = {}
    goalParams = {}
    entities = []
    events_dict = {}
    formation_counts = {}
    form = []
    form_players = dict()
    timestamp = 0
    left = ""
    right = ""
    # ((FieldLength 30)(FieldWidth 20)(FieldHeight 40)(GoalWidth 2.1)(GoalDepth 0.6)(GoalHeight 0.8)
    for line in log:
        line = line.decode()
        if not ("FieldLength" in line and "FieldWidth" in line):
            continue
        tmp = re.split('\s|\)', line)
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
    for line in log:
        line = line.decode()
        tmp = re.findall("\(team_left .*?\)", line)
        tmp2 = re.findall("\(team_right .*?\)", line)
        if tmp:
            left = tmp[0].split(" ")[1].rstrip(")")
        if tmp2:
            right = tmp2[0].split(" ")[1].rstrip(")")
        if left and right:
            break
    c = 0
    for line in log:
        line = line.decode()
        tmp = re.findall("soccerball.obj|models/naobody", line)
        c += 1
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
                            if player.id == robotID:
                                if re.search("lfoot", foot_dir):
                                    player.add_position_lfoot(position)
                                    player.lfootIndex = i
                                else:
                                    player.add_position_rfoot(position)
                                    player.rfootIndex = i
                                break
                        break


            messages, form, form_players = process(entities, fieldParams, goalParams, timestamp, events_dict, formation_counts, form, form_players)
            events += messages

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
                        had_changes[idx] = True
                        new_pos = Position(position=position_to_array(tmp[rIndex].strip()), timestamp=timestamp)
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


            messages, form, form_players = process(entities, fieldParams, goalParams, timestamp, events_dict, formation_counts, form, form_players)
            events += messages
        count += 1

        # if count == 5000:  # 1000 ~= 40 seg
        #     break

    tok = time.time()
    elapsed = tok - tik
    print("Event detection in:", elapsed)
    # Formation debug prints
    # print("Formation for teamA:", form[0])
    # print("Formation for teamB:", form[1])
    # print("Players and their spot in the formation:")
    translate = {0: "defender", 1: "midfielder", 2: "forward"}
    # for player in form_players:
    #     print(player.id, translate[form_players[player]])
    tik = time.time()
    analytics_log = get_analytics(events, entities)
    # Analytics debug prints
    # for timestamp in analytics_log: # double
    #     print(timestamp)
    #     print("\tTeams:")
    #     for team in analytics_log[timestamp]["teams"]: # str (A or B)
    #         print("\t\t",team,analytics_log[timestamp]["teams"][team])
    #     print("\tPlayers:")
    #     for player in analytics_log[timestamp]["players"]: # playerid str
    #         print("\t\t",player,analytics_log[timestamp]["players"][player])
    # print(len(analytics_log))
    tok = time.time()
    elapsed2 = tok - tik
    print("Analytics gathered in:", elapsed2)
    print("Total processing time:", elapsed+elapsed2)
    return events, analytics_log, form, form_players, [left, right]


if __name__ == "__main__":
    log = sys.argv[1]
    skip_lines = 1
    flg = False
    if len(sys.argv) > 2:
        flg = True
        skip_lines = int(sys.argv[2])
    events = process_log(log, skip=skip_lines, skip_flg=flg)
    print("Log processed!")
