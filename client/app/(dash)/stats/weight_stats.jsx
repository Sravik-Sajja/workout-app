import { useEffect, useState } from "react";
import ThemedView from "../../../components/ThemedView";
import { getUser } from "../../../lib/getUser";
import ThemedText from "../../../components/ThemedText";
import { Colors } from "../../../constants/Colors"
import { useColorScheme } from "react-native";
import Spacer from "../../../components/Spacer";
import { ThemedDropdown } from "../../../components/ThemedDropdown";
import { LineChart } from 'react-native-gifted-charts';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const WeightStats = () => {
    const colorScheme = useColorScheme() || 'light'
    const theme = Colors[colorScheme]

    const [allWorkouts, setAllWorkouts] = useState([])
    const [selectedWorkout, setSelectedWorkout] = useState('');
    const [hasSelectedWorkout, setHasSelectedWorkout] = useState(false)
    const [allExercises, setAllExercises] = useState([])
    const [selectedExercise, setSelectedExercise] = useState('')
    const [hasSelectedExercise, setHasSelectedExercise] = useState(false)

    const [oneRepMax, setOneRepMax] = useState(0)
    const [totalVolume, setTotalVolume] = useState(0)
    const [weightProgression, setWeightProgression] = useState(null)

    useEffect(() => {
        const getAllWorkoutTypes = async () => {
            const userId = await getUser()
            const response = await fetch(`${API_URL}/api/get-workouts?user_id=${userId}`)
            const fullData = await response.json();
            setAllWorkouts(fullData.workouts)
        }
        getAllWorkoutTypes()
    }, [])
    useEffect(() => {
        if (!selectedWorkout) return
        const getAllExercises = async () => {
            const userId = await getUser()
            const response = await fetch(`${API_URL}/api/get-exercises?user_id=${userId}&workout_type=${selectedWorkout}`);
            const data = await response.json();
            const exerciseData = data.exercises
            setHasSelectedWorkout(true)
            if (!exerciseData || exerciseData.length == 0) setAllExercises(["No exercises logged for this workout!"])
            else{
                const exerciseNames = exerciseData.map(exercise => exercise.name)
                setAllExercises(exerciseNames)
            }
        }
        getAllExercises()
    }, [selectedWorkout])

    useEffect(() => {
        if (!selectedExercise) return
    
        const fetchExerciseData = async () => {
            const userId = await getUser()
            const response = await fetch(`${API_URL}/api/get-exercise-stats?user_id=${userId}&exercise_type=${selectedExercise}`);
            const data = await response.json()
            setHasSelectedExercise(true)
            setOneRepMax(data.best_one_rep_max)
            setTotalVolume(data.total_volume)
            setWeightProgression(data.weight_progression)
        }
        fetchExerciseData()
    }, [selectedExercise])

    return(
        <ThemedView style={{ flex: 1, paddingTop: 50 }}>
            <Spacer />
            <ThemedDropdown options={allWorkouts ?? []} selectedValue={selectedWorkout} onValueChange={(val) => { setSelectedWorkout(val); setHasSelectedExercise(false); setSelectedExercise('')}} theme={theme} />
            {hasSelectedWorkout && <ThemedDropdown options={allExercises ?? []} selectedValue={selectedExercise} onValueChange={setSelectedExercise} theme={theme} />}
            {hasSelectedExercise && (
               <>
                    <ThemedText>One Rep Max: {oneRepMax}</ThemedText>
                    <ThemedText>Total Volume: {totalVolume}</ThemedText>
                </>
            )}
            {hasSelectedExercise && weightProgression && (() => {
                const chartData = Object.entries(weightProgression)
                    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                    .map(([date, volume]) => ({
                    value: volume,
                    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    }));

                return (
                    <LineChart
                    data={chartData}
                    width={320}
                    height={220}
                    color={Colors.primary}
                    thickness={3}
                    dataPointsColor={Colors.primary}
                    curved
                    yAxisColor={theme.text}
                    xAxisColor={theme.text}
                    yAxisTextStyle={{ color: theme.text }}
                    xAxisLabelTextStyle={{ color: theme.text }}
                    yAxisOffset={Math.floor(Math.min(...chartData.map(d => d.value)) * 0.8)}
                    initialSpacing={22}
                    formatYLabel={(value) => Math.round(value).toString()} 
                    />
                );
                })()}
        </ThemedView>
    )
}
export default WeightStats