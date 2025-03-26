import pyrebase
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

