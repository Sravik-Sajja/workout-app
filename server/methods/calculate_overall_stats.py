from methods import fetch_data
from methods import overall_stats

def calculate_overall_stats(user_id):
    current_date = fetch_data.get_current_date()
    oldest_date = fetch_data.get_oldest_date(user_id)

    workout_dates_des = fetch_data.get_workout_dates_descending(user_id)
    workout_dates_asc = fetch_data.get_workout_dates_ascending(user_id)

    current_streak = overall_stats.current_streak(workout_dates_des, current_date)
    longest_streak, longest_streak_start, longest_streak_end = overall_stats.longest_streak(workout_dates_asc, oldest_date)

    percentage = overall_stats.workout_percentage_overall(workout_dates_des, current_date)

    workout_types = fetch_data.get_workout_types(user_id)
    workout_dis = overall_stats.workout_distribution(workout_types)

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "longest_streak_start": str(longest_streak_start),
        "longest_streak_end": str(longest_streak_end),
        "percentage": percentage,
        "workoutDis": workout_dis,
    }
