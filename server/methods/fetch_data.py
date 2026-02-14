from datetime import date
from lib.supabase import supabase

def get_workout_dates(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=True)
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