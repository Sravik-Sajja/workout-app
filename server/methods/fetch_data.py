from datetime import date
from lib.supabase import supabase

#used for current streak and overall percentage calculation
def get_workout_dates_descending(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=True)
        .execute()
    )
    return response.data

#used for longest streak and best month calculation
def get_workout_dates_ascending(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=False)
        .execute()
    )
    return response.data

#used to show pre-existing workouts and for distribution calculation
def get_workout_types(user_id, oldest_date):
    response = (
        supabase.table("Workouts")
        .select("workout_type") 
        .eq("UUID", user_id)
        .gte("date", oldest_date)
        .execute()
    )

    return response.data

#used to show a past specific workout and its details
def get_specific_workout(user_id, date):
    response_of_workouts = (
        supabase.table("Workouts")
        .select("workout_type", "workout_id") 
        .eq("UUID", user_id)
        .eq("date", date)
        .execute()
    )

    workout_id = response_of_workouts.data[0]["workout_id"]
    workout_type = response_of_workouts.data[0]["workout_type"]
    all_exercises = _fetch_exercises(workout_id)
    return workout_type, all_exercises
    
#used to get exercises that a user has previously used for a workout
def get_recent_exercises(user_id, workout_type):
    response_from_workouts = (
        supabase.table("Workouts")
        .select("workout_id") 
        .eq("UUID", user_id)
        .eq("workout_type", workout_type)
        .order("date", desc=True)
        .execute()
    )
    if not response_from_workouts.data:
        return []

    last_workout = response_from_workouts.data[0]['workout_id']

    return _fetch_exercises(last_workout)

def get_weight_data_for_exercise(user_id, exercise_type):
    response_from_exercises = (
        supabase.table("Exercises")
        .select("exercise_id")
        .eq("UUID", user_id)
        .eq("exercise_type", exercise_type)
        .order("date", desc=False)
        .execute()
    )
    weight_data = []
    for exercise in response_from_exercises.data:
        response_from_sets = (
            supabase.table("Sets")
            .select("weight, reps, set_number, date")
            .eq("exercise_id", exercise['exercise_id'])
            .execute()
        )
        for cycle in response_from_sets.data:
            weight_data.append({
                "date": cycle['date'],
                "set_number": cycle['set_number'],
                "weight": cycle['weight'],
                "reps": cycle['reps']
            })
    return weight_data


def get_current_date():
    return date.today()

def get_oldest_date(user_id):
    data = get_workout_dates_ascending(user_id)
    if not data:
        return None
    oldest_date = data[0]
    return date.fromisoformat(oldest_date['date'])
    

def _fetch_exercises(workout_id):
    response_from_exercises = (
        supabase.table("Exercises")
        .select("exercise_id, exercise_type") 
        .eq("workout_id", workout_id)
        .execute()
    )

    exercises = []
    for exercise in response_from_exercises.data:
        response_from_sets = (
            supabase.table("Sets")
            .select("weight, reps")
            .eq("exercise_id", exercise['exercise_id'])
            .order("set_number", desc=False)
            .execute()
        )
        
        exercises.append({
            'name': exercise['exercise_type'],
            'sets': [{'weight': s['weight'], 'reps': s['reps']} for s in response_from_sets.data]
        })
    
    return exercises