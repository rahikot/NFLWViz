import pandas as pd
import gower
import numpy as np
from collections import Counter
import matplotlib.pyplot as plt
import statsmodels.api as sm
from scipy.stats import gmean


def find_similar_scenarios(df, play, n):
    df = df[df["down"] == int(play["down"])]
        
    play = pd.DataFrame([play])

    dtype_dict = {
        'yardlineNumber': 'float64',
        'quarter': 'float64',
        'down': 'float64',
        'gameClock_minutes': 'int64',
        'gameClock_seconds': 'int64',
        'yardsToGo': 'float64',
        'preSnapHomeScore': 'float64',
        'preSnapVisitorScore': 'float64'
    }

    play = play.astype(dtype_dict)

    missing_columns = set(df.columns) - set(play.columns)
    for col in missing_columns: 
        play[col] = np.nan
    
        
    results = gower.gower_topn(play[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], df[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], n=n + 1, cat_features=[False, True, True, False, False, False, True, True])
    index = results["index"]
    values = results["values"]
    new_df = df.iloc[[i for i in index][1:]]
    new_df["gower_similarity"] = values[1:]

    return new_df.iloc[:-1]


def predict_yardage(group, play):
    if len(group) == 0: 
         return 0
    
    dtype_dict = {
        'yardlineNumber': 'float64',
        'quarter': 'float64',
        'down': 'float64',
        'gameClock_minutes': 'int64',
        'gameClock_seconds': 'int64',
        'yardsToGo': 'float64',
        'preSnapHomeScore': 'float64',
        'preSnapVisitorScore': 'float64'
    }

    if len(group) <= 20:
        return group["yards_gained"].mean()

    play = play.astype(dtype_dict)
    
    X = group[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]]
    y = group[["yards_gained"]]
    X = sm.add_constant(X)
    weights = group["gower_similarity"]
    model = sm.WLS(y, X, weights=weights)
    results = model.fit()

    return results.predict(play[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]]).iloc[0]



def get_yardage(similar_df, play):
    pass_group = []
    run_group = []
    for play_type, group in similar_df.groupby('play_type'):
            if play_type == "pass": 
                    pass_group = group
            elif play_type == "run":
                    run_group = group


    play = play.to_frame().T

    pass_yardage = predict_yardage(pass_group, play)
    run_yardage = predict_yardage(run_group, play)

    run_std = run_group["yards_gained"].std() if len(run_group) != 0 else 0
    pass_std = pass_group["yards_gained"].std() if len(pass_group) != 0 else 0

    return np.array([pass_yardage, run_yardage]), np.array([pass_std, run_std])

def recommend_play(df, play):
    if int(play["down"]) == 4:
        counted = Counter(df["play_type"])
        play_type  = max(counted, key=counted.get)
        if play_type != "run" or "pass":
            return play_type

    play_type = 0
    play_direction = 0
    mean_yardage = 0

    mean_yardage, std_yardage = get_yardage(df, play)
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
    df = pd.read_csv("backend/data/plays copy.csv", index_col=0)
    play = df[df["down"] == 3].iloc[0]
  
    similar_plays = find_similar_scenarios(df, play[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], 150)
    print(recommend_play(similar_plays, play[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]]))

