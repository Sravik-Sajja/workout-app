import { useEffect, useState } from "react";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView"
import { useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const WorkoutDetails = () => {
    const { date, userId } = useLocalSearchParams();

    const [workoutDetails, setWorkoutDetails] = useState([])
    useEffect(() => {
        const handleShowWorkoutDetails = async () => {
          const response = await fetch(`${API_URL}/api/get-workout-details?user_id=${userId}&date=${date}`)
          const fullData = await response.json();
          setWorkoutDetails(fullData.workout_details)
        }
        handleShowWorkoutDetails()
      }, [userId, date]);
    return (
        <ThemedView style={{ flex: 1 }}>
            {workoutDetails && workoutDetails.length > 0 ? (
                workoutDetails.map((item, index) => (
                    <ThemedText key={index}>{item.workout_type}</ThemedText>
                ))
                ) : (
                <ThemedText>Loading...</ThemedText>
            )}
        </ThemedView>
    );
}
export default WorkoutDetails