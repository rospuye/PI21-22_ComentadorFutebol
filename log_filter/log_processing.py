import sys
import re
import json

class Entity():
    def __init__(self, id, position, index, offset):
        self.id = id
        self.position = position
        self.index = index
        self.offset = offset

    def to_json(self):
        return {"id": self.id, "position": self.position}


def process(log):

    path = "logs/input/"
    out = "logs/output/" + log.rstrip(".log") + "1.json"
    count = 0
    inpt = open(path + log, "r")
    output = open(out, "w")
    flg = False
    output.write("{")
    
    entities = []
    timestamp = 0
    for line in inpt:
        tmp = re.findall("soccerball.obj|models/naobody", line)
        if len(tmp) == 23 and not re.search("matTeam",line):
            timestamp = re.findall("time \d+[.]?\d*", line)[0].split(" ")[1]
            count += 1
            tmp = re.split("\(nd", line)

            tmp2 = [(tmp[i-1].strip(),i) for i in range(len(tmp)) if re.search("soccerball.obj", tmp[i])]
            for t,i in tmp2:
                ball = Entity("ball",t,i, 1)
                entities.append(ball)

            pattern = "\(resetMaterials .*?\)"
            tmp4 = [(tmp[i-2], re.findall(pattern, tmp[i])[0], i)  for i in range(len(tmp)) if re.search("naobody", tmp[i])]

            for t, n, i in tmp4:
                l = n.split(" ")
                robotID = l[1] + l[2]
                robot = Entity(robotID, t, i, 2)
                entities.append(robot)
                                                      
            output.write(f'"{timestamp}":')
            json.dump([entity.to_json() for entity in entities], output)
            break

    for line in inpt:
        new_timestamp = re.findall("time \d+[.]?\d*", line)[0].split(" ")[1]
        
        if new_timestamp != timestamp:
            break
        
    for line in inpt:
        
        if re.search("soccerball.obj|models/naobody", line):
            tmp = re.split("\(nd", line)
            timestamp = re.findall("time \d+[.]?\d*", line)[0].split(" ")[1]
            for entity in entities:
                i = entity.index
                o = entity.offset
                if re.search("soccerball.obj|models/naobody", tmp[i]):
                    entity.position = tmp[i-o]
            output.write(f',\n"{timestamp}":')
            json.dump([entity.to_json() for entity in entities], output)
            
        if flg:
            break
    output.write("}")
    output.close()
    #print(count)

if __name__ == "__main__":
    log = sys.argv[1]
    process(log)



