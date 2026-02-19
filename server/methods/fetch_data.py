from datetime import date
from lib.supabase import supabase

def get_workout_dates_descending(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=True)
        .execute()
    )
    return response.data

def get_workout_dates_ascending(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=False)
        .execute()
    )
    return response.data

def get_workout_types(user_id):
    response = (
        supabase.table("Workouts")
        .select("workout_type") 
        .eq("UUID", user_id)
        .execute()
    )

    return response.data

def get_current_date():
    return date.today()

def get_oldest_date(user_id):
    data = get_workout_dates_ascending(user_id)
    if not data:
        return None
    oldest_date = data[0]
    return date.fromisoformat(oldest_date['date'])