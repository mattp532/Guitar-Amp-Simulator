from flask import Flask, session, jsonify, request
from flask_cors import CORS
import pyrebase

app = Flask(__name__)
app.secret_key = 'secret'

# Enhanced CORS configuration
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173"],
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

config = {
    "apiKey": "AIzaSyDEKNJ2S5TK_HtZ9Uw9iombc-Ol-z4-GGU",
    "authDomain": "your-auth-domain",
    "databaseURL": "your-database-url",
    "projectId": "your-project-id",
    "storageBucket": "your-storage-bucket",
    "messagingSenderId": "your-sender-id",
    "appId": "your-app-id",
    "measurementId": "your-measurement-id"
}
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

app.secret_key = 'secret'

@app.route('/', methods=['POST', 'GET', 'OPTIONS'])
def index():
    if request.method == 'OPTIONS':
        return jsonify({'message': 'Preflight OK'}), 200
        
    if 'user' in session:
        return jsonify({'message': f'Hi, {session["user"]}', 'logged_in': True})

    if request.method == 'POST':
        # Your existing login logic
        return jsonify({'message': 'Login successful', 'logged_in': True, 'user': email})

    return jsonify({'message': 'Welcome'})

if __name__ == '__main__':
    app.run(port=1111)