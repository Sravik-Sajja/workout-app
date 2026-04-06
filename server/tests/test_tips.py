import unittest
from methods import tips

class TestTips(unittest.TestCase):
    def test_parse_valid_output(self):
        output = "Progressive overload|Bench flat for 3 weeks|Try dropping to 3x8 instead of 5x5.|Your muscles adapt to the same stimulus over time."
        result = tips.parse_tips_output(output)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['category'], 'Progressive overload')
        self.assertEqual(result[0]['title'], 'Bench flat for 3 weeks')
        self.assertEqual(result[0]['body'], 'Try dropping to 3x8 instead of 5x5.')
        self.assertEqual(result[0]['reason'], 'Your muscles adapt to the same stimulus over time.')

    def test_parse_multiple_tips(self):
        output = "Recovery|Training 5 days straight|Take a rest day tomorrow.|Muscles grow during recovery, not during the session itself.\nFrequency|No legs in two weeks|Add a leg session this week.|Infrequent training leads to detraining within 10-14 days."
        result = tips.parse_tips_output(output)
        self.assertEqual(len(result), 2)

    def test_parse_skips_blank_lines(self):
        output = "Recovery|Training 5 days straight|Take a rest day tomorrow.|Muscles grow during recovery.\n\nFrequency|No legs in two weeks|Add a leg session this week.|Infrequent training causes detraining."
        result = tips.parse_tips_output(output)
        self.assertEqual(len(result), 2)

    def test_parse_skips_malformed_lines(self):
        output = "this is not valid\nRecovery|Training 5 days straight|Take a rest day tomorrow.|Muscles grow during recovery."
        result = tips.parse_tips_output(output)
        self.assertEqual(len(result), 1)

    def test_parse_strips_whitespace(self):
        output = "  Recovery  |  Training 5 days straight  |  Take a rest day tomorrow.  |  Muscles grow during recovery.  "
        result = tips.parse_tips_output(output)
        self.assertEqual(result[0]['category'], 'Recovery')
        self.assertEqual(result[0]['title'], 'Training 5 days straight')

    def test_parse_empty_output(self):
        result = tips.parse_tips_output("")
        self.assertEqual(result, [])
    
    def test_compress_single_exercise_single_date(self):
        data = [
            {"exercise_type": "Bench Press", "date": "2026-04-01", "weight": 80, "reps": 10},
            {"exercise_type": "Bench Press", "date": "2026-04-01", "weight": 80, "reps": 8},
        ]
        result = tips.compress_workout_data(data)
        self.assertEqual(result, "Bench Press|2026-04-01:80x10;80x8")

    def test_compress_single_exercise_multiple_dates(self):
        data = [
            {"exercise_type": "Hammer Curls", "date": "2026-04-01", "weight": 35, "reps": 9},
            {"exercise_type": "Hammer Curls", "date": "2026-04-05", "weight": 35, "reps": 10},
        ]
        result = tips.compress_workout_data(data)
        self.assertEqual(result, "Hammer Curls|2026-04-01:35x9|2026-04-05:35x10")

    def test_compress_multiple_exercises(self):
        data = [
            {"exercise_type": "Bench Press", "date": "2026-04-01", "weight": 80, "reps": 10},
            {"exercise_type": "Squat", "date": "2026-04-01", "weight": 100, "reps": 8},
        ]
        result = tips.compress_workout_data(data)
        lines = result.split('\n')
        self.assertEqual(len(lines), 2)
        self.assertIn("Bench Press|2026-04-01:80x10", lines)
        self.assertIn("Squat|2026-04-01:100x8", lines)

    def test_compress_empty_data(self):
        result = tips.compress_workout_data([])
        self.assertEqual(result, "")


if __name__ == '__main__':
    unittest.main()