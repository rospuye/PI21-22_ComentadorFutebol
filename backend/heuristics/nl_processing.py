import random
from log_processing import process_log
import json

lines = {
    "dribble": [
        "{} is racing through the field",
        "{} has the ball!"
    ],
    "pass_success": [
        "{} passes the ball to {}",
        "{} sends it to {}"
    ],
    "pass_fail": [
        "{} steals the ball"
    ],
    "kick_off": [
        "{} starts the game"
    ],
    "goal_shot": [
        "{} shoots!"
    ],
    "goal": [
        "{} SCORES!!"
    ],
    "defense": [
        "defended"
    ],
    "aggression": [
        "{} and {} fall down",
        "{} and {} are going at it"
    ]


}

def pass_lines(event):
    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]

    if p1["team"] == p2["team"]:
        n = random.randint(0,1)
        return f"({event['start']}, {event['end']}) " +  lines["pass_success"][n].format(p1["id"], p2["id"])
    else:
        n = random.randint(0,0)
        return f"({event['start']}, {event['end']}) " + lines["pass_fail"][n].format(p2["id"])


def dribble_lines(event):
    args = event["args"]
    p1 = args["player"]

    n = random.randint(0,1)
    return f"({event['start']}, {event['end']}) " + lines["dribble"][n].format(p1["id"])

def kick_off_lines(event):
    args = event["args"]
    p1 = args["player"]

    n = random.randint(0,0)
    return f"({event['start']}, {event['end']}) " + lines["kick_off"][n].format(p1["id"])

def goal_shot_lines(event):
    args = event["args"]
    #p1 = args["player"]

    n = random.randint(0,0)
    return f"({event['start']}, {event['end']}) " + lines["goal_shot"][n]

def goal_lines(event):
    args = event["args"]
    team = args["team"]

    n = random.randint(0,0)
    return f"({event['start']}, {event['end']}) " + lines["goal"][n].format(team)

def aggression_lines(event):

    args = event["args"]
    p1 = args["id1"]
    p2 = args["id2"]


    n = random.randint(0,1)
    return f"({event['start']}, {event['end']}) " + lines["aggression"][n].format(p1, p2)



def generate_script(events):

    e = json.loads(events)


    script = []
    for i in range(len(e)):
        print(e[i])
        event_str = e[i]["event"]

        if event_str == "short_pass" or event_str == "long_pass":
            script.append(pass_lines(event=e[i]))
        elif event_str == "dribble":
            script.append(dribble_lines(event=e[i]))
        elif event_str == "kick_off":
            script.append(kick_off_lines(event=e[i]))            
        elif event_str == "goal_shot":
            script.append(goal_shot_lines(event=e[i]))
        elif event_str == "goal":
            script.append(goal_lines(event=e[i]))     
        elif event_str == "aggression":
            script.append(aggression_lines(event=e[i]))
        else:
            script.append(f"({e[i]['start']}, {e[i]['end']}) " + "Not implemented yet :)")

    return script



if __name__ == "__main__":

    events = process_log("sparkmonitor.log")
    #print(events)
    script = generate_script(events)
    print(script)
    f = open("script.txt", "w")
    for line in script:
        f.write(line)
        f.write("\n")
    f.close()

        