import sys
import re

def process(log):

    path = "logs/input/"
    out = "logs/output/" + log.rstrip(".log") + ".txt"
    count = 0
    inpt = open(path + log, "r")
    output = open(out, "w")
    flg = False
    
    for line in inpt:
        #print(line)
        timestamp = re.findall("time \d+[.]?\d*", line)[0]
        if re.search("soccerball", line):
            count += 1
            tmp = [x.strip() for x in re.split("\(nd TRF", line) if re.search("soccerball", x)]
            #print(tmp)
            for t in tmp:
                tmp2 = re.findall("\(SLT .*?\)",t)[0]
                #print(tmp2)
                output.write(f"{timestamp}:ball:{tmp2}\n")
            #flg = True
        if re.search("naobody\d{1}.obj", line):

            count += 1
            tmp = re.split("\(nd TRF", line)
            pattern = "\(resetMaterials .*?\)"
            tmp2 = [(tmp[i-1], re.findall(pattern, tmp[i])[0])  for i in range(len(tmp)) if re.search("naobody", tmp[i])]
            
            #print(tmp2)
            
            for t, n in tmp2:
                l = n.split(" ")
                robotID = l[1] + l[2]
                output.write(f"{timestamp}:naobody{robotID}:{t}\n")
                
            #flg = True
                
            

        if flg:
            break

        
    #print(count)

if __name__ == "__main__":
    log = sys.argv[1]
    process(log)



