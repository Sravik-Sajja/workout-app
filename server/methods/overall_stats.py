from datetime import date, timedelta
from collections import defaultdict
from lib.supabase import supabase

def current_streak(data, current):
    if worked_out_today(data, current): 
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

def longest_streak(data, oldest_day):
    current_date = oldest_day
    max_streak = 0
    current_streak = 0
    for row in data:
        row = date.fromisoformat(row['date'])
        if row == current_date: 
            current_streak += 1
            current_date += timedelta(days=1)
        else:
            max_streak = max(max_streak, current_streak)
            current_streak = 1
            current_date = row + timedelta(days=1)
    max_streak = max(max_streak, current_streak)
    return max_streak

def workout_percentage_overall(data, current_day):
    if not data:
        return 0

    first_day = date.fromisoformat(data[-1]['date'])

    time_difference = current_day - first_day
    if worked_out_today(data, current_day): total_days = time_difference.days + 1
    else: total_days = time_difference.days
    days_worked_out = len(data)

    workout_percentage = days_worked_out/total_days * 100

    rounded = round(workout_percentage, 1)

    return rounded

def worked_out_today(data, current) -> bool:
    if not data:
        return False
    return date.fromisoformat(data[0]['date']) == current

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

