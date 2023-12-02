# DVA-Project


## Frontend
1. Download ```week1.csv``` from https://www.kaggle.com/competitions/nfl-big-data-bowl-2023/data?select=week1.csv and save ```week1.csv``` in the ```./frontend``` directory.
2. From the ```./frontend``` directory, run ```$python -m http.server```. The frontend should be accessible at ```localhost:8000```.

## Backend
1. Run ```$pip install virtualenv``` if you do not have Python virtual environments set up locally.
2. Run ```$virtualenv cse6242team030fall2023``` to create the a virtual environment for this project.
3. Activate the virtual environment.
    a) On Windows, run ```$.\cse6242team030fall2023\Scripts\activate```.
    b) On macOS or Linux, run ```$source cse6242team030fall2023/bin/activate```.
4. Install required dependencies with ```$pip install requirements.txt```
5. From the ```./backend``` directory, run ```$python backend_server.py```. Flask server should start on ```localhost:5000```.
