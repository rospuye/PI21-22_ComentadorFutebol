# Essential imports
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder

# LSTM library
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout

# File Management
import sys
import os

def get_filtered_data(path="", starting_row=0, ending_row=-1, n_closest_players = 11):
    """Given a path to a csv file, returns the timestamp and the matrix """

    idxs = [i for i in range(0, n_closest_players + 1)] + [i for i in range(12, n_closest_players + 1)] + [23]

    training_csv = pd.read_csv(path, usecols=idxs).values
    timestamps = training_csv[starting_row:ending_row,0]
    matrix = training_csv[starting_row:ending_row, 1:]

    return timestamps, matrix


def main():

    if len(sys.argv) != 8:
        print("USAGE: python lstm_nn.py <n_epoch> <n_neurons> <n_batches> <past_timestamps> <n_layers> <n_closest_players> <optimizer>")
        return
    
    EPOCHS =  int(sys.argv[1])
    N_NEURONS_LSTM =  int(sys.argv[2])
    BATCH_SIZE =  int(sys.argv[3])
    PAST_TIME_STEPS = int(sys.argv[4])
    N_LAYERS = int(sys.argv[5])
    N_CLOSEST_PLAYERS =  int(sys.argv[6])
    OPTIMIZER = sys.argv[7]

    TRAINING_PATH = "./training_model/dinis_game_1_labelled.csv"
    TRAINING_START_ROW = 628 # default 0
    TRAINING_END_ROW = 5000 # default -1

    # TEST_PATH = "./training_model/csv_with_labels(full).csv"
    TEST_PATH = "./training_model/dinis_game_1_labelled.csv"
    TEST_START_ROW = 5000 # default 0
    TEST_END_ROW = 7500 # default -1

    dir = "./output_generated_hyper_params"

    if not os.path.isdir(dir):
        os.mkdir(dir)

    filename = f"{dir}/{EPOCHS}_{N_NEURONS_LSTM}_{BATCH_SIZE}_{PAST_TIME_STEPS}_{N_LAYERS}_{N_CLOSEST_PLAYERS}_{OPTIMIZER}"


    with open(filename,"w") as file:

        file.write(f"{EPOCHS = }\n")
        file.write(f"{N_NEURONS_LSTM = }\n")
        file.write(f"{BATCH_SIZE = }\n")
        file.write(f"{PAST_TIME_STEPS = }\n")
        file.write(f"{N_LAYERS = }\n")
        file.write(f"{N_CLOSEST_PLAYERS = }\n")
        file.write(f"{OPTIMIZER = }\n")

        timestamps_training, positions_training = get_filtered_data(path=TRAINING_PATH, starting_row=TRAINING_START_ROW, ending_row=TRAINING_END_ROW)
        n_examples = len(positions_training)
        n_features = positions_training.shape[1] - 1

        # Applying normalization
        scaler = MinMaxScaler(feature_range=(0,1)) # Apply values to [0, 1]
        positions_training_scaled = scaler.fit_transform(positions_training)

        # Convert training array to the right shape
        features_set = []
        labels = []

        for i in range(PAST_TIME_STEPS, n_examples):
            features_set.append(positions_training_scaled[i-PAST_TIME_STEPS:i, 0:n_features]) # previous N records
            labels.append(positions_training_scaled[i, -1])

        # Converting to numpy arrays
        features_set, labels = np.array(features_set), np.array(labels)

        n_outputs = len(np.unique(labels))

        # Converting to the LSTM format where the dimensions are:
        # - number of records
        # - number of time steps (past steps)
        # - number of indicators/features.
        features_set = np.reshape(features_set, (features_set.shape[0], features_set.shape[1], features_set.shape[2]))

        # Model initialization
        model = Sequential()

        # Adding LSTM layer
        # a funcao "add" literalmente adiciona um novo layer, que no nosso caso, sera um LSTM

        # The fist LSTM parameter is the number of neurons on the node
        # The second one is basically true, because we'll add more layers to the model
        # The last one is a shape indicating the number of time steps and the number of indicators


        for _ in range(1,N_LAYERS):
            model.add(LSTM(units=N_NEURONS_LSTM, return_sequences=True, input_shape=(features_set.shape[1], features_set.shape[2])))
            model.add(Dropout(0.2))

        model.add(LSTM(units=N_NEURONS_LSTM, return_sequences=False, input_shape=(features_set.shape[1], features_set.shape[2])))

        # Adding Dropout layer (avoids over-fitting)
        model.add(Dropout(0.2))

        # Adding Dense Layer (ending layer)
        model.add(Dense(n_outputs))

        model.compile(optimizer = OPTIMIZER, loss = 'mean_squared_error', metrics=['accuracy'])

        # Training the model
        history = model.fit(features_set, labels, epochs = EPOCHS, batch_size = BATCH_SIZE) # batch_size does a lot of improvement

        np.savetxt(f"{filename}_loss", history.history.get('loss'))
        np.savetxt(f"{filename}_accuracy", history.history.get('accuracy'))

        # Testing zone
        timestamps_testing, positions_testing = get_filtered_data(path=TEST_PATH, starting_row=TEST_START_ROW, ending_row=TEST_END_ROW)


        # Reshaping the testing
        positions_testing_scaled = scaler.transform(positions_testing)
        n_tests = len(positions_testing)

        # Add Past time
        test_features = []
        test_labels = []
        for i in range(PAST_TIME_STEPS, n_tests): 
            test_features.append(positions_testing_scaled[i-PAST_TIME_STEPS:i, 0:n_features])
            test_labels.append(positions_testing_scaled[i, -1])


        # Convert to the LSTM format
        test_features = np.array(test_features)
        test_labels = np.array(test_labels)
        test_features = np.reshape(test_features, (test_features.shape[0], test_features.shape[1], test_features.shape[2]))

        test_loss, test_accuracy = model.evaluate(test_features, test_labels, verbose=2)
        file.write(f"{test_loss = }\n")
        file.write(f"{test_accuracy = }\n")

        training_loss, training_accuracy = model.evaluate(features_set, labels, verbose=2)
        file.write(f"{training_loss = }\n")
        file.write(f"{training_accuracy = }\n")

        predictions = model.predict(test_features)
        np.savetxt(f"{filename}_predictions", predictions)

        print("Output generated!")


if __name__ == "__main__":
    main()