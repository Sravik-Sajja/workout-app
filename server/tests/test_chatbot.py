import unittest
from methods.chatbot import compress_workout_data

class TestCompressWorkoutData(unittest.TestCase):
    def setUp(self):
        self.single_exercise = [
            {
                "date": "2024-01-01",
                "workout_type": "upper",
                "Exercises": [
                    {
                        "exercise_type": "Bench Press",
                        "Sets": [
                            {"weight": 80, "reps": 8},
                            {"weight": 80, "reps": 7},
                        ]
                    }
                ]
            }
        ]

    def test_single_exercise_single_day(self):
        result = compress_workout_data(self.single_exercise)
        self.assertEqual(result, "Bench Press|2024-01-01:80x8;80x7")

    def test_multiple_exercises_same_day(self):
        data = [
            {
                "date": "2024-01-01",
                "workout_type": "upper",
                "Exercises": [
                    {
                        "exercise_type": "Bench Press",
                        "Sets": [{"weight": 80, "reps": 8}, {"weight": 85, "reps": 6}]
                    },
                    {
                        "exercise_type": "Shoulder Press",
                        "Sets": [{"weight": 50, "reps": 10}]
                    }
                ]
            }
        ]
        result = compress_workout_data(data)
        lines = result.split("\n")
        self.assertIn("Bench Press|2024-01-01:80x8;85x6", lines)
        self.assertIn("Shoulder Press|2024-01-01:50x10", lines)

    def test_same_exercise_multiple_days(self):
        data = [
            {
                "date": "2024-01-01",
                "workout_type": "legs",
                "Exercises": [
                    {"exercise_type": "Squats", "Sets": [{"weight": 100, "reps": 8}, {"weight": 100, "reps": 8}]}
                ]
            },
            {
                "date": "2024-01-08",
                "workout_type": "legs",
                "Exercises": [
                    {"exercise_type": "Squats", "Sets": [{"weight": 110, "reps": 6}, {"weight": 110, "reps": 6}]}
                ]
            }
        ]
        result = compress_workout_data(data)
        self.assertEqual(result, "Squats|2024-01-01:100x8;100x8|2024-01-08:110x6;110x6")

    def test_empty_data(self):
        result = compress_workout_data([])
        self.assertEqual(result, "")

    def test_no_exercises(self):
        data = [{"date": "2024-01-01", "workout_type": "upper", "Exercises": []}]
        result = compress_workout_data(data)
        self.assertEqual(result, "")

    def test_empty_sets(self):
        data = [
            {
                "date": "2024-01-01",
                "workout_type": "upper",
                "Exercises": [{"exercise_type": "Bench Press", "Sets": []}]
            }
        ]
        result = compress_workout_data(data)
        self.assertEqual(result, "Bench Press|2024-01-01:")

    def test_sets_preserve_order(self):
        data = [
            {
                "date": "2024-01-01",
                "workout_type": "upper",
                "Exercises": [
                    {
                        "exercise_type": "Bench Press",
                        "Sets": [
                            {"weight": 60, "reps": 10},
                            {"weight": 80, "reps": 8},
                            {"weight": 100, "reps": 4},
                        ]
                    }
                ]
            }
        ]
        result = compress_workout_data(data)
        self.assertEqual(result, "Bench Press|2024-01-01:60x10;80x8;100x4")

    def test_multiple_exercises_multiple_days(self):
        data = [
            {
                "date": "2024-01-01",
                "workout_type": "upper",
                "Exercises": [
                    {"exercise_type": "Bench Press", "Sets": [{"weight": 80, "reps": 8}]},
                    {"exercise_type": "Rows", "Sets": [{"weight": 70, "reps": 10}]},
                ]
            },
            {
                "date": "2024-01-08",
                "workout_type": "upper",
                "Exercises": [
                    {"exercise_type": "Bench Press", "Sets": [{"weight": 85, "reps": 8}]},
                    {"exercise_type": "Rows", "Sets": [{"weight": 75, "reps": 10}]},
                ]
            }
        ]
        result = compress_workout_data(data)
        lines = result.split("\n")
        self.assertEqual(len(lines), 2)
        self.assertIn("Bench Press|2024-01-01:80x8|2024-01-08:85x8", lines)
        self.assertIn("Rows|2024-01-01:70x10|2024-01-08:75x10", lines)


if __name__ == "__main__":
    unittest.main()