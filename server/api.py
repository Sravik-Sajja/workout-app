from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from methods import workout
from methods import overall_stats

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

@app.route("/api/streak", methods = ['GET'])
def get_streak():
    try:
        user_id = request.args.get('user_id') 
        streak = overall_stats.current_streak(user_id)

        return jsonify({'streak': streak}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/percentage", methods = ['GET'])
def get_percentage():
    try:
        user_id = request.args.get('user_id') 
        percentage = overall_stats.workout_percentage_overall(user_id)

        return jsonify({'percentage': percentage}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/distribution", methods = ['GET'])
def get_distribution():
    try:
        user_id = request.args.get('user_id') 
        workout_dis = overall_stats.workout_distribution(user_id)

        return jsonify({'workoutDis': workout_dis}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)