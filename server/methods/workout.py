from lib.supabase import supabase

def add_workout(data):
    date = data.get('date')
    workout_type = data.get('workout_type')
    user_id = data.get('user_id')
    exercises = data.get('exercises')

    workout = {
        "UUID": user_id,
        "date": date,
        "workout_type": workout_type,
    }
    workout_id = add_to_workout(workout)

    for exercise in exercises:
        exercise_name = {
            "workout_id": workout_id,
            "exercise_type": exercise['name'],
            "UUID": user_id,
            "date": date
        }
        exercise_id = add_to_exercises(exercise_name)
        count_sets = 1
        for set_data in exercise['sets']:
            set_info = {
                "exercise_id": exercise_id,
                "weight": set_data['weight'],
                "set_number": count_sets,
                "reps": set_data['reps'],
                "UUID": user_id,
                "date": date
            }
            add_to_sets(set_info)
            count_sets+=1

    return {
        'user_id': user_id,
        'date': date,
        'workout_type': workout_type,
        'exercises': exercises
    }

def add_to_workout(workout):
    try:
        response = supabase.table("Workouts").upsert(workout).execute()
    except Exception as e:
        print("Error inserting:", e)
        raise
    return response.data[0]['workout_id']

def add_to_exercises(exercise):
    try:
        response = supabase.table("Exercises").upsert(exercise).execute()
    except Exception as e:
        print("Error inserting:", e)
        raise
    return response.data[0]['exercise_id']

def add_to_sets(sets):
    try:
        response = supabase.table("Sets").upsert(sets).execute()
    except Exception as e:
        print("Error inserting:", e)
        raise

def get_all_workouts(data):
    workout_types = set()
    for row in data:
        workout = row['workout_type']
        workout_types.add(workout)
    
    return list(workout_types)
