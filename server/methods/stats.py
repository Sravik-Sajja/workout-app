from datetime import date, timedelta
from collections import defaultdict

def current_streak(connection, user_id=1):
    query = f"SELECT date FROM workouts WHERE user_id = {user_id} ORDER BY date DESC"
    cursor = connection.execute(query)
    
    current = date.today()
    streak = 0
    for row in cursor:
        row = date.fromisoformat(row[0])
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

def workout_distribution(connection, user_id = 1):
    query = f"SELECT workout_type FROM workouts WHERE user_id = {user_id}"
    cursor = connection.execute(query)

    workouts = defaultdict(int)
    for row in cursor:
        workout_type = row[0]
        workouts[workout_type] += 1
    
    data = {
        'labels': list(workouts.keys()),
        'datasets': [{
            'data': list(workouts.values()),
            'backgroundColor': ['red', 'yellow', 'orange']
        }]
    }
    return data

