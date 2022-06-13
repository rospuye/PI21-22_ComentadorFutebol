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

def process_log(log, prefix1="/djangoProject/commentator_website_backend/business_logic/prefix1.txt", prefix2="/djangoProject/commentator_website_backend/business_logic/prefix2.txt", createReplay=False, skip=1, skip_flg=False):
    tik = time.time()
    count = 0
    flg = False
    events = []

    fieldParams = {}
    goalParams = {}
    replayParams = {}
    entities = []
    events_dict = {}
    formation_counts = {}
    form = []
    form_players = dict()
    timestamp = 0
    left = ""
    right = ""
    play_modes = []
    curr_playmode = 0

    output = []

    # ((FieldLength 30)(FieldWidth 20)(FieldHeight 40)(GoalWidth 2.1)(GoalDepth 0.6)(GoalHeight 0.8)
    for line in log:
        count += 1
        line = line.decode()

        if not play_modes and "play_modes" in line:
            modes = re.findall("\(play_modes .*?\)", line)[0]
            play_modes = [mode for mode in modes.rstrip(")").split(" ")[1:]]

        if "play_mode" in line:
            mode = re.findall("\(play_mode \d+\)", line)[0]
            curr_playmode = int(mode.rstrip(")").split(" ")[1])

        timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])


        if not ("FieldLength" in line and "FieldWidth" in line):
            continue
        tmp = re.split('\s|\)', line)
        fieldParams["length"] = float(tmp[1])
        #print("Length:", fieldParams["length"])
        fieldParams["width"] = float(tmp[3])
        #print("Width:", fieldParams["width"])
        fieldParams["height"] = float(tmp[5])
        #print("Height:", fieldParams["height"])
        goalParams["width"] = float(tmp[7])
        #print("Goal Width:", goalParams["width"])
        goalParams["depth"] = float(tmp[9])
        #print("Goal Depth:", goalParams["depth"])
        goalParams["height"] = float(tmp[11])
        #print("Goal Height:", goalParams["height"])
        replayParams["BorderSize"] = tmp[13]
        replayParams["FreeKickDistance"] = tmp[15]
        replayParams["WaitBeforeKickOff"] = tmp[17]
        replayParams["AgentRadius"] = tmp[19]
        replayParams["BallRadius"] = tmp[21]
        replayParams["BallMass"] = tmp[23]
        replayParams["RuleGoalPauseTime"] = tmp[25]
        replayParams["RuleKickInPauseTime"] = tmp[27]
        replayParams["RuleHalfTime"] = tmp[29]
        replayParams["half"] = tmp[31]
        replayParams["score_left"] = tmp[33]
        replayParams["score_right"] = tmp[35]
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

    if createReplay:
        prefix1 = open(prefix1, "r")
        output.append(prefix1.read())
        prefix1.close()
        output.append(f"T {left} {right}  #0000ff #ff0000\n")
        prefix2 = open(prefix2, "r")
        output.append(prefix2.read())
        prefix2.close()

    c = 0
    for line in log:
        count += 1
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

            ent_idx = 0
            n_foot = 0
            if createReplay:
                for i in range(len(tmp)):
                    robot = entities[ent_idx]

                    if "naobody" in tmp[i]:
                        ent_idx += 1
                        n_foot = 0
                    elif "head" in tmp[i]:
                        robot.headIndex = i-2
                        robot.head_pos = position_to_array(tmp[i-2])
                        robot.add_joint("head")
                    elif "rupperarm" in tmp[i]:
                        robot.rupperarmIndex = i-1
                        robot.rupperarm_pos = position_to_array(tmp[i-1])
                        robot.add_joint("rupperarm")
                    elif "rlowerarm" in tmp[i]:
                        robot.rlowerarmIndex = i-1
                        robot.rlowerarm_pos = position_to_array(tmp[i-1])
                        robot.add_joint("rlowerarm")
                    elif "lupperarm" in tmp[i]:
                        robot.lupperarmIndex = i-1
                        robot.lupperarm_pos = position_to_array(tmp[i-1])
                        robot.add_joint("lupperarm")
                    elif "llowerarm" in tmp[i]:
                        robot.llowerarmIndex = i-1
                        robot.llowerarm_pos = position_to_array(tmp[i-1])
                        robot.add_joint("llowerarm")
                    elif "rthigh" in tmp[i]:
                        robot.rthighIndex = i-1
                        robot.rthigh_pos = position_to_array(tmp[i-1])
                        robot.init_thigh(robot.rthigh_pos, True)
                        robot.add_joint("rthigh")
                    elif "rshank" in tmp[i]:
                        robot.rshankIndex = i-1
                        robot.rshank_pos = position_to_array(tmp[i-1])
                        robot.add_joint("rshank")
                    elif "rfoot" in tmp[i]:
                        n_foot += 1
                        if n_foot > 2:
                            robot.has_extra_foot = True
                        robot.rfootIndex = i-1
                        robot.rfoot_pos = position_to_array(tmp[i-1])
                        robot.add_joint("rfoot")
                    elif "lthigh" in tmp[i]:
                        robot.lthighIndex = i-1
                        robot.lthigh_pos = position_to_array(tmp[i-1])
                        robot.init_thigh(robot.lthigh_pos, False)
                        robot.add_joint("lthigh")
                    elif "lshank" in tmp[i]:
                        robot.lshankIndex = i-1
                        robot.lshank_pos = position_to_array(tmp[i-1])
                        robot.add_joint("lshank")
                    elif "lfoot" in tmp[i]:
                        n_foot += 1
                        if n_foot > 2:
                            robot.has_extra_foot = True
                        robot.lfootIndex = i-1
                        robot.lfoot_pos = position_to_array(tmp[i-1])
                        robot.add_joint("lfoot")

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
        count += 1
        line = line.decode()
        new_timestamp = float(re.findall("time \d+[.]?\d*", line)[0].split(" ")[1])
        if new_timestamp != timestamp:
            break

    #output.append(f"S {timestamp} {play_modes[curr_playmode]} 0 0\n")
    #for i in range(count):
    #output.extend([ent.to_replay() for ent in entities])

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
        # print(timestamp)
        # if timestamp > 5:
            
        #     # for ent in entities[1:]:
        #     #     print(f"{ent.id}, time: {ent.joint_time/ent.count}, {ent.rthigh_time/ent.rthigh_count}, {ent.lthigh_time/ent.lthigh_count}")
        #     #     print(f"{ent.id}, time: {ent.joint_time}, {ent.rthigh_time}, {ent.lthigh_time}")


        #     break


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

                    if createReplay:

                        headIndex = entity.headIndex
                        rupperarmIndex = entity.rupperarmIndex
                        rlowerarmIndex = entity.rlowerarmIndex
                        lupperarmIndex = entity.lupperarmIndex
                        llowerarmIndex = entity.llowerarmIndex
                        rthighIndex = entity.rthighIndex
                        rshankIndex = entity.rshankIndex
                        lthighIndex = entity.lthighIndex
                        lshankIndex = entity.lshankIndex

                        rfootIndex = entity.rfootIndex
                        lfootIndex = entity.lfootIndex

                        if tmp[headIndex]:
                            #print(tmp)
                            #had_changes[idx] = True
                            entity.head_pos = position_to_array(tmp[headIndex].strip())
                            entity.add_joint("head")
                        if tmp[rupperarmIndex]:
                            #had_changes[idx] = True
                            entity.rupperarm = position_to_array(tmp[rupperarmIndex].strip())
                            entity.add_joint("rupperarm")
                        if tmp[rlowerarmIndex]:
                            #had_changes[idx] = True
                            entity.rlowerarm = position_to_array(tmp[rlowerarmIndex].strip())
                            entity.add_joint("rlowerarm")
                        if tmp[lupperarmIndex]:
                            #had_changes[idx] = True
                            entity.lupperarm = position_to_array(tmp[lupperarmIndex].strip())
                            entity.add_joint("lupperarm")
                        if tmp[llowerarmIndex]:
                            #had_changes[idx] = True
                            entity.llowerarm = position_to_array(tmp[llowerarmIndex].strip())
                            entity.add_joint("llowerarm")
                        if tmp[rthighIndex]:
                            #had_changes[idx] = True
                            entity.rthigh = position_to_array(tmp[rthighIndex].strip())
                            entity.add_joint("rthigh")
                        if tmp[rshankIndex]:
                            #had_changes[idx] = True
                            entity.rshank = position_to_array(tmp[rshankIndex].strip())
                            entity.add_joint("rshank")
                        if tmp[lthighIndex]:
                            had_changes[idx] = True
                            entity.lthigh = position_to_array(tmp[lthighIndex].strip())
                            entity.add_joint("lthigh")
                        if tmp[lshankIndex]:
                            #had_changes[idx] = True
                            entity.lshank = position_to_array(tmp[lshankIndex].strip())
                            entity.add_joint("lshank")

                    if tmp[rIndex]:
                        had_changes[idx] = True
                        new_pos = Position(position=position_to_array(tmp[rIndex].strip()), timestamp=timestamp)
                        entity.add_position_rfoot(new_pos)
                        entity.rfoot = position_to_array(tmp[rIndex].strip())
                        if createReplay:
                            entity.add_joint("rfoot")
                    if tmp[lIndex]:
                        had_changes[idx] = True
                        new_pos = Position(position=position_to_array(tmp[lIndex].strip()), timestamp=timestamp)
                        entity.add_position_lfoot(new_pos)
                        entity.lfoot = position_to_array(tmp[lIndex].strip())
                        if createReplay:
                            entity.add_joint("lfoot")

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

            output.append(f"S {timestamp} {play_modes[curr_playmode]} 0 0\n")
            output.extend([ent.to_replay() for ent in entities])
        count += 1

        if count == 1000:  # 1000 ~= 40 seg
            break

    tik1 = time.time()
    replayfile = None
    if createReplay:
        replayfile = open("replayfile.replay", "w")
        #yprint(output)
        replayfile.write("".join([x.encode() for x in output]))
        replayfile.close()
    tok1 = time.time()
    print("Writing time:", tok1 - tik1)

    #replayfile.close()
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
    
    return events, analytics_log, form, form_players, [left, right], replayfile


if __name__ == "__main__":
    log = open("test1.log", "r")
    
    skip_lines = 1
    flg = False
    if len(sys.argv) > 2:
        flg = True
        skip_lines = int(sys.argv[2])
    events = process_log(log, skip=skip_lines, skip_flg=flg)
    print("Log processed!")

    # n_fails = [x for x in range(10,21)]
    # init_fact = [1/x for x in range(1, 21)]

    # for i in n_fails:
    #     for j in init_fact:
    #         N_FAILS = i
    #         INIT_FACT = j
    #         print(f"{N_FAILS},{INIT_FACT},", end="")
    #         for n in range(3):
    #             log = open("test1.log", "r")

    #             set_vars(N_FAILS, INIT_FACT)

    #             tic = time.time()
    #             process_log(log, skip=skip_lines, skip_flg=flg)
    #             toc = time.time()
    #             log.close()
    #             print(f"{toc - tic},", end="")
    #         print()
                
