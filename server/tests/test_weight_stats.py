import unittest
from methods import weight_stats

class TestWeightStats(unittest.TestCase):
    #testing one rep max
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
    
    #testing total volume
    def test_total_volume(self):
        data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 90, 'reps': 9}, {'date': '2026-02-29', 'set_number': 1, 'weight': 100, 'reps': 9}, {'date': '2026-02-29', 'set_number': 2, 'weight': 99, 'reps': 9}]
        expected_result = 2601
        self.assertEqual(weight_stats.get_total_volume(data), expected_result)

    #testing weight progression
    def test_weight_progression(self):
         data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 90, 'reps': 9}, {'date': '2026-02-29', 'set_number': 1, 'weight': 100,'reps': 9}]
         expected_result = {'2026-02-25': 810, '2026-02-29': 900}
         self.assertEqual(weight_stats.get_weight_progression(data), expected_result)
    
    def test_weight_progression_with_multiple_sets_on_same_day(self):
        data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 90, 'reps': 9}, {'date': '2026-02-25', 'set_number': 2, 'weight': 95, 'reps': 9}, {'date': '2026-02-29', 'set_number': 1, 'weight': 100,'reps': 9}]
        expected_result = {'2026-02-25': 855, '2026-02-29': 900}
        self.assertEqual(weight_stats.get_weight_progression(data), expected_result)
    
    def test_weight_progression_with_warmup_sets_as_highest(self):
        data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 95, 'reps': 9}, {'date': '2026-02-25', 'set_number': 2, 'weight': 94, 'reps': 9}, {'date': '2026-02-29', 'set_number': 1, 'weight': 100,'reps': 9}]
        expected_result = {'2026-02-25': 855, '2026-02-29': 900}
        self.assertEqual(weight_stats.get_weight_progression(data), expected_result)
    
    def test_weight_progressions_with_difference_due_to_reps(self):
         data = [{'date': '2026-02-25', 'set_number': 1, 'weight': 95, 'reps': 9}, {'date': '2026-02-25', 'set_number': 2, 'weight': 94, 'reps': 10}]
         expected_result = {'2026-02-25': 940}
         self.assertEqual(weight_stats.get_weight_progression(data), expected_result)

if __name__ == '__main__':
    unittest.main()