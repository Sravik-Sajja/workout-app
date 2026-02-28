import unittest
from datetime import date
from methods import calculate_stats

class TestFilterDates(unittest.TestCase):
    def test_filtering_dates_only_keeps_less_than_oldest_date(self):
        days_worked_out = [{'date': '2026-02-13'}, {'date': '2026-02-12'}, {'date': '2026-02-11'},]
        oldest_date =  date(2026, 2, 12)
        result = calculate_stats.filter_dates(days_worked_out, oldest_date)
        self.assertEqual(result, [{'date': '2026-02-13'}, {'date': '2026-02-12'}])
    
    def test_returns_empty_list_when_all_dates_too_old(self):
        days_worked_out = [{'date': '2026-01-01'}, {'date': '2026-01-02'}]
        oldest_date = date(2026, 2, 1)
        result = calculate_stats.filter_dates(days_worked_out, oldest_date)
        self.assertEqual(result, [])
    
    def test_returns_all_dates_when_all_within_range(self):
        days_worked_out = [{'date': '2026-02-20'}, {'date': '2026-02-21'}, {'date': '2026-02-22'}]
        oldest_date = date(2026, 2, 1)
        result = calculate_stats.filter_dates(days_worked_out, oldest_date)
        self.assertEqual(result, days_worked_out)

    def test_empty_input_returns_empty_list(self):
        result = calculate_stats.filter_dates([], date(2026, 2, 1))
        self.assertEqual(result, [])

if __name__ == '__main__':
    unittest.main()