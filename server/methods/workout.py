from lib.supabase import supabase

def add_workout(data):
    date = data.get('date')
    workout_type = data.get('workout_type')
    user_id = data.get('user_id')

    workout = {
        "UUID": user_id,
        "date": date,
        "workout_type": workout_type,
    }

    try:
        response = supabase.table("Workouts").upsert(workout).execute()
    except Exception as e:
        print("Error inserting:", e)
        raise

    return {
        'user_id': user_id,
        'date': date,
        'workout_type': workout_type
    }

def get_all_workouts(user_id):
    response = (
        supabase.table("Workouts")
        .select("workout_type") 
        .eq("UUID", user_id)
        .execute()
    )
    data = response.data

    workout_types = set()
    for row in data:
        workout = row['workout_type']
        workout_types.add(workout)
    
    return list(workout_types)
