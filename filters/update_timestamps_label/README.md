# Update Timestamps
Given a text file with the labelling structure and the video time that the game actually starts and receive an updated version of the file
```
python update_timestamps.py <filename> <time_offset (M:SS.MSMS)> <second_match (boolean)>
```
OBS.: The time offset is the VIDEO TIME, not the GAME TIME. Put this value at the time that the tag "kick_off" appears on the top left.

The second_match parameters just adds 5 min to the times (all games I think have that property)