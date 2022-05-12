class analytics():
    def __init__(self) -> None:
        self.goals = 0
        self.shots = 0
        self.ball_time = 0
        self.ball_poss = 0
        self.s_passes = 0
        self.l_passes = 0

    def __str__(self) -> str:
        return f"Shots: {self.shots}, Goals: {self.goals}, Ball Posession: {self.ball_poss}, Passes: {self.l_passes+self.s_passes}"

class team_analytics():
    def __init__(self) -> None:
        self.goals = 0
        self.shots = 0
        self.ball_poss = 0

    def __str__(self) -> str:
        return f"Shots: {self.shots}, Goals: {self.goals}, Ball Posession: {self.ball_poss}"

def update_analytics(analysis, team_analysis, entities):


    posession_total = sum([analysis[player].ball_time for player in entities[1:]])

    if posession_total != 0:

        team_analysis["A"].ball_poss = (sum([analysis[player].ball_time for player in entities[1:12]])/posession_total)*100
        team_analysis["B"].ball_poss = (sum([analysis[player].ball_time for player in entities[12:]])/posession_total)*100
        team_analysis["A"].goals = sum([analysis[player].goals for player in entities[1:12]])
        team_analysis["B"].goals = sum([analysis[player].goals for player in entities[12:]])
        team_analysis["A"].shots = sum([analysis[player].shots for player in entities[1:12]])
        team_analysis["B"].shots = sum([analysis[player].shots for player in entities[12:]])

        for player in entities[1:]:
            analysis[player].ball_poss = (analysis[player].ball_time/posession_total) * 100

    ret = dict()
    ret["teams"] = team_analysis
    ret["players"] = analysis

    return ret

def get_analytics(events : list, entities : list):
    # out = "logs/output/anal"
    # output = open(out, "w")
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
            from_player = None
            to_player = None
            for entity in entities:
                if entity.id == event.fromId: 
                    from_player = entity
                if entity.id == event.toId: 
                    to_player = entity
            if (not from_player) or (not to_player):  
                print("This shouldn't be happening!")
                break
            if from_player.isTeamRight == to_player.isTeamRight:
                # successful pass
                if event.event == "short_pass":
                    analysis[from_player].s_passes += 1
                else:
                    analysis[from_player].l_passes += 1
            analysis[from_player].ball_time += event.end - event.start
            last_ball_owner = to_player
            analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
        elif event.event in ["dribble", "goal_shot"]:
            player = None
            for entity in entities:
                if entity.id == event.id: 
                    player = entity
            if (not player):  
                print("This shouldn't be happening!")
                break
            if event.event == event.event == "goal_shot":
                analysis[player].shots += 1
            analysis[player].ball_time += event.end - event.start
            last_ball_owner = player
            analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
        elif event.event in ["goal"]:
            analysis[last_ball_owner].goals += 1
            last_ball_owner = None
            tmp_dict = dict()
            tmp_dict["players"] = analysis
            tmp_dict["teams"] = team_analysis
            analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
        else: 
            pass

        analytics_log[timestamp] = update_analytics(analysis, team_analysis, entities)
    

    return analytics_log