from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from methods import workout
from methods import overall_stats
from methods import fetch_data

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
        current_date = fetch_data.get_current_date()
        oldest_date = fetch_data.get_oldest_date(user_id)
        workout_dates_des = fetch_data.get_workout_dates_descending(user_id)
        workout_dates_asc = fetch_data.get_workout_dates_ascending(user_id)

        current_streak = overall_stats.current_streak(workout_dates_des, current_date)
        longest_streak = overall_stats.longest_streak(workout_dates_asc, oldest_date)
        percentage = overall_stats.workout_percentage_overall(workout_dates_des, current_date)

        workout_types = fetch_data.get_workout_types(user_id)
        workout_dis = overall_stats.workout_distribution(workout_types)

        return jsonify({'streak': current_streak, 'longest': longest_streak, 'percentage': percentage, 'workoutDis': workout_dis}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)