import unittest
from methods import workout

class TestWorkout(unittest.TestCase):
    def test_get_all_workout_types(self):
        data = [{'workout_type': 'Legs'}, {'workout_type': 'Push'}, {'workout_type': 'Pull'}, {'workout_type': 'Pull'}]
        expected_result = {'Legs', 'Push', 'Pull'}
        result = set(workout.get_all_workouts(data))

        self.assertEqual(result, expected_result)



if __name__ == '__main__':
    unittest.main()