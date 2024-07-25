** Instructions to start the applications **

Install Flask: First, create a virtual environment and install Flask along with other necessary packages:
bash
Copy code
python3 -m venv venv
source venv/bin/activate
pip install Flask psycopg2-binary Flask-SQLAlchemy Flask-SocketIO
Flask Configuration
Install Dependencies
Make sure you have the psycopg2-binary library installed in your Flask environment, as it's used to connect to PostgreSQL databases.
bash
Copy code
pip install psycopg2-binary


Create React App: Use create-react-app to set up the frontend.
bash
Copy code
npx create-react-app testcase-frontend
cd testcase-frontend
npm install axios socket.io-client


Start the Flask server:
bash
Copy code
python app.py
Start the React app:
bash
Copy code
npm start
