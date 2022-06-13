import random

from .log_processing import process_log

BIAS_PROB = 30

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
    def __init__(self, text, mood, diction, timestamp, priority) -> None:
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
        self.priority = priority


    def to_json(self):
        return {"text": self.text, "mood": self.mood, "diction": self.diction, "timestamp": self.timestamp,
                "priority": self.priority}

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

lines_repeated = Bounded_Queue(20)

def dice_roll(mod, bias : bool, supporting : bool):
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

def statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority=5):

    timestamp = event["start"]
    statistic = get_stats(timestamp, stats)

    if not statistic:
        return event_to_text(event, "neutral", stats, en_calm_mod, bias, teams, ["Very close game."], priority)

    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])
    p1 = None
    if event["event"] in ["short_pass", "long_pass"]:
        p1 = event["args"]["from"]
    elif event["event"] in ["dribble", "kick_off", "defense", "intersect", "out_shot", "corner_shot", "goalkeeper_out_shot"]:
        p1 = event["args"]["player"]
    elif event["event"] in ["aggression"]:
        p1 = random.choice([event["args"]["player_1"],event["args"]["player_2"]])

    decide = ["team"]
    if p1: decide.append("player")
    decision = random.choice(decide)

    lines = []
    supporting = True
    if decision == "player":
        # Lines about a specific player
        supporting = True if p1["team"] == (bias > 0) else False
        prev_id = p1["id"]
        if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]
        avg_possession = sum(statistic["players"][player]["ball_pos"] for player in statistic["players"])/len(statistic["players"])
        performing_well_goals = True if statistic["players"][prev_id]["goals"] > 0 else False
        performing_well_poss = True if statistic["players"][prev_id]["ball_pos"] > avg_possession else False
        goal_num = statistic["players"][prev_id]["goals"]

        lines_goals = { 
            "neutral": 
                {
                    "performing_well": # goals?
                        [
                            f"{p1['id']} has scored {goal_num} goals this match",
                            f"{p1['id']} is one of the few players who has scored a goal",
                            f"{p1['id']} is one of this matche's goal scorers"
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{p1['id']} hasnt scored yet this match",
                            f"{p1['id']} has scored 0 goals so far",
                            f"{p1['id']} has had no goals so far"

                        ]
                }
            ,
            "aggressive": 
                {
                    "performing_well": # goals?
                        [
                            f"{p1['id']} has scored a goal this match, like a machine gun!",
                            f"{goal_num} goals so far for {p1['id']} this match, at least they brought us some action!",
                            f"{p1['id']} has scored a goal so far, hopefully it won't be too long until the next one..."
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"no goals from {p1['id']} so far, come on, we're waiting for some action!",
                            f"nothing to be said about {p1['id']}'s scoring capabilities, they haven't done anything yet!",
                            f"Sigh... {p1['id']} has had no goals so far.",
                        ]
                }
            , 
            "friendly": 
                {
                    "performing_well": # goals?
                        [
                            f"we've already seen some wonderful goal scoring technique by {p1['id']} this match",
                            f"{p1['id']} is one of the few who've scored! Keep up the great job!",
                            f"Incredible, {p1['id']} has already scored {goal_num} goals this match!",
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{p1['id']} hasn't scored yet, but will they be this match's next goal scorer? Stay tuned!",
                            f"{p1['id']} has had no goals so far, but that doesn't mean they might not get one soon!",
                            f"I believe in you {p1['id']}! You'll score your first goal really really soon!"
                        ]
                } 
            ,
            "biased_supporting": 
                {
                    "performing_well": # goals?
                        [
                            f"{p1['id']} has scored a goal for their incredible team {team_supporting}",
                            f"Incredible player {p1['id']} has scored {goal_num} fantastic goals this match",
                            f"{p1['id']} has scored a goal this match, bringing their team {team_supporting} some deserved advantage."
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{p1['id']} hasn't scored yet, but with the support of the great {team_supporting} team I'm sure they will soon",
                            f"{p1['id']} has had no goals yet, but soon they will bring {team_supporting} their rightful advantage",
                            f"{p1['id']} hasn't had a goal yet but this great player surely won't let that discourage them",
                        ]
                }
            ,
            "biased_opposing": 
                {
                    "performing_well": # goals?
                        [
                            f"{p1['id']} has scored some goals... so what",
                            f"{p1['id']} has scored {goal_num} goals this match... must've been luck",
                            f"{p1['id']} has scored for their lucky lucky team",
                            f"{p1['id']} has {goal_num} goals... please don't be in a hurry to score any more",
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{p1['id']} from {team_opposing} has scored no goals yet, unsurprisingly",
                            f"{p1['id']} has had 0 goals so far, but please, have no hurry in scoring dear!",
                            f"{p1['id']} isn't being a big asset to {team_opposing}, with their 0 goals so far...",
                        ]
                }
        }

        lines_posession = { 
            "neutral": 
                {
                    "performing_well": # poss > avg -> doing well
                        [
                            f"{p1['id']} has had control of the ball most of the match",
                            f"{p1['id']} is one of the players who has performed better at keeping the ball within the team",
                            f"{p1['id']} has been consistent at keeping the ball at their feet"
                        ]
                    ,
                    "performing_poorly": 
                        [
                            f"{p1['id']} has had a lower than average performance at controlling the ball",
                            f"{p1['id']} hasn't had huge success in keeping the ball",
                            f"we haven't seen much of {p1['id']} this match"
                        ]
                }
            ,
            "aggressive": 
                {
                    "performing_well": 
                        [
                            f"{p1['id']} has been good at keeping the ball from everyone else, truly individualistic",
                            f"no one has been able to take the ball from {p1['id']}'s feet, what a warrior",
                            f"if there's something we've learned from {p1['id']} this match, is that they will keep the ball tot ehmselves no matter what",
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{p1['id']} has hardly touched the ball this match, keep up!",
                            f"we've seen nothing special from {p1['id']} so far, they've hardly touched the ball",
                            f"{p1['id']} really needs to do something soon, they've hardly been seen with the ball this match",
                        ]
                }
            , 
            "friendly": 
                {
                    "performing_well":
                        [
                            f"{p1['id']} has been great at keeping the ball this match, keep it up!",
                            f"{p1['id']} is truly a player to behold, they are one of the player with the most ball control this match",
                            f"we've been seeing a great performance by {p1['id']} who has had astonishingly good ball possession"
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{p1['id']} hasn't been the player with most ball control so far, but that doesn't mean they can't turn that around!",
                            f"{p1['id']} hasn't been seen with the ball much, but I'm sure they won't give up!",
                            f"we haven't seen much from {p1['id']} so far this match, can't see what they have in store for the rest of the game",
                        ]
                } 
            ,
            "biased_supporting": 
                {
                    "performing_well":
                        [
                            f"{p1['id']} is a formidable player from a formidable team who has kept the ball at their feet most of the match",
                            f"{p1['id']} is truly shinning for their team, the ball won't leave their feet",
                            f"we've been seeing a great performance by {p1['id']} who has had astonishingly good ball possession"
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{p1['id']} hasn't been seen with the ball much but I'm sure they'll make their great team proud",
                            f"we haven't seen much of {p1['id']} this match but you always know they have something up their sleeve!",
                            f"{p1['id']} is known for turning a match around, so even if they haven't been in the game much, be ready to be surprised"
                        ]
                }
            ,
            "biased_opposing": 
                {
                    "performing_well":
                        [
                            f"{p1['id']} has been holding the ball a lot this game, hardly sharing with their teammates. Pathetic.",
                            f"Sure, {p1['id']} has had the ball a good portion of the game, that doesn't mean it's not just luck.",
                            f"{team_opposing} sure has been struck by luck today with how much {p1['id']} has had the ball",
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"unsurprisingly, {p1['id']} from team {team_opposing} has hardly been able to get hold of the ball this match",
                            f"{p1['id']} has been really struggling to keep the ball at their feet, maybe just let the grown ups play.",
                            f"we've seen almost nothing from {p1['id']} this match, as expected.",
                        ]
                }
        }

        line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
        lines = []
        if performing_well_goals: lines = lines + lines_goals[line_type]["performing_well"]
        else: lines = lines + lines_goals[line_type]["performing_poorly"]
        if performing_well_poss: lines = lines + lines_posession[line_type]["performing_well"]
        else: lines = lines + lines_posession[line_type]["performing_poorly"]
    else:
        # Lines about the game or a team
        team = random.choice(["Left","Right"])
        team_key, other_team_key = ("A", "B") if team == "Right" else ("B", "A")
        supporting = True if (team == "Right") == (bias > 0) else False
        team, other_team = (teams[0], teams[1]) if team == "Right" else (teams[1], teams[0])
        performing_well_goals = True if statistic["teams"][team_key]["goals"] > statistic["teams"][other_team_key]["goals"] else False
        tied = True if statistic["teams"][team_key]["goals"] == statistic["teams"][other_team_key]["goals"] else False
        tied_possession = True if abs(statistic["teams"][team_key]["ball_pos"] - statistic["teams"][other_team_key]["ball_pos"]) > 15 else False
        performing_well_poss = True if statistic["teams"][team_key]["ball_pos"] > statistic["teams"][other_team_key]["ball_pos"] else False

        goal_diff = abs(statistic["teams"][team_key]["goals"] - statistic["teams"][other_team_key]["goals"])

        lines_goals = { 
            "neutral": 
                {
                    "performing_well": # goals?
                        [
                            f"{team} is winning over {other_team} by a difference of {goal_diff} goals",
                            f"we move on with the game with {team} still winning",
                            f"{other_team} is still at a disadvantage by {goal_diff} goals"
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{other_team} is winning over {team} by a difference of {goal_diff} goals",
                            f"we move on with the game with {other_team} still winning",
                            f"{team} is still at a disadvantage by {goal_diff} goals"
                        ]
                }
            ,
            "aggressive": 
                {
                    "performing_well": # goals?
                        [
                            f"{team} is crushing {other_team} by {goal_diff} goals",
                            f"{other_team} is suffocating with {team}'s goal advantage",
                            f"{team} has overwhelmed {other_team} with their goal advantage"
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{other_team} is crushing {team} by {goal_diff} goals",
                            f"{team} is suffocating with {other_team}'s goal advantage",
                            f"{other_team} has overwhelmed {team} with their goal advantage" 
                        ]
                }
            , 
            "friendly": 
                {
                    "performing_well": # goals?
                        [
                            f"{team} has a goal advantage of {goal_diff}, let's see if {other_team} bounces back",
                            f"we've got an excitingly close game at our hands, with {team} currently having an advantage",
                            f"{team} is winning! Let's see how {other_team} responds"
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{other_team} has a goal advantage of {goal_diff}, let's see if {team} bounces back",
                            f"we've got an excitingly close game at our hands, with {other_team} currently having an advantage",
                            f"{other_team} is winning! Let's see how {team} responds"
                        ]
                } 
            ,
            "biased_supporting": 
                {
                    "performing_well": # goals?
                        [
                            f"{team_supporting} is dominating {team_opposing} as demonstrated by their goal advantage",
                            f"as expected {team_supporting} is winning",
                            f"{team_opposing} never stood a chance. {team_supporting} is winning"
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"this is unbelievable, somehow {team_opposing} has the goal advantage",
                            f"{team_opposing} has been struck by luck today with their goal advantage",
                            f"Come on, {team_supporting}, bounce back!"
                        ]
                }
            ,
            "biased_opposing": 
                {
                    "performing_well": # goals?
                        [
                            f"this is unbelievable, somehow {team_opposing} has the goal advantage",
                            f"{team_opposing} has been struck by luck today with their goal advantage",
                            f"Come on, {team_supporting}, bounce back!"
                        ]
                    ,
                    "performing_poorly": # no goals?
                        [
                            f"{team_supporting} is dominating {team_opposing} as demonstrated by their goal advantage",
                            f"as expected {team_supporting} is winning",
                            f"{team_opposing} never stood a chance. {team_supporting} is winning"
                        ]
                }
        }

        lines_posession = { 
            "neutral": 
                {
                    "performing_well": # poss > enemy -> doing well
                        [
                            f"We've seen {team} having a much more prevalent stand in this game",
                            f"{team} has had greater ball possession overall",
                            f"{team} has been able to keep the ball within the team better than {other_team}"
                        ]
                    ,
                    "performing_poorly": 
                        [
                            f"We've seen {other_team} having a much more prevalent stand in this game",
                            f"{other_team} has had greater ball possession overall",
                            f"{other_team} has been able to keep the ball within the team better than {team}"
                        ]
                }
            ,
            "aggressive": 
                {
                    "performing_well": 
                        [
                            f"{team} has had the ball most of the game. Do something {other_team}! this is boring",
                            f"{other_team} is hardly giving the game a struggle, {team} almost always had the ball",
                            f"{team} is completely dominating {other_team} in terms of ball possession"
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{other_team} has had the ball most of the game. Do something {team}! this is boring",
                            f"{team} is hardly giving the game a struggle, {other_team} almost always had the ball",
                            f"{other_team} is completely dominating {team} in terms of ball possession"
                        ]
                }
            , 
            "friendly": 
                {
                    "performing_well":
                        [
                            f"{team} has kept the ball within the team very gracefully",
                            f"{team} has had formidable plays to keep the ball in their posession this long, let's see how {other_team} will respond to this",
                            f"{other_team} has had less luck in keeping the ball, surely they are hard at work on countering this"
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{other_team} has kept the ball within the team very gracefully",
                            f"{other_team} has had formidable plays to keep the ball in their posession this long, let's see how {team} will respond to this",
                            f"{team} has had less luck in keeping the ball, surely they are hard at work on countering this"
                        ]
                } 
            ,
            "biased_supporting": 
                {
                    "performing_well":
                        [
                            f"{team_supporting} has been dominating the weaker {team_opposing}, as expected",
                            f"{team_opposing} has barely been able to keep up to {team_supporting}'s high level playing",
                            f"{team_supporting} keeps the ball within their team easily considering the little fight {team_opposing} puts up"
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{team_supporting} has had a few unlucky hiccups that have them at a disadvantage, they'll surely go back to dominating the field soon",
                            f"{team_opposing} has been extremely lucky at keeping the ball within the team...",
                            f"{team_supporting} must be preparing something to get back their field advantage"
                        ]
                }
            ,
            "biased_opposing": 
                {
                    "performing_well":
                        [
                            f"{team_supporting} has had a few unlucky hiccups that have them at a disadvantage, they'll surely go back to dominating the field soon",
                            f"{team_opposing} has been extremely lucky at keeping the ball within the team...",
                            f"{team_supporting} must be preparing something to get back their field advantage"
                        ]
                    ,
                    "performing_poorly":
                        [
                            f"{team_supporting} has been dominating the weaker {team_opposing}, as expected",
                            f"{team_opposing} has barely been able to keep up to {team_supporting}'s high level playing",
                            f"{team_supporting} keeps the ball within their team easily considering the little fight {team_opposing} puts up"
                        ]
                }
        }

        line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
        lines = []
        if not tied:
            if performing_well_goals: lines = lines + lines_goals[line_type]["performing_well"]
            else: lines = lines + lines_goals[line_type]["performing_poorly"]
        if not tied_possession:
            if performing_well_poss: lines = lines + lines_posession[line_type]["performing_well"]
            else: lines = lines + lines_posession[line_type]["performing_poorly"]
        if not lines:
            lines.append("Very close game.")

    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines, priority)


STATS_TIMES = []

def pass_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    # for t in STATS_TIMES:
    #     if event["start"] < t < event["end"]:
    #         return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args["from"]
    p2 = args["to"]
    success = p1["team"] == p2["team"]
    if success:
        statistic_prob = 40
    else:
        statistic_prob = 0
    
    roll = random.randint(0,100)
    if statistic_prob > roll:
        return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)

    team, other_team = (teams[0], teams[1]) if p1["team"] else (teams[1], teams[0])
    supporting = True if p1["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    if p1['id'] in player_name_map: p1['id'] = player_name_map[p1['id']]
    if p2['id'] in player_name_map: p2['id'] = player_name_map[p2['id']]

    lines = {
        "neutral": {
            "pass_success": [
                f"{p1['id']} passes the ball to {p2['id']}",
                f"{p1['id']} sends it to {p2['id']}",
                f"Successful pass from the {team} team",
                f"{team} team maintains the ball in their posession",
                f"{team} advances with the ball"
            ],
            "pass_fail": [
                f"{p2['id']} stole the ball",
                f"{p1['id']} lost the ball for his team",
                f"{team} loses the ball",
                f"{other_team} gets the ball",
                f"Unsuccessful pass by {p1['id']}"
            ]
        },
        "aggressive": {
            "pass_success": [
                f"{p1['id']} shot the ball straight into {p2['id']}'s direction",
                f"{p1['id']} threw it to {p2['id']}",
                f"terrific pass by {p1['id']}",
                f"what a strong pass, {p2['id']} was barely able to hold on to the ball",
                f"{p2['id']} almost lost his footing there getting the ball from his teammate",
                f"{p2['id']} has the ball now! keep going! keep going!",
                f"{p1['id']} getting the ball across the field like a bullet",
                f"ball passed with fury by {p1['id']}",
                f"{team} advancing at light's speed toward their enemy goal",
                f"{other_team} better watch out, their enemies are advancing like truckloaders",
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
                f"{p2['id']} catching the shot from his teammate with style",
                f"the ball was wonderfully passed by {p1['id']}",
                f"{team} is getting the ball across the field! good job",
                f"{other_team} is losing terrain, though im sure they'll give it some fight!",
            ],
            "pass_fail": [
                f"pass missed! they can still bounce back though",
                f"{p1['id']} failed their pass, I'm sure they'll get it next time"
                f"{other_team} now has the ball, congratulations!",
                f"dont feel bad {p1['id']}! youll get the pass next try",
                f"{p2['id']} now ahs the ball, make good use of it!",
                f"i know {team} wont let this failed pass bring them down",
            ]
        },
        "biased_supporting": {
            "pass_success": [
                f"{team} getting the ball across the field! You guys show 'em!",
                f"wonderful pass between {p1['id']} and {p2['id']}, setting an example to {other_team}",
                f"see that, {other_team}? that's how you advance the ball",
                f"a wonderful pass by the wonderful {team} team",
                f"{p2['id']} catches his teammates's pass effortlessly, great job",
            ],
            "pass_fail": [
                f"Oh no, {team} loses the ball",
                f"{other_team} gets the ball, must be pure dumb luck",
                f"{p2['id']} accidentally stumbles into {team}'s pass there, im sure they wont keep it for long",
                f"{p1['id']} lost the ball, unlucky and undeserved",
                f"{other_team} now has the ball, wonder how long that will last"

            ]
        },
        "biased_opposing": {
            "pass_success": [
                f"{team_opposing} advances with the ball, how lucky",
                f"{p1['id']} gets a lucky pass to their teammate",
                f"Oh no, {team_supporting} is losing ground",
                f"{team_supporting} needs to stop {p1['id']}'s advances",
                f"{team_opposing} is getting closer to the goal, fight back guys!"
            ],
            "pass_fail": [
                f"game is back on track, {team_supporting} has the ball now",
                f"ahah, {team_opposing} loses the ball",
                f"{p1['id']} lost the ball to the amazing {p2['id']}",
                f"better luck next time {p1['id']}, now let the real game begin",
                f"{team_supporting} effortlessly gets the ball back to their side"
            ]
        }
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    if p1["team"] == p2["team"]:
        return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type]["pass_success"], priority)
    else:
        return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type]["pass_fail"], priority)

def dribble_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    # for t in STATS_TIMES:
    #     if event["start"] < t < event["end"]:
    #         return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    statistic_prob = 50
    roll = random.randint(0,100)
    if statistic_prob > roll:
        return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)

    args = event["args"]
    p1 = args["player"]
    supporting = True if p1["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    if p1['id'] in player_name_map: p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": 
            [
                f"{p1['id']} is racing through the field.",
                f"{p1['id']} has the ball!",
                f"{p1['id']} is dribbling around!",
                f"Another dribbling moment by {p1['id']}!",
                f"{p1['id']} dribbles away."
            ]
        ,
        "aggressive": 
            [
                f"Can't believe {p1['id']} is just dribbling...",
                f"{p1['id']} needs to dribble faster.",
                f"{p1['id']} dribbling by again...",
                f"All {p1['id']} knows is dribbling.",
                f"{p1['id']} is dribbling, I guess."
            ]
        , 
        "friendly": 
            [
                f"A lovely dribble by {p1['id']}.",
                f"{p1['id']}, there it goes!",
                f"{p1['id']} dribbles beautifully!",
                f"Incredible dribble by {p1['id']}.",
                f"{p1['id']} is dribbling and what a dribble!"
            ] 
        ,
        "biased_supporting": 
            [
                f"Amazing, {p1['id']} is racing through the field",
                f"Wow, {p1['id']} is dribbling around!",
                f"{p1['id']} does an amazing dribble.",
                f"No one compares to {p1['id']} dribbling!",
                f"Wonderful dribble by {p1['id']}."
            ]
        ,
        "biased_opposing": 
            [
               f"Oh no, {p1['id']} is racing through the field",
               f"Oh no, {p1['id']} is dribbling around!",
               f"{p1['id']} is dribbling, I guess...",
               f"{p1['id']} dribbles, nothing special.",
               f"Seems like a poor dribble by {p1['id']}."
            ]
        
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)

def kick_off_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    # for t in STATS_TIMES:
    #     if event["start"] < t < event["end"]:
    #         return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    # statistic_prob = 50
    # roll = random.randint(0,100)
    # if statistic_prob > roll:
    #     return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args.get("player")
    supporting = True
    if p1:
        supporting = True if p1["team"] == (bias > 0) else False
    else:
        bias = 0
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    if p1['id'] in player_name_map.keys(): 
        p1['id'] = player_name_map[p1['id']]

    lines_without_player = {
        "neutral": 
            [
                "And the game goes on.",
                "The game starts off.",
                "And here we go.",
                "On to the game.",
                "Game time."
            ]
        ,
        "aggressive": 
            [
                "Come on, let's go!",
                "No time to waste, come on.",
                "Better get going!",
                "Finally, let's move!",
                "Game time, everyone shut up."
            ]
        , 
        "friendly": 
            [
                "Sit tight, everyone.",
                "Let's enjoy the game together!",
                "Lovely game, let's go!",
                "Get ready for a good game.",
                "Fun time!"
            ] 
        ,
        "biased_supporting": 
            [
                "A great team here, let's go!",
                "We have a chance to win, let's start!",
                "So much potential, let's go!",
                "Winning time!",
                "How exciting!"
            ]
        ,
        "biased_opposing": 
            [
                "Let's get this over with.",
                "Wasting my time, move.",
                "Taking too long, come on!",
                "Come on...",
                "Let's hurry!"
            ]
    }

    if p1 is not None:
        lines_with_player = {
            "neutral": 
                [
                    f"{p1['id']} starts the game.",
                    f"{p1['id']} kicks off!",
                    f"A kick off by {p1['id']}.",
                    f"{p1['id']} up for the kick off.",
                    f"And there goes {p1['id']}."
                ]
            ,
            "aggressive": 
                [
                    f"{p1['id']} finally starts!",
                    f"About time {p1['id']} kicked off...",
                    f"{p1['id']} starts, let's go!",
                    f"{p1['id']}, about time!",
                    f"{p1['id']} come on!"
                ]
            , 
            "friendly": 
                [
                    f"Great kick off, {p1['id']}!",
                    f"{p1['id']} starting nicely.",
                    f"{p1['id']} with a good kick.",
                    f"Nice kick off, {p1['id']}.",
                    f"{p1['id']} rocks kick offs!"
                ] 
            ,
            "biased_supporting": 
                [
                    f"Amazing kick by {p1['id']}!",
                    f"{p1['id']} doing his team justice.",
                    f"What a kick, {p1['id']}!",
                    f"Great job, {p1['id']}!",
                    f"{p1['id']} kicks are amazing!"
                ]
            ,
            "biased_opposing": 
                [
                    f"{p1['id']} is kicking, I guess.",
                    f"Kick by {p1['id']} won't go very far.",
                    f"An alright kick by {p1['id']}.",
                    f"Let's get moving, {p1['id']}.",
                    f"{p1['id']} needs training."
                ]
        }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)

    lines = lines_without_player if p1 is None else {**lines_with_player, **lines_without_player}

    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)

def goal_shot_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):
    args = event["args"]
    p1 = args["player"]
    supporting = True if p1["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": 
            [
                f"{p1['id']} shoots!",
                "And they kick.",
                f"{p1['id']} tries for a goal!",
                "A shot to the goal!",
                "Here we go!"
            ]
        ,
        "aggressive": 
            [
                f"Ah! {p1['id']} finally shoots!",
                f"Come on, a shot by {p1['id']}.",
                "Is this finally going to be a good shot?",
                f"{p1['id']} showing some nerve!",
                f"At least {p1['id']} shoots!"
            ]
        , 
        "friendly": 
            [
                f"Great kick by {p1['id']}!",
                f"What a kick by {p1['id']}!",
                f"Awesome attempt by {p1['id']}!",
                f"{p1['id']} sparks up the game!",
                f"{p1['id']} tries bravely!"
            ] 
        ,
        "biased_supporting": 
            [
                f"Great kick by {p1['id']}!",
                f"Great kick by {p1['id']}!",
                f"Great kick by {p1['id']}!",
                f"Great kick by {p1['id']}!",
                f"Great kick by {p1['id']}!"
            ]
        ,
        "biased_opposing": 
            [
                f"{p1['id']} just had to shoot!",
                f"Ugh, {p1['id']} shot like that!",
                "Hope it doesn't go in.",
                "Good shot... not.",
                f"{p1['id']} shoots, gonna need luck."
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)


def goal_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):
    args = event["args"]
    team = teams[1] if args["team"] == "Left" else teams[0]
    supporting = True if team == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    lines = { 
        "neutral": 
            [
                f"{team} scores!",
                f"A goal by {team}!",
                f"{team} strikes!",
                "Goal!",
                f"{team} coming through!"
            ]
        ,
        "aggressive": 
            [
                "Now a goal!",
                "At last! Goal!",
                f"Good job, {team}, but moving on!",
                f"Goal by {team}, about time!"
                "Finally someone with some sense."
            ]
        , 
        "friendly": 
            [
                "Wow, what a nice goal!",
                f"Extraordinary job by {team}!",
                f"{team} doing great!",
                f"Amazing goal, {team}!",
                "Yes! Amazing!"
            ] 
        ,
        "biased_supporting": 
            [
                "Goal goal goal goal!",
                f"Yay, {team} scores!",
                f"Let's go, {team}!",
                "Best team ever!",
                f"{team} with a clear advantage!"
            ]
        ,
        "biased_opposing": 
            [
                f"Oh no, {team} scores...",
                "Ah, the worst scenario!",
                "Oh no...",
                f"Very poor goal by {team}.",
                f"Well done {team}, I guess..."
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)


def aggression_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    # for t in STATS_TIMES:
    #     if event["start"] < t < event["end"]:
    #         return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    statistic_prob = 30
    roll = random.randint(0,100)
    if statistic_prob > roll:
        return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)

    args = event["args"]
    p1 = args["player_1"]
    p2 = args["player_2"]
    supporting = True if p1["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]
    if p2['id'] in player_name_map.keys(): p2['id'] = player_name_map[p2['id']]

    lines = { 
        "neutral": 
            [
                f"{p1['id']} and {p2['id']} fall down.",
                f"{p1['id']} and {p2['id']} are going at it!",
                "Oh no! They fell.",
                "There's an aggression happening.",
                "Not so much a friendly game!"
            ]
        ,
        "aggressive": 
            [
                "Serves them right.",
                "That's what you get for being rowdy.",
                f"{p1['id']} and {p2['id']} need to get up.",
                "Get up, come on!",
                f"We don't have time for this, {p1['id']} and {p2['id']}."
            ]
        , 
        "friendly": 
            [
                "Hope they didn't hurt themselves!",
                "Oh dear, that's quite concerning!",
                f"Hope {p1['id']} and {p2['id']} are okay!",
                f"{p1['id']} and {p2['id']}, this isn't you!",
                "They'll be up again in no time."
            ] 
        ,
        "biased_supporting": 
            [
                "Yay, bring them down!",
                "Trip them!",
                "Ahah!",
                "Get them!",
                "That's how it's done."
            ]
        ,
        "biased_opposing": 
            [
                "I can't believe this disrespect!",
                "This is unacceptable.",
                "Never in all my years in sport have I seen this!",
                "Quite unsportsmanlike.",
                "What a foul."
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)


def defense_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    # for t in STATS_TIMES:
    #     if event["start"] < t < event["end"]:
    #         return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    team = teams[1] if args["player"]["team"] else teams[0]
    supporting = True if args["player"]["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])


    lines = { 
        "neutral": 
            [
                f"Team {team} makes a defense.",
                f"The shot was defended by team {team}.",
                f"Team {team} defends.",
                f"Defence by team {team}.",
                f"Team {team} on the defensive."
            ]
        ,
        "aggressive": 
            [
                f"What a defense by team {team}!",
                "Let's go, defence!",
                "Come on, what a defence!",
                "Go go, defence!",
                "Defending skills on fire!"
            ]
        , 
        "friendly": 
            [
                "Great defence!",
                "Such lovely defence work.",
                f"Team {team} defends beautifully.",
                f"Team {team} does not lose spirit.",
                "I love to see a good defence."
            ] 
        ,
        "biased_supporting": 
            [
                f"A beautiful defense by team {team}!",
                "That's how you defend!",
                "Clearly one team has it together.",
                f"Team {team} controls the game.",
                f"{team} shows superb defensive skills."
            ]
        ,
        "biased_opposing": 
            [
                f"Argh! Team {team} defends the goal!",
                "Unfortunately, there was a defence.",
                "Okay, I guess...",
                f"Team {team} did alright, for now.",
                "Yes yes, a defence..."
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)


def intersect_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    # for t in STATS_TIMES:
    #     if event["start"] < t < event["end"]:
    #         return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map)

    args = event["args"]
    p1 = args["player"]
    supporting = True if p1["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])


    if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]
    

    lines = { 
        "neutral": 
            [
                f"{p1['id']} stole the ball.",
                f"But {p1['id']} intersected.",
                "Intersection here.",
                "Ball steal!",
                "Intercept!"
            ]
        ,
        "aggressive": 
            [
                "What a steal!",
                f"{p1['id']} had to steal.",
                f"Sneaky steal, {p1['id']}.",
                f"{p1['id']} intercepts, go go go!",
                f"{p1['id']} has it, come on!"
            ]
        , 
        "friendly": 
            [
                f"Nice intersect {p1['id']}.",
                f"Very nicely done by {p1['id']}.",
                f"{p1['id']}, a promising player with the steal.",
                f"Great intercept!",
                f"Nice! Good interception here."
            ] 
        ,
        "biased_supporting": 
            [
                f"Amazing steal by {p1['id']}.",
                f"The best interceptions with {p1['id']}.",
                "No one intercepts like this team",
                "The others didn't stand a chance, intercept.",
                f"Great job by {p1['id']} on this one."
            ]
        ,
        "biased_opposing": 
            [
                f"Wow, {p1['id']} dares to steal the ball.",
                f"{p1['id']} getting away with a foul...",
                "This is scandalous!",
                f"Nah, {p1['id']}, that can't have been fair.",
                "Come on, who trains these guys..."
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)

def corner_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    statistic_prob = 50
    roll = random.randint(0,100)
    if statistic_prob > roll:
        return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)

    args = event["args"]
    team = teams[1] if args["player"]["team"] else teams[0]
    supporting = True if args["player"]["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    p1 = args["player"]
    if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": 
            [
                "That's a corner.",
                "Corner right there.",
                f"And we have a corner by {p1['id']}.",
                f"{p1['id']} did a corner now.",
                f"A corner from {p1['id']}."
            ]
        ,
        "aggressive": 
            [
                "Woah, corner!",
                f"Woah, {p1['id']} did a corner!",
                f"Ah! Corner by {p1['id']}!",
                "Corner corner corner!",
                "Attention! Corner!"
            ]
        , 
        "friendly": 
            [
                f"{p1['id']} did a corner there, no problem!",
                "Great, a corner!",
                "Corner! How exciting!",
                f"Corner from {p1['id']}, that's okay!",
                f"{p1['id']} with a lovely corner!"
            ] 
        ,
        "biased_supporting": 
            [
                "A corner, no problem!",
                f"{p1['id']} with a corner, great player!",
                "Corner. All great teams have setbacks!",
                f"Corner by {p1['id']}, they'll recover!",
                "Corner happens! No biggie."
            ]
        ,
        "biased_opposing": 
            [
                "Always with the corners!",
                f"{p1['id']} corners, what a disgrace!",
                "Ugh, corner...",
                f"{p1['id']} wasting our time with a corner.",
                "Corner? Really?"
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)

def out_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    statistic_prob = 50
    roll = random.randint(0,100)
    if statistic_prob > roll:
        return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)

    args = event["args"]
    team = teams[1] if args["player"]["team"] else teams[0]
    supporting = True if args["player"]["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    p1 = args["player"]
    if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": 
            [
                "We have an out.",
                "Out!",
                f"{p1['id']} with an out.",
                "The ball is out.",
                f"{p1['id']} kicked the ball out."
            ]
        ,
        "aggressive": 
            [
                "Out out out!",
                "We have an out everyone!",
                "Everyone remain calm, it's an out!",
                f"Wow! {p1['id']} shot the ball out!",
                f"Ah! {p1['id']} with an out!"
            ]
        , 
        "friendly": 
            [
                f"{p1['id']} kicked the ball out, that's okay!",
                "Out! No problem!",
                "Out! Let's give it another try!",
                f"{p1['id']} had an out there, no biggie.",
                f"{p1['id']} kicked it out. Better luck next time!"
            ] 
        ,
        "biased_supporting": 
            [
                f"{p1['id']} unfortunately kicked the ball out!",
                "Even great teams mess up!",
                f"Oh no, {p1['id']} with an out.",
                "They can recover from this out.",
                "Sadly, the ball went out of the court."
            ]
        ,
        "biased_opposing": 
            [
                "Ahah! An out!",
                "Of course they kicked it out!",
                f"Great job, {p1['id']}... not.",
                f"Out. {p1['id']} always messes up like this.",
                "An out? Are you kidding?"
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)

def goalkeeper_out_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, priority):

    statistic_prob = 50
    roll = random.randint(0,100)
    if statistic_prob > roll:
        return statistic_lines(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)

    args = event["args"]
    team = teams[1] if args["player"]["team"] else teams[0]
    supporting = True if args["player"]["team"] == (bias > 0) else False
    team_supporting, team_opposing = (teams[0], teams[1]) if (bias < 0) else (teams[1], teams[0])

    p1 = args["player"]
    if p1['id'] in player_name_map.keys(): p1['id'] = player_name_map[p1['id']]

    lines = { 
        "neutral": 
            [
                "A goalkeeper out here.",
                "A goalkeeper out just happened.",
                f"Goalkeeper out by {p1['id']}.",
                f"{p1['id']} with a goalkeeper out.",
                "Goalkeeper out!"
            ]
        ,
        "aggressive": 
            [
                "Wow! A goalkeeper out!",
                "Ah! Goalkeeper out!",
                f"Here goes {p1['id']} with a goalkeeper out!",
                f"Attention! Goalkeeper out by {p1['id']}!",
                f"Impossible! {p1['id']} causes a goalkeeper out!"
            ]
        , 
        "friendly": 
            [
                "Goalkeeper out, all good.",
                "Goalkeeper out, happens sometimes!",
                "Oopsie! Goalkeeper out.",
                f"{p1['id']} with a goalkeeper out, all good!",
                f"Goalkeeper out by {p1['id']} but the game goes on!"
            ] 
        ,
        "biased_supporting": 
            [
                f"Goalkeeper out by {p1['id']}, they can recover quick.",
                "Goalkeeper out, that's fine.",
                f"{p1['id']} with a goalkeeper out, just a small mistake.",
                "Oh no, a goalkeeper out!",
                f"{p1['id']} with a goalkeeper out, no biggie."
            ]
        ,
        "biased_opposing": 
            [
                "Ahah! Goalkeeper out.",
                "A goalkeeper out, beginner mistake.",
                f"{p1['id']} with a goalkeeper out, come on...",
                f"Had to be {p1['id']} with a goalkeeper out.",
                "Goalkeeper out, ridiculous."
            ]
    }

    line_type = dice_roll(agr_frnd_mod, bias != 0, supporting)
    return event_to_text(event, line_type, stats, en_calm_mod, bias, teams, lines[line_type], priority)

def event_to_text(event, type, stats, en_calm_mod, bias, teams, lines=None, priority=10):
    # print(f"event_to_text {stats = }")
    if lines is None:
        lines = []

    if len(lines) < 1:
        print(type, event["event"])
        pass

    for line in lines:
        if remove_players(line, teams) in lines_repeated.queue:
            lines.remove(line)

    if len(lines) == 0:
        phrase = ""
    else:
        n = random.randint(0, len(lines) - 1)
        phrase = lines[n]
        if bias != 0:
            curr_stats = get_stats(event['start'], stats)
            if not curr_stats:
                winning, mod = None, 0
            else:
                winning, mod = whos_winning(curr_stats)
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

    commentary = Comentary(phrase, type, en_calm_mod, event["start"], priority)
    lines_repeated.add(remove_players(phrase, teams))
    # return f"({event['start']}, {event['end']}) " + lines[n]
    return commentary

def remove_players(line, teams):
    names = ["Dinis", "Isabel", "Afonso", "Miguel", "Lucius", "Joanne", "Louis", "Camila", \
        "Dianne", "Amber", "Carl", "Martha", "Bob", "Helen", "Joseph", "Josephine", "Gared", \
        "Ursula", "Bernard", "Kimberly", "Troy", "Ginny"] + teams

    l = line
    for name in names:
        l = l.replace(name, "")

    return l

# menos priority --> more important
lines = {
    "dribble": {
        "function": dribble_lines,
        "priority": 4
    },
    "short_pass": {
        "function": pass_lines,
        "priority": 3
    },
    "long_pass": {
        "function": pass_lines,
        "priority": 2
    },
    "kick_off": {
        "function": kick_off_lines,
        "priority": 1
    },
    "goal_shot": {
        "function": goal_shot_lines,
        "priority": 2
    },
    "goal": {
        "function": goal_lines,
        "priority": 0
    },
    "defense": {
        "function": defense_lines,
        "priority": 2
    },
    "intersect": {
        "function": intersect_lines,
        "priority": 5
    },
    "aggression": {
        "function": aggression_lines,
        "priority": 1
    },
    "corner_shot": {
        "function": corner_lines,
        "priority": 1
    },
    "out_shot": {
        "function": out_lines,
        "priority": 1
    },
    "goalkeeper_out_shot": {
        "function": goalkeeper_out_lines,
        "priority": 1
    }
}


def generate_script(events, stats, agr_frnd_mod, en_calm_mod, bias, teams):
    player_name_map = generate_player_names() # ran at the start and fixed for the rest of the duration
    # print(f"generate_script {stats = }")
    commentary = []
    for event in events:
        if event["event"] not in lines:
            commentary.append(Comentary(event['event'] + " not implemented yet", "neutral", 0, event['start'], 10).to_json())
        else:
            line = lines.get(event["event"])
            commentary.append(
                line["function"](event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams, line["priority"]).to_json())


    # commentary = [
    #     lines.get(event["event"],
    #               lambda x: event_to_text(event, ["Not implemented yet :)"]))(event, stats, agr_frnd_mod, en_calm_mod, bias, player_name_map, teams)
    #               # lambda x: f"({event['start']}, {event['end']}) \'{event['event']}\' Not implemented yet :)")(event)
    #     for event in events
    # ]
    return commentary

def whos_winning(stats):
    """Returns the team that's winning, plus how bad they are winning"""
    # 2 - team is winning by goals
    # 1 - team is winning by shots, defenses and ball posession

    # print(f"whos_winning - {stats = }")
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
    
def get_stats(timestamp : float, stats : dict):
    timestamps = list(stats.keys())
    timestamps.sort()

    # print(f"get_stats {stats = }")

    if timestamp < float(timestamps[0]):
        return None

    last = timestamps[0]

    for stamp in timestamps[1:]:
        if float(stamp) <= float(timestamp):
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
    for i in range(1, 12):
        idLeft = "matNum" + str(i) + "matLeft"
        idRight = "matNum" + str(i) + "matRight"
        ret[idLeft] = names[i-1]
        ret[idRight] = names[i+11-1]

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
