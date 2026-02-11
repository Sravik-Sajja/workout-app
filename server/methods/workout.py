def add_workout(data, connection):
    date = data.get('date')
    workout_type = data.get('workout_type')
    user_id = 1 #temporary

    query = "INSERT INTO workouts (user_id, date, workout_type) VALUES (?, ?, ?)"
    params = [user_id, date, workout_type]

    cursor = connection.execute(query, params)
    connection.commit()
    workout_id = cursor.lastrowid

    return {
        'id': workout_id,
        'user_id': user_id,
        'date': date,
        'workout_type': workout_type
    }