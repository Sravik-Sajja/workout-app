from datetime import date, timedelta
from collections import defaultdict
from lib.supabase import supabase

def current_streak(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=True)
        .execute()
    )

    data = response.data
    
    current = date.today()
    streak = 0
    for row in data:
        row = date.fromisoformat(row['date'])
        if streak == 0:
            if row == current: streak += 1
            elif row == current-timedelta(days=1):
                current -= timedelta(days=1)
                streak += 1
            else: break
        else:
            if row == current: streak += 1
            else: break
        current -= timedelta(days=1)
    
    return streak

def workout_percentage_overall(user_id):
    response = (
        supabase.table("Workouts")
        .select("date") 
        .eq("UUID", user_id)
        .order("date", desc=False)
        .execute()
    )

    data = response.data
    first_day = date.fromisoformat(data[0]['date'])
    current_day = date.today()

    time_difference = current_day - first_day
    total_days = time_difference.days
    days_worked_out = len(data)

    workout_percentage = days_worked_out/total_days * 100

    rounded = round(workout_percentage, 1)

    return rounded

def workout_distribution(user_id):
    response = (
        supabase.table("Workouts")
        .select("workout_type") 
        .eq("UUID", user_id)
        .execute()
    )

    data = response.data

    workouts = defaultdict(int)
    for row in data:
        workout_type = row['workout_type']
        workouts[workout_type] += 1
    
    data = {
        'labels': list(workouts.keys()),
        'datasets': [{
            'data': list(workouts.values()),
        }]
    }
    return data

