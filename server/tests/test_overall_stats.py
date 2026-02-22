import unittest
from datetime import date
from methods import overall_stats

class TestOverallStats(unittest.TestCase):
    #testing current streak
    def test_current_streak_without_today(self):
        days_worked_out = [{'date': '2026-02-13'}, {'date': '2026-02-12'}, {'date': '2026-02-11'},]
        current_date = date(2026, 2, 14)

        self.assertEqual(overall_stats.current_streak(days_worked_out, current_date), 3)

    def test_current_streak_with_today(self):
        days_worked_out = [{'date': '2026-02-14'}, {'date': '2026-02-13'}, {'date': '2026-02-12'}, {'date': '2026-02-11'},]
        current_date = date(2026, 2, 14)

        self.assertEqual(overall_stats.current_streak(days_worked_out, current_date), 4)
    
    def test_current_streak_with_no_workouts_in_last_two(self):
        days_worked_out = [{'date': '2026-02-12'}, {'date': '2026-02-11'},]
        current_date = date(2026, 2, 14)

        self.assertEqual(overall_stats.current_streak(days_worked_out, current_date), 0)
    
    def test_current_streak_accounts_for_break_in_streak(self):
        days_worked_out = [{'date': '2026-02-14'}, {'date': '2026-02-13'}, {'date': '2026-02-11'},]
        current_date = date(2026, 2, 14)

        self.assertEqual(overall_stats.current_streak(days_worked_out, current_date), 2)
    
    #testing longest streak
    def test_longest_streak_with_gap(self):
        days_worked_out = [{'date': '2026-02-11'}, {'date': '2026-02-12'}, {'date': '2026-02-14'},]
        oldest_date = date(2026, 2, 11)

        self.assertEqual(overall_stats.longest_streak(days_worked_out, oldest_date), (2, date(2026, 2, 11), date(2026, 2, 12)))
    
    def test_longest_streak_is_current(self):
        days_worked_out = [{'date': '2026-02-11'}, {'date': '2026-02-13'}, {'date': '2026-02-14'},]
        oldest_date = date(2026, 2, 11)

        self.assertEqual(overall_stats.longest_streak(days_worked_out, oldest_date), (2, date(2026, 2, 13), date(2026, 2, 14)))
    
    def test_longest_streak_is_all(self):
        days_worked_out = [{'date': '2026-02-10'}, {'date': '2026-02-11'}, {'date': '2026-02-12'}, {'date': '2026-02-13'}, {'date': '2026-02-14'},]
        oldest_date = date(2026, 2, 10)

        self.assertEqual(overall_stats.longest_streak(days_worked_out, oldest_date), (5, date(2026, 2, 10), date(2026, 2, 14)))
    
    def test_longest_streak_is_tied(self):
        days_worked_out = [{'date': '2026-02-10'}, {'date': '2026-02-11'}, {'date': '2026-02-13'}, {'date': '2026-02-14'},]
        oldest_date = date(2026, 2, 10)

        self.assertEqual(overall_stats.longest_streak(days_worked_out, oldest_date), (2, date(2026, 2, 10), date(2026, 2, 11)))
    
    def test_longest_streak_single_day(self):
        days_worked_out = [{'date': '2026-02-10'}]
        oldest_date = date(2026, 2, 10)

        self.assertEqual(overall_stats.longest_streak(days_worked_out, oldest_date), (1, date(2026, 2, 10), date(2026, 2, 10)))
    
    #testing workout percentage
    def test_workout_percentage_without_today(self):
        days_worked_out = [{'date': '2026-02-13'}, {'date': '2026-02-12'}, {'date': '2026-02-11'}, {'date': '2026-02-09'}]
        current_date = date(2026, 2, 14)

        self.assertEqual(overall_stats.workout_percentage_overall(days_worked_out, current_date), 80.0)
    
    def test_workout_percentage_with_today(self):
        days_worked_out = [{'date': '2026-02-14'}, {'date': '2026-02-13'}, {'date': '2026-02-11'},]
        current_date = date(2026, 2, 14)

        self.assertEqual(overall_stats.workout_percentage_overall(days_worked_out, current_date), 75.0)
    
    #testing workout distribution
    def test_workout_distribution_returns_correct_count(self):
        all_workout_types = [{'workout_type': 'Legs'}, {'workout_type': 'Push'}, {'workout_type': 'Pull'}, {'workout_type': 'Pull'}]
        expected_result = {'labels': ['Legs', 'Push', 'Pull'], 'data': [1,1,2]}

        self.assertEqual(overall_stats.workout_distribution(all_workout_types), expected_result)
    
    def test_no_duplicate_days_removes_duplicates(self):
        days_worked_out = [{'date': '2026-02-13'}, {'date': '2026-02-13'}, {'date': '2026-02-12'}, {'date': '2026-02-09'}]
        expected_result = [{'date': '2026-02-13'}, {'date': '2026-02-12'}, {'date': '2026-02-09'}]

        self.assertEqual(overall_stats._no_duplicate_days(days_worked_out), expected_result)

if __name__ == '__main__':
    unittest.main()