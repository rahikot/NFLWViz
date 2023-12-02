pip install --upgrade pip

pip install virtualenv

virtualenv cse6242team030fall2023

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        source cse6242team030fall2023/bin/activate
        # cse6242team030fall2023
elif [[ "$OSTYPE" == "darwin"* ]]; then
        source cse6242team030fall2023/bin/activate
        # Mac OSX
else
      .\cse6242team030fall2023\Scripts\activate

fi

pip install -r requirements.txt

pip install \
   --no-binary lightgbm \
   --config-settings=cmake.define.USE_OPENMP=OFF \
   'lightgbm>=4.0.0'

cd backend

python label_pbps.py

python backend_server.py