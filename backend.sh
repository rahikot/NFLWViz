pip install --upgrade pip

pip install virtualenv

virtualenv dva005

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        source dva005/bin/activate
        # cse6242team030fall2023
elif [[ "$OSTYPE" == "darwin"* ]]; then
        source dva005/bin/activate
        # Mac OSX
else
      .\dva005\Scripts\activate

fi

pip install -r requirements.txt

pip install \
   --no-binary lightgbm \
   --config-settings=cmake.define.USE_OPENMP=OFF \
   'lightgbm>=4.0.0'

cd backend

python label_pbps.py

python backend_server.py