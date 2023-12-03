import joblib
import pandas as pd
import nfl_data_py as nfl
from pprint import pprint
import pandas as pd
import os

os.environ['KMP_DUPLICATE_LIB_OK']='True'

# WHOLE DATASET
df = nfl.import_pbp_data([i for i in range(1999,2021)], downcast=True, cache=False, alt_path=None)

# IF FOR DEMO/TESTING- ONLY TWO YEARS
#df = nfl.import_pbp_data([i for i in range(2019,2021)], downcast=True, cache=False, alt_path=None)

lgbm = joblib.load('backend/lgbm.pkl')



plays_df = df.join(pd.get_dummies(df['posteam'], prefix='possessionTeam'))
plays_df = plays_df.join(pd.get_dummies(plays_df['defteam'], prefix='defensiveTeam'))
plays_df = plays_df.join(pd.get_dummies(plays_df['side_of_field'], prefix='yardlineSide'))


possTeam_cols = [x for x in plays_df.columns if 'possessionTeam_' in x]
defTeam_cols = [x for x in plays_df.columns if 'defensiveTeam_' in x]
gameClock_cols = [x for x in plays_df.columns if 'gameClock_' in x]
yardlineSide_cols = [x for x in plays_df.columns if 'yardlineSide_' in x]


feats_list = ['qtr', 'down', "time", 'ydstogo', 'yardline_100', 'total_home_score', 'total_away_score']
feats_list.extend(possTeam_cols)
feats_list.extend(defTeam_cols)
feats_list.extend(gameClock_cols)
feats_list.extend(yardlineSide_cols)

plays_df = plays_df.dropna(subset=feats_list)
feats = plays_df[feats_list]


feats[['gameClock_minutes', 'gameClock_seconds']] = feats['time'].str.split(':', expand=True).astype(int)
plays_df[['gameClock_minutes', 'gameClock_seconds']] = feats[['gameClock_minutes', 'gameClock_seconds']]
feats = feats.drop("time", axis=1)
feats = feats.rename(columns={"yardline_100": "yardlineNumber", "qtr" : "quarter", "time":"gameClock", "ydstogo":"yardsToGo", "total_home_score": "preSnapHomeScore", "total_away_score": "preSnapVisitorScore"})

order = ['quarter',
 'down',
 'yardsToGo',
 'yardlineNumber',
 'preSnapHomeScore',
 'preSnapVisitorScore',
 'possessionTeam_ARI',
 'possessionTeam_ATL',
 'possessionTeam_BAL',
 'possessionTeam_BUF',
 'possessionTeam_CAR',
 'possessionTeam_CHI',
 'possessionTeam_CIN',
 'possessionTeam_CLE',
 'possessionTeam_DAL',
 'possessionTeam_DEN',
 'possessionTeam_DET',
 'possessionTeam_GB',
 'possessionTeam_HOU',
 'possessionTeam_IND',
 'possessionTeam_JAX',
 'possessionTeam_KC',
 'possessionTeam_LA',
 'possessionTeam_LAC',
 'possessionTeam_LV',
 'possessionTeam_MIA',
 'possessionTeam_MIN',
 'possessionTeam_NE',
 'possessionTeam_NO',
 'possessionTeam_NYG',
 'possessionTeam_NYJ',
 'possessionTeam_PHI',
 'possessionTeam_PIT',
 'possessionTeam_SEA',
 'possessionTeam_SF',
 'possessionTeam_TB',
 'possessionTeam_TEN',
 'possessionTeam_WAS',
 'defensiveTeam_ARI',
 'defensiveTeam_ATL',
 'defensiveTeam_BAL',
 'defensiveTeam_BUF',
 'defensiveTeam_CAR',
 'defensiveTeam_CHI',
 'defensiveTeam_CIN',
 'defensiveTeam_CLE',
 'defensiveTeam_DAL',
 'defensiveTeam_DEN',
 'defensiveTeam_DET',
 'defensiveTeam_GB',
 'defensiveTeam_HOU',
 'defensiveTeam_IND',
 'defensiveTeam_JAX',
 'defensiveTeam_KC',
 'defensiveTeam_LA',
 'defensiveTeam_LAC',
 'defensiveTeam_LV',
 'defensiveTeam_MIA',
 'defensiveTeam_MIN',
 'defensiveTeam_NE',
 'defensiveTeam_NO',
 'defensiveTeam_NYG',
 'defensiveTeam_NYJ',
 'defensiveTeam_PHI',
 'defensiveTeam_PIT',
 'defensiveTeam_SEA',
 'defensiveTeam_SF',
 'defensiveTeam_TB',
 'defensiveTeam_TEN',
 'defensiveTeam_WAS',
 'gameClock_minutes',
 'gameClock_seconds',
 'yardlineSide_ARI',
 'yardlineSide_ATL',
 'yardlineSide_BAL',
 'yardlineSide_BUF',
 'yardlineSide_CAR',
 'yardlineSide_CHI',
 'yardlineSide_CIN',
 'yardlineSide_CLE',
 'yardlineSide_DAL',
 'yardlineSide_DEN',
 'yardlineSide_DET',
 'yardlineSide_GB',
 'yardlineSide_HOU',
 'yardlineSide_IND',
 'yardlineSide_JAX',
 'yardlineSide_KC',
 'yardlineSide_LA',
 'yardlineSide_LAC',
 'yardlineSide_LV',
 'yardlineSide_MIA',
 'yardlineSide_MIN',
 'yardlineSide_NE',
 'yardlineSide_NO',
 'yardlineSide_NYG',
 'yardlineSide_NYJ',
 'yardlineSide_PHI',
 'yardlineSide_PIT',
 'yardlineSide_SEA',
 'yardlineSide_SF',
 'yardlineSide_TB',
 'yardlineSide_TEN',
 'yardlineSide_WAS']

feats = feats[order]

plays_df["predDef"] = lgbm.predict(feats[order])
plays_df = plays_df.rename(columns={"yardline_100": "yardlineNumber", "qtr" : "quarter", "time":"gameClock", "ydstogo":"yardsToGo", "total_home_score": "preSnapHomeScore", "total_away_score": "preSnapVisitorScore"})
plays_df.reset_index().drop("index", axis=1).to_csv("backend/data/plays.csv")