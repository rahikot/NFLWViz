from flask import Flask, request, jsonify
from similar_plays import recommend_play, find_similar_scenarios
import pandas as  pd
app = Flask(__name__)

@app.route('/get_play_details', methods=['GET'])
def get_play_details():
    # Getting JSON data from the request
    df = pd.read_csv("backend/data/csv/plays.csv", index_col=0)
    request_data = request.args.to_dict()
    

    similar = find_similar_scenarios(df, pd.Series(request_data), 20)
    recommendation = recommend_play(similar)
    # Example: Fetch play details based on request_data
    # This is a placeholder for your logic to process request_data
    # For demonstration, returning the received data as a mock response
    return jsonify({
        "received_data": request_data,
        "response": recommendation
    })

if __name__ == '__main__':
    """ WHAT I REQUIRE:
    ["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore", "offensiveTeam"]
    offensiveTeam is the team that is currently on offense (the team we want to make recommendations/analysis for)
    """
    # ["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]], df[["yardlineNumber", "quarter", "down", 'gameClock_minutes', 'gameClock_seconds', "yardsToGo", "preSnapHomeScore", "preSnapVisitorScore"]
    # EXAMPLE QUERY: http://127.0.0.1:5000/get_play_details?home_team=SF&away_team=ATL&yardlineNumber=50&quarter=1&down=2&gameClock_minutes=10&gameClock_seconds=15&yardsToGo=45&preSnapHomeScore=7&preSnapVisitorScore=5
    app.run(host='127.0.0.1', threaded=True, debug=True)
