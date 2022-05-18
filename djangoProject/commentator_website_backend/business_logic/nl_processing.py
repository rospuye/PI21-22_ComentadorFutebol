import random

from numpy import double
from .log_processing import process_log

# Bias: bias
# -1: favors Left team, base 25% chance to trigger a biased line
# 0: no bias
# 1: favors Right team, base 25% chance to trigger a biased line

# Aggressive / Friendly: agr_frnd
# -50: 50% chance for aggressive line
# ...
# 0: 0% chance for emotional line
# ...
# 50: 50% chance for friendly line

# Neutral line probability never goes below 25%

class Comentary:
    def __init__(self, text, mood, diction, timestamp) -> None:
        self.text = text # commentary text
        self.mood = mood # commentary emotion (aggressive/neutral/friendly)
                         # affects robot color and expression
        self.diction = diction # commentary diction (calm/neutral/energetic)
                               # affects robot voice speed and pitch
                               # calm -> lower pitched, slower diction
                               # energetic -> higher pitched, faster diction
        self.timestamp = timestamp # time at which the commentary must be innitiated

def dice_roll(mod, bias : bool):
    """Returns the type of the next line based on the given modifier and bias."""
    
    bias_prob = 30 if bias else 0
    emotion_prob = abs(mod)

    roll = random.randint(0,100) # roll for line type
    if roll < emotion_prob:
        emotions = ["aggressive","friendly"]
        return emotions[mod > 0]
    elif roll < emotion_prob+bias_prob:
        return "biased"
    else:
        return "neutral"

def pass_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1 = player_name_map[p1]
    if p2 in player_name_map: p2 = player_name_map[p2]

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
        },
        "biased_supporting": {
            "pass_success": [
                
            ],
            "pass_fail": [
                
            ]
        },
        "biased_opposing": {
            "pass_success": [
                
            ],
            "pass_fail": [
                
            ]
        }
    }

    line_type = dice_roll(agr_frnd_mod, False)
    if line_type == "biased":
        line_type = line_type + ("_supporting" if supporting else "_opposing")
    if p1["team"] == p2["team"]:
        return event_to_text(event, lines[line_type]["pass_success"])
    else:
        return event_to_text(event, lines[line_type]["pass_fail"])

def dribble_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    p1 = args["player"]

    if p1 in player_name_map: p1 = player_name_map[p1]

    lines = [
        f"{p1['id']} is racing through the field",
        # f"{p1['id']} has the ball!",
        f"{p1['id']} is dribbling around!"
    ]

    return event_to_text(event, lines)


def kick_off_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    p1 = args.get("player")

    if p1 in player_name_map: p1 = player_name_map[p1]

    lines_without_player = [
        "and the games goes on"
    ]

    if p1 is not None:
        lines_with_player = [
            f"{p1['id']} starts the game"
        ]

    lines = lines_without_player if p1 is None else lines_with_player + lines_without_player
    return event_to_text(event, lines)


def goal_shot_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    p1= args["player"]

    if p1 in player_name_map: p1 = player_name_map[p1]

    lines = [
        f"{p1['id']} shoots!",
        "And he kicks"
    ]

    return event_to_text(event, lines)


def goal_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    team = args["team"]

    lines = [
        f"{team} SCORES!!",
        "Its a GOAL!!!"
    ]

    return event_to_text(event, lines)


def aggression_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    p1 = args["player_1"]
    p2 = args["player_2"]

    if p1 in player_name_map: p1 = player_name_map[p1]
    if p2 in player_name_map: p2 = player_name_map[p2]

    lines = [
        f"{p1['id']} and {p2['id']} fall down",
        f"{p1['id']} and {p2['id']} are going at it",
        "Oh no! They fell."
    ]

    return event_to_text(event, lines)


def defense_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    team = "Right" if args["player"]["team"] else "Left"

    lines = [
        f"Team {team} makes a defense.",
        f"The shot was defended by Team {team}"
    ]

    return event_to_text(event, lines)


def intersect_lines(event, agr_frnd_mod, bias, player_name_map):
    args = event["args"]
    p1 = args["player"]

    if p1 in player_name_map: p1 = player_name_map[p1]

    lines = [
        f"{p1['id']} stole the ball.",
        f"But {p1['id']} intersected."
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


def generate_script(events, stats, agr_frnd_mod, en_calm_mod, bias):
    player_name_map = generate_player_names() # ran at the start and fixed for the rest of the duration

    return [
        lines.get(event["event"],
                  lambda x: event_to_text(event, ["Not implemented yet :)"]))(event, agr_frnd_mod, bias, player_name_map)
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

def generate_player_names():
    ret = {}
    
    names = ["Dinis", "Isabel", "Afonso", "Miguel", "Lucius", "Joanne", "Louis", "Camila", \
        "Dianne", "Amber", "Carl", "Martha", "Bob", "Helen", "Joseph", "Josephine", "Gared", \
        "Ursula", "Bernard", "Kimberly", "Troy", "Ginny"]

    random.shuffle(names)
    for i in range(11):
        idLeft = "matNum"+i+"matLeft"
        idRight = "matNum"+i+"matRight"
        ret[idLeft] = names[i]
        ret[idRight] = names[i+11]

    return ret

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
