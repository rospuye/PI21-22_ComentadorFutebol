import sys

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


def split_time(time : str):
    splt = time.split(":")
    return int(splt[0]), float(splt[1])

def update_line(line : str, time : str):
    splt = line.split(',')
    off_min, off_sec = split_time(time)
    start_min, start_sec = split_time(splt[0])
    end_min, end_sec= split_time(splt[1])

    new_start_min, new_start_sec = update_time(start_min, start_sec, off_min, off_sec)
    new_end_min, new_end_sec = update_time(end_min, end_sec, off_min, off_sec)
    output = f"{new_start_min}:{new_start_sec},{new_end_min}:{new_end_sec},"
    for i in range(2, len(splt)):
        output += splt[i]
    return output



def main():
    if len(sys.argv) < 3:
        print("USAGE: python update_timestamps.py <filename> <time_value (M:SS.MSMS)>")
        return
    
    filename = sys.argv[1]
    start_time = sys.argv[2]

    with open(filename, "r") as inpt:
        with open(f"{filename}_updated", "w") as outp:
            # 0:44.24,0:47.67,kick_off
            next_line = next(inpt)

            while next_line:
                try:
                    line = update_line(next_line, start_time)
                    outp.write(line)
                    next_line = next(inpt)
                except StopIteration:
                    break
                except Exception:
                    print(f"ERROR PARSING LINE: '{next_line}'. PLEASE CHECK IT AND TRY AGAIN")
                    break


if __name__ == "__main__":
    main()