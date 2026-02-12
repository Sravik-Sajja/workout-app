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
    
    return {
        'streak': streak
    }

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
            'backgroundColor': ['red', 'yellow', 'orange']
        }]
    }
    return data

