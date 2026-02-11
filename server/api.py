from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
from methods import workout

app = Flask(__name__)
CORS(app)

connection = sqlite3.connect('workout.db')
connection.execute('PRAGMA foreign_keys = ON;')

@app.route("/api/add-workout", methods = ['POST'])
def add_workout():
    global connection
    data = request.get_json()

    workout.add_workout(data, connection)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)