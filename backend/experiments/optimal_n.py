import os
os.chdir("/Users/arnavhiray/Fall 2023/CX 4242/DVA-Project/backend")
import sys
sys.path.append("/Users/arnavhiray/Fall 2023/CX 4242/DVA-Project/backend")
import pandas as pd
import gower
import numpy as np
pd.set_option('display.max_columns', 500)
import matplotlib.pyplot as plt
import pandas as pd
import gower
import numpy as np
from collections import Counter
from similar_plays import find_similar_scenarios, recommend_play
import matplotlib.pyplot as plt
from stats import *

import warnings


warnings.filterwarnings('ignore')

df = pd.read_csv("/Users/arnavhiray/Fall 2023/CX 4242/DVA-Project/backend/data/plays.csv", index_col=0)




def produce_dataframes(df, request_data, n):
    
    similar_df = find_similar_scenarios(df, pd.Series(request_data), n)
    return similar_df


def find_optimal_n(n):
    print(f"Simulating for {n}")
    same_call = []
    different_call = []

    for i in range(500):
        sampled = df.sample(1)
        index = sampled.index[0]

        similar_df  = produce_dataframes(df, sampled.iloc[0], n)
        recommendation = recommend_play(similar_df, sampled.iloc[0])
        original_call = df.loc[index]

        if original_call["play_type"] == recommendation[0]:
            same_call.append(original_call["yards_gained"])
        else: 
            different_call.append(original_call["yards_gained"])
    return same_call, different_call

from multiprocessing import Pool

results = {}
n_values = [ i for i in range(10,101, 10)] + [ i for i in range(125,500, 25)]
for i in n_values:
    results[i] = find_optimal_n(i)

import json

json = json.dumps(results)

f = open("optimal_n.json","w")
f.write(json)
f.close()

for i in n_values:
    print(i)
    print("__________")
    print(np.mean(results[i][0]),np.mean(results[i][1]))

