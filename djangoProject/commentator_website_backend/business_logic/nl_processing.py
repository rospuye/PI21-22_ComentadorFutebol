import random

from numpy import double
from .log_processing import process_log

# Energetic / Calm: en_calm
# -50: 50% chance for calm line, 50% for neutral line
# 0: 100% chance for neutral line
# 50: 50% chance for energetic line, 50% for neutral line
en_calm_mod = 0

# Aggressive / Friendly: agr_frnd
# -50: 50% chance for aggressive line, 50% for neutral line
# 0: 100% chance for neutral line
# 50: 50% chance for friendly line, 50% for neutral line
agr_frnd_mod = 0

def dice_roll(mod, type : bool):
    """
    Returns the type of the next line based on the given modifier.
    type: False for agr_frnd decision, True for en_calm 
    """

    if mod == 0: return "neutral"
    return_vals = [["aggressive","friendly"],["calm","energetic"]]
    if random.randint(0,100) < abs(mod): # if true, return a special line, otherwise, neutral
        return return_vals[type][mod > 0]
    else:
        return "neutral"


def pass_lines(event):
    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]

    lines = { 
        "neutral": {
            "pass_success": [
                f"{p1['id']} passes the ball to {p2['id']}",
                f"{p1['id']} sends it to {p2['id']}"
            ],
            "pass_fail": [
                f"{p2['id']} stole the ball",
                f"{p1['id']} lost the ball for his team"
            ]
        },
        "aggressive": {
            "pass_success": [
                f"{p1['id']} shot the ball stright into {p2['id']}'s direction",
                f"{p1['id']} threw it to {p2['id']}",
                f"terrific pass by {p1['id']}",
                f"what a strong pass, {p2['id']} was barely able to hold on to the ball",
                f"{p2['id']} almost lost his footing there getting the ball from his teammate",
                f"{p2['id']} has the ball now! keep going! keep going!"
            ],
            "pass_fail": [
                f"{p1['id']} stupidly lost the ball to {p2['id']}",
                f"that was a ridiculous attempt at passing on {p1['id']}'s part",
                f"{p1['id']} has to be drunk or something",
                f"{p1['id']} can't stay with the ball without losing it at the next moment",
                f"{p1['id']} unsurprisingly lost the ball. now the ball is with {p2['id']}",
                f"if {p1['id']} doesn't want to play, he shouldn't have come today",
                f"c'mon {p1['id']}, please at least try to keeping the ball with the team",
                f"{p1['id']} better work on getting the ball he just lost back!",
                f"terrible aiming on {p1['id']}'s part, they just lost the ball to the opposing team",
                f"{p1['id']} just lost his team's advantage by having the motor skills of a toddler"
            ]
        }, 
        "friendly": {
            "pass_success": [
                f"incredible pass by {p1['id']}",
                f"{p2['id']} catching the shot from his teammate with style"
            ],
            "pass_fail": [
                f"pass missed! they can still bounce back though",
                f"{p1['id']} failed their pass, I'm sure they'll get it next time"
            ]
        }
    }

    line_type = dice_roll(agr_frnd_mod, False)
    lines_typed = lines[line_type]

    if p1["team"] == p2["team"]:
        return event_to_text(event, lines_typed["pass_success"])
    else:
        return event_to_text(event, lines_typed["pass_fail"])

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
    p1 = args["player_1"]
    p2 = args["player_2"]
    lines = [
        f"{p1['id']} and {p2['id']} fall down",
        f"{p1['id']} and {p2['id']} are going at it",
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
    # return f"({event['start']}, {event['end']}) " + lines[n]
    return {
        "start": event['start'],
        "end": event['end'],
        "text": lines[n]
    }


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


def generate_script(events, stats):
    return [
        lines.get(event["event"],
                  lambda x: event_to_text(event, ["Not implemented yet :)"]))(event)
                  # lambda x: f"({event['start']}, {event['end']}) \'{event['event']}\' Not implemented yet :)")(event)
        for event in events
    ]

def get_stats(timestamp : double, stats : dict):
    timestamps = list(stats.keys())
    timestamps.sort()
    
    if timestamp < timestamps[0]:
        return None
    last = timestamps[0]
    for stamp in timestamps[1:]:
        if stamp <= timestamp:
            last = stamp
            continue
        else:
            return stats[last]
    return stats[timestamps[-1]]

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
