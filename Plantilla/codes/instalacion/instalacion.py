"""
# Clonar el repositorio desde GitHub
git clone https://github.com/Monte-10/TFG

# Acceder a la carpeta del backend
cd TFG/fitfuelbalance/

# Instalar las dependencias necesarias
pip install -r requirements.txt

# Ejecutar el servidor utilizando make
make all-run

# Alternativa: Ejecutar los comandos manualmente
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver

# Acceder a la carpeta del frontend
cd TFG/fitfuel-app/

# Instalar las dependencias necesarias
npm install

# Usar la versión correcta de Node.js con nvm
nvm use 16

# Ejecutar la aplicación del frontend
npm start

# Acceder a la carpeta del frontend móvil
cd TFG/fitfuelmobile/

# Instalar las dependencias necesarias
npm install

# Ejecutar la aplicación del frontend móvil
npm start

# Alternativamente, para ejecutar en un dispositivo Android
npx react-native run-android

# Alternativamente, para ejecutar en un dispositivo iOS (solo en macOS)
npx react-native run-ios
"""
