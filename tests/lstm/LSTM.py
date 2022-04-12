import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# LSTM library
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout


def main():
    # Importing the CSV file
    apple_training_complete = pd.read_csv("./AAPL.csv")

    # Filter only for the "Open" collumn on the csv file
    apple_training_processed = apple_training_complete.iloc[:, 1:2].values

    # Applying normalization
    scaler = MinMaxScaler(feature_range = (0, 1))
    apple_training_scaled = scaler.fit_transform(apple_training_processed)

    # Convert training to the right shape
    N_RECORDS = len(apple_training_processed)
    PAST_DAYS = 60
    features_set = []
    labels = []
    for i in range(PAST_DAYS, N_RECORDS):
        features_set.append(apple_training_scaled[i-PAST_DAYS:i, 0]) # previous N records
        labels.append(apple_training_scaled[i, 0])

    # Converting to numpy arrays
    features_set, labels = np.array(features_set), np.array(labels)

    # Converting to the LSTM format where the dimensions are:
    # - number of records (1260)
    # - number of time steps (past days) (60)
    # - number of indicators/features. In our case, we want only the "Open" column, so it's 1
    features_set = np.reshape(features_set, (features_set.shape[0], features_set.shape[1], 1))

    # Model initialization
    model = Sequential()

    # Adding LSTM layer
    # a funcao "add" literalmente adiciona um novo layer, que no nosso caso, sera um LSTM

    # The fist LSTM parameter is the number of neurons on the node
    # The second one is basically true, because we'll add more layers to the model
    # The last one is a shape indicating the number of time steps and the number of indicators
    model.add(LSTM(units=50, return_sequences=True, input_shape=(features_set.shape[1], 1)))

    # Adding Dropout layer (avoids over-fitting)
    model.add(Dropout(0.2))

    # Adding three more LSTM and Dropout layers
    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.2))

    model.add(LSTM(units=50, return_sequences=True))
    model.add(Dropout(0.2))

    model.add(LSTM(units=50))
    model.add(Dropout(0.2))

    # Adding Dense Layer (ending layer...?)
    # 1 unit beause we want to predict
    model.add(Dense(units = 1))

    # Compiling the model
    model.compile(optimizer = 'adam', loss = 'mean_squared_error')

    # Training the model
    # model.fit(features_set, labels, epochs = 100, batch_size = 32)


main()