from datetime import date, timedelta
from collections import defaultdict
from lib.supabase import supabase

def current_streak(data, current):
    if worked_out_today(data): 
        streak = 1
        data = data[1:]
    else: streak = 0

    current -= timedelta(days=1)

    for row in data:
        row = date.fromisoformat(row['date'])
        if row == current: streak += 1
        else: break
        current -= timedelta(days=1)
    
    return streak

def workout_percentage_overall(data, current_day):
    if not data:
        return 0

    first_day = date.fromisoformat(data[-1]['date'])

    time_difference = current_day - first_day
    if worked_out_today(data): total_days = time_difference.days + 1
    else: total_days = time_difference.days
    days_worked_out = len(data)

    workout_percentage = days_worked_out/total_days * 100

    rounded = round(workout_percentage, 1)

    return rounded

def worked_out_today(data) -> bool:
    if not data:
        return False
    return date.fromisoformat(data[0]['date']) == date.today()

def workout_distribution(data):
    workouts = defaultdict(int)
    for row in data:
        workout_type = row['workout_type']
        workouts[workout_type] += 1
    
    data = {
        'labels': list(workouts.keys()),
        'data': list(workouts.values()),
    }
    return data

