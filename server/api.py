from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from methods import workout
from methods import overall_stats
from methods import fetch_data
from methods import calculate_overall_stats as calc

app = Flask(__name__)
CORS(app)

    

@app.route("/api/add-workout", methods = ['POST'])
def add_workout():
    try:
        data = request.get_json()
        result = workout.add_workout(data)

        return jsonify({'message': 'Workout added successfully', 'data': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/get-workouts", methods = ['GET'])
def get_workouts():
    try:
        user_id = request.args.get('user_id') 
        workout_types = fetch_data.get_workout_types(user_id)
        all_workouts = workout.get_all_workouts(workout_types)

        return jsonify({'workouts': all_workouts}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/overall-stats", methods = ['GET'])
def get_overall_stats():
    try:
        user_id = request.args.get('user_id')
        return jsonify(calc.calculate_overall_stats(user_id)), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)