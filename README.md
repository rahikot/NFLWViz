# DVA-Project

## Georgia Tech CSE 6242 Fall 2023 Team 030 Final Project

NFL W-VIZ

Neil Patel, Rahi Kotadia, Arnav Hiray, Abhinav Gullapalli, Sarang Desai

## Description

We visualize and predict plays from Week 1 of the NFL Big Data Bowl 2023 (https://www.kaggle.com/competitions/nfl-big-data-bowl-2023) Kaggle competition dataset. 

Frontend has been developed with HTML, CSS, Javascript, and D3.js. 

Backend has been developed with Python and Flask to run server-side machine learning model inference in real-time and compute statistics for visualizations on the frontend.

Our machine learning models include a LightGBM model to predict the defensive play and a K Nearest Neighbor model with Gower similarity distance metric to recommend an offensive play. We also use the LightGBM model to (noisily) annotate a larger NFL play-by-play dataset (https://github.com/CroppedClamp/nfl_pbps) covering plays since 1999.

## Installation & Execution

## Frontend
1. Download ```week1.csv``` from https://www.kaggle.com/competitions/nfl-big-data-bowl-2023/data?select=week1.csv and save ```week1.csv``` in the ```./frontend``` directory.
2. From the ```./``` directory, run ```./frontend.sh```. This script file performs the following tasks:

    a) starts the frontend http server on ```localhost:8000```

3. Go to ```localhost:8000``` in your browser (we recommend Google Chrome).

## Backend

1. From the ```./``` directory, run ```./backend.sh```. This script file performs the following tasks:

    a) set up virtual environment

        i) run ```$pip install virtualenv```

        ii) run ```$virtualenv cse6242team030fall2023``` to create the virtual environment for this project

        iii) activate the virtual environment (script only tested on macOS, steps can be manually performed if facing errors on other OS)
    
    b) install the required Python dependencies

    c) run labels_pbps.py to (noisily) annotate the nfl_pbps dataset with defense formation predictions from LightGBM inference

    d) start Flask server on ```localhost:5000```
