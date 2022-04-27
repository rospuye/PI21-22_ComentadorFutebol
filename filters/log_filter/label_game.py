import sys
import numpy as np
import pandas as pd

def get_index(time_array, time):
    for i in range(len(time_array)):
        if time_array[i] > time:
            return i
    return len(time_array)-1

def label_game(labels_file, feature_file):
    # legend = ["nothing","kick_off","dribble","long_pass","short_pass","corner_shot","intersect","aggression","defense","poste","trave"]
    legend = ["nothing", "dribble", "pass"] 
    labelling = np.array(pd.read_csv("labelling/input/"+labels_file,header=None))
    game_features = np.array(pd.read_csv("logs/output/"+feature_file,header=None))
    time_array = game_features[:,0]

    # all output starts as 0 (nothing)
    zeros = np.zeros(game_features.shape[0]).reshape(game_features.shape[0],1)
    game_features = np.c_[game_features, zeros]

    for line in labelling:
        label = 0
        initial = float(line[0].split(":")[0])*60+float(line[0].split(":")[1])
        final = float(line[1].split(":")[0])*60+float(line[1].split(":")[1])
        i = get_index(time_array, initial) 
        f = get_index(time_array, final)
        if(line[2].strip() in legend):
            label = legend.index(line[2].strip())
            game_features[i:f+1,-1] = label
        else:
            # label = 3.0 # Default value for "other" class
            # game_features[i:f+1,-1] = label
            print("Unrecognized label:",line[2].strip())

    #np.savetxt(("labelling/output/"+feature_file).rstrip(".csv")+"_labelled.csv", game_features, delimiter=",")
    pd.DataFrame(game_features).to_csv(("labelling/output/"+feature_file).rstrip(".csv")+"_labelled.csv", index=False)

if __name__ == "__main__":
    label_game(sys.argv[1], sys.argv[2])