from methods import fetch_data
from methods import overall_stats
from datetime import date, timedelta

def calculate_overall_stats(user_id):
    current_date = fetch_data.get_current_date()
    oldest_date = fetch_data.get_oldest_date(user_id)

    workout_dates_des = fetch_data.get_workout_dates_descending(user_id)
    workout_dates_asc = fetch_data.get_workout_dates_ascending(user_id)

    current_streak = overall_stats.current_streak(workout_dates_des, current_date)
    longest_streak, longest_streak_start, longest_streak_end = overall_stats.longest_streak(workout_dates_asc, oldest_date)

    percentage = overall_stats.workout_percentage_overall(workout_dates_des, current_date)
    best_month_percentage, best_month_name = overall_stats.best_month_overall(workout_dates_asc, oldest_date)

    workout_types = fetch_data.get_workout_types(user_id, oldest_date)
    workout_dis = overall_stats.workout_distribution(workout_types)

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "longest_streak_start": str(longest_streak_start),
        "longest_streak_end": str(longest_streak_end),
        "overall_percentage": percentage,
        "best_month_percentage": best_month_percentage,
        "best_month_name": best_month_name,
        "workout_dis": workout_dis,
    }

def calculate_recent_stats(user_id):
    current_date = fetch_data.get_current_date()
    oldest_date = current_date - timedelta(days=30)

    workout_dates_des = fetch_data.get_workout_dates_descending(user_id)
    workout_dates_asc = fetch_data.get_workout_dates_ascending(user_id)

    filtered_workout_dates_des = filter_dates(workout_dates_des, oldest_date)
    filtered_workout_dates_asc = filter_dates(workout_dates_asc, oldest_date)

    longest_streak, longest_streak_start, longest_streak_end = overall_stats.longest_streak(filtered_workout_dates_asc, oldest_date)
    percentage = overall_stats.workout_percentage_overall(filtered_workout_dates_des, current_date)

    workout_types = fetch_data.get_workout_types(user_id, oldest_date)
    workout_dis = overall_stats.workout_distribution(workout_types)

    return {
        "longest_streak": longest_streak,
        "longest_streak_start": str(longest_streak_start),
        "longest_streak_end": str(longest_streak_end),
        "overall_percentage": percentage,
        "workout_dis": workout_dis,
    }

def filter_dates(dates, oldest_date):
    filtered = []
    for row in dates:
        current_date = date.fromisoformat(row['date'])
        if current_date>=oldest_date: filtered.append(row)
    return filtered

