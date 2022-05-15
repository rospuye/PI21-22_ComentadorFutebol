import random
from .log_processing import process_log
import json


def pass_lines(event):
    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]

    lines = {
        "pass_success": [
            f"{p1['id']} passes the ball to {p2['id']}",
            f"{p1['id']} sends it to {p2['id']}"
        ],
        "pass_fail": [
            f"{p2['id']} stole the ball"
        ],
    }

    if p1["team"] == p2["team"]:
        return event_to_text(event, lines["pass_success"])
    else:
        return event_to_text(event, lines["pass_fail"])


def dribble_lines(event):
    args = event["args"]
    p1 = args["player"]

    lines = [
        f"{p1['id']} is racing through the field",
        # f"{p1['id']} has the ball!",
        f"{p1['id']} is dribbling around!"
    ]

    return event_to_text(event, lines)


def kick_off_lines(event):
    args = event["args"]
    p1 = args.get("player")

    lines_without_player = [
        "and the games goes on"
    ]

    if p1 is not None:
        lines_with_player = [
            f"{p1['id']} starts the game"
        ]

    lines = lines_without_player if p1 is None else lines_with_player + lines_without_player
    return event_to_text(event, lines)


def goal_shot_lines(event):
    args = event["args"]
    player = args["player"]

    lines = [
        f"{player['id']} shoots!",
        "And he kicks"
    ]

    return event_to_text(event, lines)


def goal_lines(event):
    args = event["args"]
    team = args["team"]

    lines = [
        f"{team} SCORES!!",
        "Its a GOAL!!!"
    ]

    return event_to_text(event, lines)


def aggression_lines(event):
    args = event["args"]
    p1 = args["id1"]
    p2 = args["id2"]
    lines = [
        f"{p1} and {p2} fall down",
        f"{p1} and {p2} are going at it",
        "Oh no! They fell."
    ]

    return event_to_text(event, lines)


def defense_lines(event):
    args = event["args"]
    team = "Right" if args["player"]["team"] else "Left"

    lines = [
        f"Team {team} makes a defense.",
        f"The shot was defended by Team {team}"
    ]

    return event_to_text(event, lines)


def intersect_lines(event):
    args = event["args"]
    player = args["player"]
    lines = [
        f"{player['id']} stole the ball.",
        f"But {player['id']} intersected."
    ]

    return event_to_text(event, lines)


def event_to_text(event, lines=None):
    if lines is None:
        lines = []
    n = random.randint(0, len(lines) - 1)
    return f"({event['start']}, {event['end']}) " + lines[n]


lines = {
    "dribble": dribble_lines,
    "short_pass": pass_lines,
    "long_pass": pass_lines,
    "kick_off": kick_off_lines,
    "goal_shot": goal_shot_lines,
    "goal": goal_lines,
    "defense": defense_lines,
    "intersect": intersect_lines,
    "aggression": aggression_lines
}


def generate_script(events):
    return [
        lines.get(event["event"],
                  lambda x: f"({event['start']}, {event['end']}) \'{event['event']}\' Not implemented yet :)")(event)
        for event in events
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
