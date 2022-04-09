import sys
import re

def process(log):

    path = "logs/"
    count = 0
    inpt = open(path + log, "r")
    output = open(path + "log.txt", "w")
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
            robotIds = [re.sub("\D", "", x) for x in re.findall("naobody\d{1}.obj", line)]
            print(robotIds)
            count += 1
            tmp = [x.strip() for x in re.split("\(nd TRF", line) if re.search("naobody", x)]
            #print(tmp)
            i = 0 
            for t in tmp:
                tmp2 = re.findall("\(SLT .*?\)",t)
                #print(tmp2)
                for t2 in tmp2:
                    output.write(f"{timestamp}:naobody{robotIds[i]}:{t2}\n")
                i += 1
            

        if flg:
            break

        
    print(count)

if __name__ == "__main__":
    log = sys.argv[1]
    process(log)



