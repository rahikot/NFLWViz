from flask import Flask, request, jsonify
from similar_plays import recommend_play, find_similar_scenarios
import pandas as  pd
#from stats import specify_defense, specify_team, produce_dataframes, historical_play_types
from stats import *
app = Flask(__name__)

@app.route('/get_play_details', methods=['GET'])
def get_play_details():
    # Getting JSON data from the request
    df = pd.read_csv("backend/data/plays.csv", index_col=0)
    request_data = request.args.to_dict()
    print(request_data)
    offensive_team = request_data["offensiveTeam"]
    defensive_team = request_data["defensiveTeam"]

    #If 4th down is invoked
    if int(request_data["down"]) == 4:
        df = df[df["down"] == 4]
    
    similar_df, similar_df_specified, similar_df_defensive = produce_dataframes(df, offensive_team, defensive_team, request_data)

    

    recommendation = recommend_play(similar_df, pd.Series(request_data))
    # Example: Fetch play details based on request_data
    # This is a placeholder for your logic to process request_data
    # For demonstration, returning the received data as a mock response
    return jsonify({
        "received_data": request_data,
        "recommendation": recommendation,
        "historical_plays" : historical_play_types(similar_df, similar_df_specified, similar_df_defensive)
    })

if __name__ == '__main__':
    """ WHAT I REQUIRE:
    ["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore", "offensiveTeam", "defensiveTeam"]
    offensiveTeam is the team that is currently on offense (the team we want to make recommendations/analysis for)
    defensiveTeam is who the defense is
    """
    # ["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], df[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]
    # EXAMPLE QUERY: http://127.0.0.1:5000/get_play_details?home_team=SF&away_team=ATL&yardlineNumber=50&quarter=1&down=4&gameClock_minutes=10&gameClock_seconds=15&yardsToGo=45&preSnapHomeScore=7&preSnapVisitorScore=5&offensiveTeam=SF&defensiveTeam=ATL
    app.run(host='127.0.0.1', threaded=True, debug=True)
