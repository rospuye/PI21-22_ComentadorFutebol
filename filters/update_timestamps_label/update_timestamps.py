import sys
from tokenize import String

def update_time(minu,sec, off_min, off_sec):

    if off_min > minu or (off_min == minu and off_sec > sec):
        # Offset greater than initial time
        print("You have offset greater than some time values. These time will be set to 0:00.00")
        return 0, 0.0
    new_sec = round(sec - off_sec,2) if sec > off_sec else round(60 + sec - off_sec,2)
    new_min = minu - off_min if sec > off_sec else minu - off_min - 1

    # print(f"{sec = }")
    # print(f"{off_sec = }")
    # print(f"{round(60 + sec - off_sec, 2) = }")

    return new_min, new_sec

def add_time(time1 : str, time2 : str):
    # print(f"{time1 = }")
    # print(f"{time2 = }")

    time1_minute, time1_seconds = split_time(time1)
    time2_minute, time2_seconds = split_time(time2)
    new_time_seconds = round((time1_seconds + time2_seconds) % 60, 2)
    new_time_minutes = time1_minute + time2_minute
    if round(time1_seconds + time2_seconds, 2) > 60:
        new_time_minutes += 1
    return new_time_minutes, new_time_seconds

def split_time(time : str):
    splt = time.split(":")
    return int(splt[0]), float(splt[1])

def update_line(line : str, time : str, isSecondMatch : bool):
    splt = line.split(',')
    off_min, off_sec = split_time(time)
    start_min, start_sec = split_time(splt[0])
    end_min, end_sec= split_time(splt[1])

    new_start_min, new_start_sec = update_time(start_min, start_sec, off_min, off_sec)
    new_end_min, new_end_sec = update_time(end_min, end_sec, off_min, off_sec)

    if (isSecondMatch):
        start_tupl = add_time(f"{new_start_min}:{new_start_sec}", "05:00.00")
        end_tupl = add_time(f"{new_end_min}:{new_end_sec}", "05:00.00")
        output = f"{start_tupl[0]}:{start_tupl[1]},{end_tupl[0]}:{end_tupl[1]},"
    
    else:
        output = f"{new_start_min}:{new_start_sec},{new_end_min}:{new_end_sec},"
    
    for i in range(2, len(splt)): # complete the output with everything it had before
        output += splt[i]
    return output


def main():
    if len(sys.argv) < 4:
        print("USAGE: python update_timestamps.py <filename> <time_offset (M:SS.MSMS)> <second_match (boolean)>")
        return
    
    filename = sys.argv[1]
    start_time = sys.argv[2]
    isSecondMatch = sys.argv[3].lower() == "true"

    # if isSecondMatch.lower() == "true":
    #     print("is SecondMatch")
    #     new_time_minutes, new_time_seconds = add_time(start_time, "05:00.00")
    #     start_time = f"{new_time_minutes}:{new_time_seconds}"
    #     print(f"{start_time = }")



    with open(filename, "r") as inpt:
        with open(f"{filename}_updated", "w") as outp:
            # 0:44.24,0:47.67,kick_off
            next_line = next(inpt)
            count = 1
            while next_line:
                try:
                    line = update_line(next_line, start_time, isSecondMatch)
                    outp.write(line)
                    next_line = next(inpt)
                    count += 1
                except StopIteration:
                    break
                except Exception:
                    print(f"ERROR PARSING LINE {count}: '{next_line}'. PLEASE CHECK IT AND TRY AGAIN")
                    break
            print(f"File converted to {filename}_updated!")

# 05:07.42
if __name__ == "__main__":
    main()