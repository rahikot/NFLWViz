import multiprocessing
import sys
import warnings
sys.path.append("/Users/arnavhiray/Fall 2023/CX 4242/DVA-Project/backend")
warnings.filterwarnings('ignore')
from stats import * 
from similar_plays import * 
import pandas as pd
from collections import Counter
import os 
os.chdir("/Users/arnavhiray/Fall 2023/CX 4242/DVA-Project/backend")


df= pd.read_csv("data/plays.csv", index_col=0)

def produce_dataframes(df, request_data, n):
    similar_df = find_similar_scenarios(df, pd.Series(request_data), n)
    return similar_df

def get_proportion(df):
    counted = Counter(df["play_type_nfl"].dropna())

    total_penalty_sack = counted.get('PENALTY', 0) + counted.get('SACK', 0)
    total_count = sum(counted.values())
    
    proportion = total_penalty_sack / total_count if total_count > 0 else 0
    return proportion 

risk_proportion = {} 
for i in range(1000):
    print(i)
    sampled = df.sample(1) 
    index = sampled.index[0]
    similar_df  = produce_dataframes(df, sampled.iloc[0], 90)
    proportion = get_proportion(similar_df)
    defensive_team = sampled["defteam"].values[0]
    offensive_team = sampled["home_team"].values[0] if sampled["home_team"].values[0] != defensive_team else sampled["away_team"].values[0]

    if offensive_team not in risk_proportion.keys():
        risk_proportion[offensive_team] = [proportion]
    else:
        risk_proportion[offensive_team].append(proportion)

import json

json = json.dumps(risk_proportion)

f = open("risk_proportion_general.json","w")
f.write(json)
f.close()