from datetime import date, timedelta
import calendar
from collections import defaultdict
from lib.supabase import supabase

def current_streak(data, current):
    data = _no_duplicate_days(data)
    if _worked_out_today(data, current): 
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
    data = _no_duplicate_days(data)
    current_date = oldest_day
    max_streak = 0
    max_start_date = max_end_date = ""
    current_start_date = oldest_day

    current_streak = 0
    for row in data:
        row = date.fromisoformat(row['date'])
        if row == current_date: 
            current_streak += 1
            current_date += timedelta(days=1)
        else:
            if max_streak<current_streak:
                max_streak, max_start_date, max_end_date = _set_max_date(current_streak, current_start_date, current_date)
            current_streak = 1
            current_start_date = row
            current_date = row + timedelta(days=1)
    
    if max_streak<current_streak:
                max_streak, max_start_date, max_end_date = _set_max_date(current_streak, current_start_date, current_date)

    return max_streak, max_start_date, max_end_date

def workout_percentage_overall(data, current_day):
    if not data:
        return 0
    
    data = _no_duplicate_days(data)
    first_day = date.fromisoformat(data[-1]['date'])

    time_difference = current_day - first_day
    if _worked_out_today(data, current_day): total_days = time_difference.days + 1
    else: total_days = time_difference.days
    days_worked_out = len(data)

    workout_percentage = days_worked_out/total_days * 100

    rounded = round(workout_percentage, 1)

    return rounded

def best_month_overall(data, oldest_date):
    if oldest_date == None: return(0, None)
    current_date = oldest_date

    max_month_name = None
    max_percentage = 0

    while current_date<date.today():
        _, num_days = calendar.monthrange(current_date.year, current_date.month)
        end_of_month_date = current_date.replace(day=num_days)

        num_workouts = sum(1 for row in data 
                          if current_date <= date.fromisoformat(row['date']) <= end_of_month_date)
        total_days = num_days
        workout_percentage = num_workouts/total_days * 100
        rounded = round(workout_percentage, 1)

        if rounded>max_percentage:
            max_percentage = rounded
            max_month_name = current_date.strftime('%B %Y')
        
        current_date = end_of_month_date + timedelta(days=1)

    return max_percentage, max_month_name

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

def _no_duplicate_days(data):
    no_dup = []
    for row in data:
        if row not in no_dup: no_dup.append(row)
    return no_dup

def _worked_out_today(data, current) -> bool:
    if not data:
        return False
    return date.fromisoformat(data[0]['date']) == current

def _set_max_date(current_streak, current_start_date, current_date):
    max_streak = current_streak
    max_start_date = current_start_date
    max_end_date = current_date - timedelta(days=1)

    return max_streak, max_start_date, max_end_date

