class analytics():
    def __init__(self) -> None:
        self.goals = 0
        self.shots = 0
        self.defenses = 0
        self.aggressions = 0
        self.ball_time = 0
        self.ball_poss = 0
        self.s_passes = 0
        self.l_passes = 0

    def __str__(self) -> str:
        return f"Shots: {self.shots}, Goals: {self.goals}, Ball Posession: {self.ball_poss}, Passes: {self.l_passes+self.s_passes}, Defenses: {self.defenses}"

class team_analytics():
    def __init__(self) -> None:
        self.goals = 0
        self.shots = 0
        self.defenses = 0
        self.ball_poss = 0

    def __str__(self) -> str:
        return f"Shots: {self.shots}, Goals: {self.goals}, Defenses: {self.defenses}, Ball Posession: {self.ball_poss}"

def update_analytics(analysis, team_analysis, entities, update_poss=True):


    posession_total = sum([analysis[player].ball_time for player in entities[1:]])

    if posession_total != 0 and update_poss:

        team_analysis["A"].ball_poss = (sum([analysis[player].ball_time for player in entities[1:12]])/posession_total)*100
        team_analysis["B"].ball_poss = (sum([analysis[player].ball_time for player in entities[12:]])/posession_total)*100
        team_analysis["A"].goals = sum([analysis[player].goals for player in entities[1:12]])
        team_analysis["B"].goals = sum([analysis[player].goals for player in entities[12:]])
        team_analysis["A"].shots = sum([analysis[player].shots for player in entities[1:12]])
        team_analysis["B"].shots = sum([analysis[player].shots for player in entities[12:]])
        team_analysis["A"].defenses = sum([analysis[player].defenses for player in entities[1:12]])
        team_analysis["B"].defenses = sum([analysis[player].defenses for player in entities[12:]])

        for player in entities[1:]:
            analysis[player].ball_poss = (analysis[player].ball_time/posession_total) * 100

    ret = dict()
    ret["teams"] = team_analysis
    ret["players"] = analysis

    return ret

def get_analytics(events : list, entities : list):
    analytics_log = dict() # timestamp -> analytics dict

    last_ball_owner = None

    team_analysis = dict()
    team_analysis["A"] = team_analytics()
    team_analysis["B"] = team_analytics()

    analysis = dict()
    for player in entities[1:]:
        analysis[player] = analytics()

    #events.sort(key= lambda x: x.start)
    for event in events:
        timestamp = event.end
        if event.event in ["short_pass", "long_pass"]:
            from_player = event.fromPlayer
            last_ball_owner = event.toPlayer
            if from_player.isTeamRight == last_ball_owner.isTeamRight:
                # successful pass
                if event.event == "short_pass":
                    analysis[from_player].s_passes += 1
                else:
                    analysis[from_player].l_passes += 1
            analysis[from_player].ball_time += event.end - event.start
            analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
        elif event.event in ["dribble", "goal_shot", "kick_off", "defense", "intersect"]: # event with one player involved
            last_ball_owner = event.player
            if event.event == "goal_shot":
                analysis[last_ball_owner].shots += 1
            elif event.event == "defense":
                analysis[last_ball_owner].defenses += 1
            if event.event not in ["kick_off", "defense", "intersect"]: # instantaneous events
                analysis[last_ball_owner].ball_time += event.end - event.start
            if event.event not in ["kick_off", "intersect"]: # irrelevant for team statistics
                analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
        elif event.event in ["goal"]:
            analysis[last_ball_owner].goals += 1
            last_ball_owner = None
            tmp_dict = dict()
            tmp_dict["players"] = analysis
            tmp_dict["teams"] = team_analysis
            analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
        elif event.event in ["aggression"]: 
            # aggressions don't give us information about ball posession 
            # as the ball is being disputed by two players
            analysis[event.p1].aggressions += 1
            analysis[event.p2].aggressions += 1
            analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities, False)
        else: 
            continue

        analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
    

    return analytics_log