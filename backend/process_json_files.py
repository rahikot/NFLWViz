import json
from tempfile import tempdir
from turtle import distance
import pandas as pd
import os
import sys
from pprint import pprint

df_reg = pd.DataFrame(columns=["Team", "Time", "Redzone", "Down", "Current Place"])
df_post = pd.DataFrame(columns=["Team", "Time", "Redzone", "Down", "Yards To Go", "Current Place"])

def process_json(file_name, dataframe):
    if dataframe == 0:
        dataframe = df_reg
    else:
        dataframe = df_post
    records = []
    f = open(file_name)
    data = json.load(f)
    data = data[list(data.keys())[0]]
    drives = data["drives"]
    for drive in drives:
        try:
            temp = int(drive)
        except:
            break
        print(drive)
        drive = drives[drive]
        pprint(drive)
        print("___________")
        team = drive["posteam"]
        redzone = drive['redzone']
        for play in drive['plays']:
            #pprint(drive["plays"])
            
            time = play
            play = drive['plays'][play]
            down = play['down']
            yards_to_go = play['ydstogo']
            distance_to_endzone = play['yrdln']
            row = {"Team":team, "Time":time, "Redzone":redzone, "Down":down, "Yards To Go":yards_to_go, "Current Place":distance_to_endzone}
            records.append(row)
    dataframe = pd.DataFrame.from_dict(records)
    dataframe = dataframe.loc[dataframe["Current Place"]!='',:]
    return dataframe


def main():
    limit = 1000
    if len(sys.argv) > 1:
        limit = sys.argv[1] # how many jsons to process
    reg_directory = "reg"
    post_directory = "post"
    i = 0
    for file in os.listdir(reg_directory):
        f = os.path.join(reg_directory, file)
        if os.path.isfile(f):
            if i > limit:
                break
            process_json(f, 0)
            i = i + 1

    i = 0
    for file in os.listdir(post_directory):
        f = os.path.join(post_directory, file)
        if os.path.isfile(f):
            if i > limit:
                break
            process_json(f, 1)


if __name__ == "__main__":
    main()