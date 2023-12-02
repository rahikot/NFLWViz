# DVA-Project - Georgia Tech CSE 6242 Fall 2023 Team 030 Final Project

NFL W-VIZ

Neil Patel, Rahi Kotadia, Arnav Hiray, Abhinav Gullapalli, Sarang Desai

## Description

We visualize and predict plays from Week 1 of the Kaggle 2023 Big Data Bowl competition dataset. Frontend has been developed with HTML, CSS, Javascript, and D3.js. Backend has been developed with Python and Flask to run server-side machine learning model inference in real-time and compute statistics for visualizations on the frontend.

## Installation & Execution

## Frontend
1. Download ```week1.csv``` from https://www.kaggle.com/competitions/nfl-big-data-bowl-2023/data?select=week1.csv and save ```week1.csv``` in the ```./frontend``` directory.
2. From the ```./frontend``` directory, run ```$python -m http.server```. The frontend should be accessible at ```localhost:8000```.

## Backend
1. Run ```$pip install virtualenv``` if you do not have Python virtual environments set up locally.
2. Run ```$virtualenv cse6242team030fall2023``` to create the a virtual environment for this project.
3. Activate the virtual environment.

    a) On Windows, run ```$.\cse6242team030fall2023\Scripts\activate```.

    b) On macOS or Linux, run ```$source cse6242team030fall2023/bin/activate```.

4. From the ```./``` directory, install required dependencies with ```$pip install -r requirements.txt```.
5. From the ```./backend``` directory, run ```$python backend_server.py```. Flask server should start on ```localhost:5000```.
