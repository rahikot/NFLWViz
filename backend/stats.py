import pandas as pd

from similar_plays import recommend_play, find_similar_scenarios


def specify_team(df, team):
    return df.query(f'(home_team == "{team}" | away_team == "{team}") & defteam != "{team}"').reset_index().drop("index", axis=1)

def specify_defense(df, team):
    return df[df["defteam"] == team].reset_index().drop("index", axis=1)

def produce_dataframes(df, offensive_team, defensive_team, request_data):
    df_specified  = specify_team(df, offensive_team)
    df_specified_def = specify_defense(df, defensive_team)
    
    similar_df_specified = find_similar_scenarios(df_specified, pd.Series(request_data), 20)
    similar_df_defensive = find_similar_scenarios(df_specified_def, pd.Series(request_data), 20)
    similar_df = find_similar_scenarios(df, pd.Series(request_data), 20)
    return similar_df, similar_df_specified, similar_df_defensive

def historical_play_types(similar_df, similar_df_specified, similar_df_defensive):

    normalized_counts_similar = similar_df['play_type'].value_counts(normalize=True)
    normalized_counts_specified = similar_df_specified['play_type'].value_counts(normalize=True)
    normalized_counts_defensive = similar_df_defensive["play_type"].value_counts(normalize=True)

    df_normalized_counts_similar = normalized_counts_similar.to_frame(name='All Teams')
    df_normalized_counts_specified = normalized_counts_specified.to_frame(name='Team Specific')
    df_normalized_counts_defensive = normalized_counts_defensive.to_frame(name='Defense Specific')


    df_normalized_counts = df_normalized_counts_similar.join(df_normalized_counts_specified, how='outer')
    df_normalized_counts = df_normalized_counts.join(df_normalized_counts_defensive, how='outer')

    temp_df = similar_df.groupby("play_type").mean("yards_gained")["yards_gained"].to_frame(name='All Teams').join(similar_df_specified.groupby("play_type").mean("yards_gained")["yards_gained"].to_frame("Team Specific"), how="outer")
    temp_df.join(similar_df_defensive.groupby("play_type").mean("yards_gained")["yards_gained"].to_frame("Defense Specific"), how="outer").fillna(0).to_dict()

    return {"prob_values" : df_normalized_counts.fillna(0).to_dict(), "mean_yards" : temp_df.join(similar_df_defensive.groupby("play_type").mean("yards_gained")["yards_gained"].to_frame("Defense Specific"), how="outer").fillna(0).to_dict()}
