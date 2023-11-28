import pandas as pd
import gower
import numpy as np
from collections import Counter
import matplotlib.pyplot as plt




def find_similar_scenarios(df, play, n):
    missing_columns = set(df.columns) - set(play.keys())
    for col in missing_columns: 
        play[col] = np.nan

    df.loc[-1] = play

    results = gower.gower_topn(df.iloc[-1:,:][["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], df[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], n=n + 1)
    index = results["index"]
    values = results["values"]
    new_df = df.iloc[[i for i in index][1:]]
    new_df["gower_similarity"] = values[1:]
    return new_df.iloc[:-1]



def recommend_play(df):
    play_type = 0
    play_direction = 0
    mean_yardage = 0
    mean_yardage = df.groupby("play_type").mean("yards_gained")["yards_gained"][["pass", "run"]].values
    std_yardage = df[["play_type", "yards_gained"]].groupby("play_type").std().iloc[1:].values.reshape(1,-1)[0][-2:]
    
    if (mean_yardage / std_yardage)[0] > (mean_yardage / std_yardage)[1]:
        play_type = "pass"
        mean_yardage = mean_yardage[0]
    else: 
        play_type = "run"
        mean_yardage = mean_yardage[1]

    if len(df[df["play_type"] == play_type]["pass_location"].dropna()) == 0:
        if len(df["pass_location"].dropna()) == 0:
            play_direction = "middle"
        else:
            counted = Counter(df["pass_location"].dropna().values)
            play_direction = max(counted, key=counted.get)
    else: 
        counted = Counter(df[df["play_type"] == play_type]["pass_location"].dropna().values)
        play_direction = max(counted, key=counted.get)
    return play_type, play_direction, mean_yardage




if __name__ == "__main__":
    df = pd.read_csv("backend/data/plays.csv", index_col=0)
    similar_plays = find_similar_scenarios(df, df.iloc[0][["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], 20)
    print(recommend_play(similar_plays))

