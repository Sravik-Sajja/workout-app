import unittest
from methods import weight_stats

class TestWeightStats(unittest.TestCase):
    def test_calculating_one_rep_max(self):
        data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 90, 'reps': 9}]
        expected_result = 115.7
        self.assertEqual(weight_stats.get_one_rep_max(data), expected_result)
    
    def test_calculating_one_rep_max_with_multiple_sets(self):
        data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 90, 'reps': 9}, {'date': '2026-02-29', 'set_number': 1, 'weight': 100, 'reps': 9}, {'date': '2026-02-29', 'set_number': 2, 'weight': 99, 'reps': 9}]
        expected_result = 128.6
        self.assertEqual(weight_stats.get_one_rep_max(data), expected_result)
    
    def test_calculating_one_rep_max_with_first_set_best(self):
        data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 100, 'reps': 9}, {'date': '2026-02-29', 'set_number': 1, 'weight': 90, 'reps': 9}]
        expected_result = 128.6
        self.assertEqual(weight_stats.get_one_rep_max(data), expected_result)


if __name__ == '__main__':
    unittest.main()