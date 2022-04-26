import math
import sys
import re
import json


class Entity():
    def __init__(self, id, position, index, offset):
        self.id = id
        self.position = position
        self.index = index
        self.offset = offset
        self.x = self.position[-4]
        self.y = self.position[-3]
        self.z = self.position[-2]
        self.distance_to_ball = 0

    def to_json(self):
        return {"id": self.id, "position": self.position}
    
    def to_header(self):
        return f"{self.id}_x,{self.id}_y,{self.id}_z,"

    def to_csv(self):
        return f"{self.x},{self.y},{self.z},"
    
    def to_distance_csv(self):
        return f"{self.distance_to_ball},"

    

def position_to_array(position):
    #print(position)
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
    output_str = f"{timestamp},"+"".join([entity.to_distance_csv() for entity in entities[1:]]).rstrip(",")

    output.write(output_str+"\n")

def process(log, skip=1, skip_flg=False):
    
    path = "logs/input/"
    out = "logs/output/" + log.rstrip(".log") + ".csv"
    count = 0
    inpt = open(path + log, "r")
    output = open(out, "w")
    flg = False
    # output.write("{")
    
    entities = []
    timestamp = 0
    for line in inpt:
        tmp = re.findall("soccerball.obj|models/naobody", line)
        if len(tmp) == 23 and not re.search("matTeam",line):
            timestamp = re.findall("time \d+[.]?\d*", line)[0].split(" ")[1]
            tmp = re.split("\(nd", line)
            #print(tmp[:10])
            tmp2 = [(tmp[i-1].strip(),i) for i in range(len(tmp)) if re.search("soccerball.obj", tmp[i])]
            for pos,i in tmp2:
                
                ball = Entity("ball",position_to_array(pos),i, 1)
                entities.append(ball)

            pattern = "\(resetMaterials .*?\)"
            tmp4 = [(tmp[i-2].strip(), re.findall(pattern, tmp[i])[0], i)  for i in range(len(tmp)) if re.search("naobody", tmp[i])]

            for pos, n, i in tmp4:
                l = n.split(" ")
                robotID = l[1] + l[2]
                robot = Entity(robotID, position_to_array(pos), i, 2)
                entities.append(robot)
                                                      
            # output.write(f'"{timestamp}":')
            # json.dump([entity.to_json() for entity in entities], output)

            # Write output
            # header_str = "".join(f"{entity.to_header()}," for entity in entities).rstrip(",").join("\n")
            # output.write(header_str)

            entities = order_by_distance_to_ball(entities)
            # print(f"{entities = }")

            # print(f"{timestamp = }")
            write_to_file(timestamp, entities, output)
            
            # print(f"{output_str =}")
            # print([f"{entity.to_csv()}" for entity in entities])


            break

    for line in inpt:
        new_timestamp = re.findall("time \d+[.]?\d*", line)[0].split(" ")[1]
        
        if new_timestamp != timestamp:
            break
    
    old_timestamp = timestamp
    count = 0
    for line in inpt:
        
        #if re.search("soccerball.obj|models/naobody", line):
        timestamp = re.findall("time \d+[.]?\d*", line)[0].split(" ")[1]
        if old_timestamp == timestamp:
            break
        old_timestamp = timestamp
        if not skip_flg or not count % skip == 0:
            
            tmp = re.split("\(nd", line)

            for entity in entities:
                i = entity.index
                o = entity.offset
                if tmp[i-o]:
                    entity.position = position_to_array(tmp[i-o].strip())
                #print(tmp[:10])
                #print(tmp[i])
                #print(tmp[i-o])
                #break

            entities = order_by_distance_to_ball(entities)
            # print(f"{entities = }")
            write_to_file(timestamp, entities, output)
        
        count += 1  
        
    # output.write("}")
    output.close()
    #print(count)

if __name__ == "__main__":
    log = sys.argv[1]
    skip_lines = 1
    flg = False
    if len(sys.argv) > 2:
        flg = True
        skip_lines = int(sys.argv[2])
    process(log, skip=skip_lines, skip_flg=flg)



