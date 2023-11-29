import pandas as pd




def specify_team(df, team):
    return df.query(f'(home_team == "{team}" | away_team == "{team}") & defteam != "{team}"').reset_index().drop("index", axis=1)

def specify_defense(df, team):
    return df[df["defteam"] == team].reset_index().drop("index", axis=1)