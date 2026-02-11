from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from methods import workout

app = Flask(__name__)
CORS(app)

def get_db_connection():
    connection = sqlite3.connect('workout.db')
    connection.execute('PRAGMA foreign_keys = ON;')
    return connection
    

@app.route("/api/add-workout", methods = ['POST'])
def add_workout():
    try:
        data = request.get_json()
        connection = get_db_connection()
        result = workout.add_workout(data, connection)
        connection.close()

        return jsonify({'message': 'Workout added successfully', 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)