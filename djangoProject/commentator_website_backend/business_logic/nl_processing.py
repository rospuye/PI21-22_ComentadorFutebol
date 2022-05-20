import queue
import random

from numpy import double
from .log_processing import process_log

BIAS_PROB = 25

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
                         # values: aggressive/neutral/friendly (ternary)
        self.diction = diction # commentary diction (calm/neutral/energetic)
                               # affects robot voice speed and pitch
                               # calm -> lower pitched, slower diction
                               # energetic -> higher pitched, faster diction
                               # ranges from 9 to -9
        self.timestamp = timestamp # time at which the commentary must be innitiated

    def to_json(self):
        return {"text": self.text, "mood": self.mood, "diction": self.diction, "timestamp": self.timestamp}

class Bounded_Queue():
    def __init__(self, max) -> None:
        self.max = max
        self.queue = []       

    def add(self, el):
        if len(self.queue) >= self.max:
            self.pop()
        self.queue.append(el)

    def pop(self):
        if len(self.queue) > 0: 
            return self.queue.pop(0)
        else: return None

lines_repeated = Bounded_Queue(10)
        
def dice_roll(mod, bias : bool, supporting):
    """Returns the type of the next line based on the given modifier and bias."""
    
    bias_prob = BIAS_PROB if bias else 0
    emotion_prob = abs(mod)

    roll = random.randint(0,100) # roll for line type
    if roll < emotion_prob:
        emotions = ["aggressive","friendly"]
        return emotions[mod > 0]
    elif roll < emotion_prob+bias_prob:
        return "biased" + ("_supporting" if supporting else "_opposing")
    else:
        return "neutral"

def statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):
    timestamp = event["start"]
    statistic = get_stats(timestamp, stats)
    p1 = None
    if event.event in ["short_pass", "long_pass"]:
        p1 = event["args"]["from"]
    elif event.event in ["dribble", "kick_off", "defense", "intersect"]:
        p1 = event["args"]["player"]
    elif event.event in ["aggression"]: 
        p1 = event["args"]["player_1"] 

    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": {
            []
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])


STATS_TIMES = []

def pass_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):

    for t in STATS_TIMES:
        if event["start"] < t < event["end"]:
            return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]
    if p2 in player_name_map: p2['id'] = player_name_map[p2['id']]

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
                f"{p1['id']} shot the ball straight into {p2['id']}'s direction",
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

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    if p1["team"] == p2["team"]:
        return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type]["pass_success"])
    else:
        return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type]["pass_fail"])

def dribble_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):

    for t in STATS_TIMES:
        if event["start"] < t < event["end"]:
            return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args["player"]
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": {
            [f"{p1['id']} is racing through the field",
            # f"{p1['id']} has the ball!",
            f"{p1['id']} is dribbling around!"]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])

def kick_off_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):

    for t in STATS_TIMES:
        if event["start"] < t < event["end"]:
            return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args.get("player")
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]

    lines_without_player = {
        "neutral": {
            [
                "and the games goes on"
            ]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }
    

    if p1 is not None:
        lines_with_player = {
            "neutral": {
                [
                    f"{p1['id']} starts the game"
                ]
            },
            "aggressive": {
                []
            }, 
            "friendly": {
                [] 
            },
            "biased_supporting": {
                []
            },
            "biased_opposing": {
                []
            }
        }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    lines = lines_without_player if p1 is None else lines_with_player + lines_without_player
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])

def goal_shot_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):
    args = event["args"]
    p1 = args["player"]
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": {
            [
                f"{p1['id']} shoots!",
                "And he kicks"
            ]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])


def goal_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):
    args = event["args"]
    team = args["team"]
    supporting = True if team == (bias > 0) else False

    lines = { 
        "neutral": {
            [
                f"{team} SCORES!!",
                "Its a GOAL!!!"
            ]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])


def aggression_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):

    for t in STATS_TIMES:
        if event["start"] < t < event["end"]:
            return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args["player_1"]
    p2 = args["player_2"]
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]
    if p2 in player_name_map: p2['id'] = player_name_map[p2['id']]

    lines = { 
        "neutral": {
            [f"{p1['id']} and {p2['id']} fall down",
            f"{p1['id']} and {p2['id']} are going at it",
            "Oh no! They fell."]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])


def defense_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):

    for t in STATS_TIMES:
        if event["start"] < t < event["end"]:
            return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    team = "Right" if args["player"]["team"] else "Left"
    supporting = True if (team == "Right") == (bias > 0) else False

    lines = { 
        "neutral": {
            [
                f"Team {team} makes a defense.",
                f"The shot was defended by Team {team}"
            ]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            []
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])


def intersect_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map):
    for t in STATS_TIMES:
        if event["start"] < t < event["end"]:
            return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args["player"]
    supporting = True if p1["team"] == (bias > 0) else False

    if p1 in player_name_map: p1['id'] = player_name_map[p1['id']]
    

    lines = { 
        "neutral": {
            [
                f"{p1['id']} stole the ball.",
                f"But {p1['id']} intersected."
            ]
        },
        "aggressive": {
            []
        }, 
        "friendly": {
            [] 
        },
        "biased_supporting": {
            [
                f"Amazing steal by {p1['id']}"
                f"Terrific"
            ]
        },
        "biased_opposing": {
            []
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, lines[line_type])

def event_to_text(event, type, stats, en_calm_mod, bias, lines=None):
    if lines is None:
        lines = []
    for line in lines:
        if remove_players(line) in lines_repeated.queue:
            lines.remove(line)
            
    n = random.randint(0, len(lines) - 1)
    if bias != 0:
        winning, mod = whos_winning(stats)
        if winning:
            if winning == "Left":
                if bias > 0: # Supporting Right team
                    en_calm_mod += 2*mod # gets more nervous
                else:
                    en_calm_mod -= 2*mod # is calmer
            else:
                if bias > 0:
                    en_calm_mod -= 2*mod
                else:
                    en_calm_mod += 2*mod
    commentary = Comentary(lines[n], type, en_calm_mod, event["start"])
    lines_repeated.add(lines[n])
    # return f"({event['start']}, {event['end']}) " + lines[n]
    return {
        "start": event['start'],
        "end": event['end'],
        "text": lines[n]
    }

def remove_players(line):
    names = ["Dinis", "Isabel", "Afonso", "Miguel", "Lucius", "Joanne", "Louis", "Camila", \
        "Dianne", "Amber", "Carl", "Martha", "Bob", "Helen", "Joseph", "Josephine", "Gared", \
        "Ursula", "Bernard"]
        
    l = ""
    for name in names:
        l = line.replace(name, "")

    return l

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

    commentary = [
        lines.get(event["event"],
                  lambda x: event_to_text(event, ["Not implemented yet :)"]))(event, get_stats(event["start"], stats), agr_frnd_mod, en_calm_mod, bias, player_name_map)
                  # lambda x: f"({event['start']}, {event['end']}) \'{event['event']}\' Not implemented yet :)")(event)
        for event in events
    ]

    return commentary



def whos_winning(stats):
    """Returns the team that's winning, plus how bad they are winning"""
    # 2 - team is winning by goals
    # 1 - team is winning by shots, defenses and ball posession
    if stats["teams"]["A"]["goals"] > stats["teams"]["B"]["goals"]:
        return "Left", 2
    elif stats["teams"]["A"]["goals"] < stats["teams"]["B"]["goals"]:
        return "Right", 2
    
    A_score = stats["teams"]["A"]["shots"]+stats["teams"]["A"]["defenses"]
    B_score = stats["teams"]["B"]["shots"]+stats["teams"]["B"]["defenses"]
    if stats["teams"]["A"]["ball_pos"] > stats["teams"]["B"]["ball_pos"]:
        A_score += 2
    elif stats["teams"]["A"]["ball_pos"] < stats["teams"]["B"]["ball_pos"]:
        B_score += 2

    diff = abs(A_score-B_score)
    if diff == 0: return None, 0
    elif A_score > B_score: return "Left", 1
    else: return "Right", 1
    
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
