import random
from log_processing import process_log
import json



def pass_lines(event):
    lines = {
        "pass_success": [
        "{} passes the ball to {}",
        "{} sends it to {}"
        ],
        "pass_fail": [
            "{} stole the ball"
        ],
    }

    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]

    if p1["team"] == p2["team"]:
        n = random.randint(0,len(lines["pass_success"]) -1)
        return event_to_text(event, lines["pass_success"][n].format(p1["id"], p2["id"]))
    else:
        n = random.randint(0,len(lines["pass_fail"]) -1)
        return event_to_text(event, lines["pass_fail"][n].format(p2["id"]))

def dribble_lines(event):

    lines = [
        "{} is racing through the field",
        "{} has the ball!"
    ]

    args = event["args"]
    p1 = args["player"]

    n = random.randint(0,len(lines) -1)
    return event_to_text(event, lines[n].format(p1["id"]))

def kick_off_lines(event):

    lines_without_player = [
        "and the games goes on"
    ]

    lines_with_player = [
        "{} starts the game"
    ]

    args = event["args"]
    p1 = args.get("player")
    lines = lines_without_player if p1 is None else lines_with_player + lines_without_player
    n = random.randint(0,len(lines) -1)
    line_text = lines[n] if p1 is None else lines[n].format(p1["id"])
    return event_to_text(event, line_text)

def goal_shot_lines(event):

    lines = [
        "{} shoots!",
        "And he kicks"
    ]

    print(f"{event = }")
    args = event["args"]
    player = args["player"]

    n = random.randint(0,len(lines) -1)
    return event_to_text(event, lines[n].format(player["id"]))

def goal_lines(event):
    args = event["args"]
    team = args["team"]

    lines = [
        "{} SCORES!!",
        "Its a GOAL!!!"
    ]

    n = random.randint(0,len(lines) -1)
    return event_to_text(event, lines[n].format(team))

def aggression_lines(event):

    lines = [
        "{} and {} fall down",
        "{} and {} are going at it",
        "Oh no! They fell."
    ]

    args = event["args"]
    p1 = args["id1"]
    p2 = args["id2"]


    n = random.randint(0,len(lines) -1)
    return event_to_text(event, lines[n].format(p1, p2))

def defense_lines(event):
    args = event["args"]
    team = "Right" if args["player"]["team"] else "Left"

    lines = [
        "Team {} makes a defense.",
        "The shot was defended by Team {}"
    ]

    n = random.randint(0, len(lines) - 1)
    return event_to_text(event, lines[n].format(team))

def intersect_lines(event):
    return event_to_text(event, "intersected the ball")


def event_to_text(event, extra=""):
    return f"({event['start']}, {event['end']}) " + extra

lines = {
    "dribble": dribble_lines,
    "pass_success": pass_lines,
    "pass_fail": pass_lines,
    "kick_off": kick_off_lines,
    "goal_shot": goal_shot_lines,
    "goal": goal_lines,
    "defense": defense_lines,
    "intersect": intersect_lines,
    "aggression": aggression_lines
}



def generate_script(events):
    return [ 
        lines.get(event["event"], lambda x: f"({event['start']}, {event['end']}) Not implemented yet :)" )(event)
        for event in json.loads(events) 
    ]



if __name__ == "__main__":

    events = process_log("sparkmonitor.log")
    # print(events)
    script = generate_script(events)
    print(script)
    f = open("script.txt", "w")
    for line in script:
        f.write(line)
        f.write("\n")
    f.close()

        