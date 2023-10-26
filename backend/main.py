import json
import os

# Function that reads a given directory of JSON files with no extra preprocessing
def readFolderDirectoty(directory):
    if not (os.path.exists(directory)) or not (os.path.isdir(directory)):
        raise ValueError(f"{directory} is invalid")

    files = os.listdir(directory)
    output = {}
    for fileName in files:
        if fileName.endswith(".json"):
            filePath = os.path.join(directory, fileName)
            with open (filePath, 'r') as json_file:
                try:
                    data = json.load(json_file)
                    if len(data.keys()) == 1:
                        key = list(data.keys())[0]
                        value = data[key]
                        output[key] = value
                    else:
                        print(data.keys())
                        raise ValueError(f"More than one key found for {fileName}")

                except json.JSONDecodeError:
                    print(f"Error decoding JSON for file {fileName}")

    return output

#Code takes roughly 20 seconds to execute
if __name__ == "__main__":
    regSeasonDataDirectory = os.path.dirname(os.path.realpath(__file__)) + '/data/nfl_pbps-master/reg'
    postSeasonDataDirectory = os.path.dirname(os.path.realpath(__file__)) + '/data/nfl_pbps-master/post'
    regData = readFolderDirectoty(regSeasonDataDirectory) #5520 games
    postSeasonData = readFolderDirectoty(postSeasonDataDirectory) #230 games

    # TODO: Further preprocessing of regular season data and post season data (by game, by player, by category, etc.)
    #  Current format is all JSON files similar to https://github.com/CroppedClamp/nfl_pbps/tree/master