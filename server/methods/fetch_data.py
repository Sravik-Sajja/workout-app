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

#used to show workouts names in workout add and for distribution calculation
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
    all_exercises = _fetch_exercise_weight_data(workout_id)
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

    return _fetch_exercise_weight_data(last_workout)

#helper method to fetch individual exercise data and weight data for a singular workout
def _fetch_exercise_weight_data(workout_id):
    response = (
        supabase.table("Exercises")
        .select("exercise_type, Sets(weight, reps)")
        .eq("workout_id", workout_id)
        .order("exercise_id", desc=False)
        .execute()
    )

    exercises = []
    for row in response.data:
        exercises.append({
            'name': row['exercise_type'],
            'sets': [{'weight': s['weight'], 'reps': s['reps']} for s in row['Sets']]
        })
    return exercises

#gets all exercises ever done for a specific workout
def get_all_exercises_from_a_workout(user_id, workout_type):
    response = (
        supabase.table("Exercises")
        .select("exercise_type, Workouts!inner(UUID, workout_type)")
        .eq("Workouts.UUID", user_id)
        .eq("Workouts.workout_type", workout_type)
        .execute()
    )
    
    if not response.data:
        return []
    
    seen = set()
    for row in response.data:
        seen.add(row["exercise_type"])
    
    return list(seen)

#gets weght data for a specific exercise
def get_weight_data_for_exercise(user_id, exercise_type):
    response = (
        supabase.table("Exercises")
        .select("Sets(weight, reps, set_number, date)")
        .eq("UUID", user_id)
        .eq("exercise_type", exercise_type)
        .order("date", desc=False)
        .execute()
    )

    weight_data = []
    for row in response.data:
        for s in row['Sets']:
            weight_data.append({
                "date": s['date'],
                "set_number": s['set_number'],
                "weight": s['weight'],
                "reps": s['reps']
            })

    return weight_data

#for ai tips
def get_all_weight_data(user_id):
    response = (
        supabase.table("Exercises")
        .select("exercise_type, Sets(weight, reps, set_number, date)")
        .eq("UUID", user_id)
        .order("date", desc=False)
        .execute()
    )

    weight_data = []
    for row in response.data:
        for s in row["Sets"]:
            weight_data.append({
                "exercise_type": row["exercise_type"],
                "date": s["date"],
                "set_number": s["set_number"],
                "weight": s["weight"],
                "reps": s["reps"]
            })

    return weight_data

def select_weight_data_by_query(user_id, workout_type=None, start_date=None, end_date=None, exercise_type=None):
    query = (
        supabase.table("Workouts")
        .select("date, workout_type, Exercises(exercise_type, Sets(weight, reps, set_number))")
        .eq("UUID", user_id)
        .order("date", desc=False)
    )

    if start_date:
        query = query.gte("date", start_date)
    if end_date:
        query = query.lte("date", end_date)
    if workout_type:
        query = query.eq("workout_type", workout_type)

    result = query.execute().data

    # filter exercise_type
    if exercise_type:
        for workout in result:
            workout["Exercises"] = [
                e for e in workout.get("Exercises", [])
                if e["exercise_type"] == exercise_type
            ]

    return result

def get_recent_messages(user_id, limit=2):
    response = (
        supabase.table("Messages")
        .select("content, response, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return list(reversed(response.data))

def get_current_date():
    return date.today()

def get_oldest_date(user_id):
    data = get_workout_dates_ascending(user_id)
    if not data:
        return None
    oldest_date = data[0]
    return date.fromisoformat(oldest_date['date'])