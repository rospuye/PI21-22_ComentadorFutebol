import os

if __name__ == "__main__":
    epochs = [10, 50, 100, 200]
    neurons = [i for i in range(5, 51, 5)]
    batches = [i for i in range(100, 1001, 100)]
    past_timestamps = [i for i in range(30, 3001, 30)]
    n_layers = [i for i in range(1, 11)]
    closest_players = [i for i in range (1,12)]
    optimizers = ["adamn", "sgd", "nadam"]

    for epoch in epochs:
        for neuron in neurons:
            for batch in batches:
                for past_timestamp in past_timestamps:
                    for n_layer in n_layers:
                        for closest_player in closest_players:
                            for optimizer in optimizers:
                                os.system(f"python lstm_nn.py {epoch} {neuron} {batch} {past_timestamp} {n_layer} {closest_player} {optimizer}")