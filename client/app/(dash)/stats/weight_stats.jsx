import { useEffect, useState } from "react";
import ThemedView from "../../../components/ThemedView";
import { getUser } from "../../../lib/getUser";
import ThemedText from "../../../components/ThemedText";
import { Colors } from "../../../constants/Colors"
import { useColorScheme, View, StyleSheet, ScrollView } from "react-native";
import { ThemedDropdown } from "../../../components/ThemedDropdown";
import ThemedLineChart from "../../../components/ThemedLineChart";
import weightStyles from "../../../styles/weightStyles"

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
const styles = weightStyles;

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
    const [maxSetWeightProgression, setMaxSetWeightProgression] = useState(null)
    const [averageSetWeightProgression, setAverageSetWeightProgression] = useState(null)

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
            setMaxSetWeightProgression(data.max_set_weight_progression)
            setAverageSetWeightProgression(data.average_set_weight_progression)
        }
        fetchExerciseData()
    }, [selectedExercise])

    return(
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                
                <View style={styles.header}>
                    <ThemedText style={styles.title}>Exercise Analysis</ThemedText>
                </View>

                <View style={[styles.selectionCard, { backgroundColor: theme.uiBackground }]}>
                    <ThemedText style={styles.sectionLabel}>WORKOUT TYPE</ThemedText>
                    <ThemedDropdown 
                        options={allWorkouts ?? []} 
                        selectedValue={selectedWorkout} 
                        onValueChange={(val) => { 
                            setSelectedWorkout(val); 
                            setHasSelectedExercise(false); 
                            setSelectedExercise('')
                        }} 
                        theme={theme} 
                    />
                </View>

                {hasSelectedWorkout && (
                    <View style={[styles.selectionCard, { backgroundColor: theme.uiBackground }]}>
                        <ThemedText style={styles.sectionLabel}>EXERCISE</ThemedText>
                        <ThemedDropdown 
                            options={allExercises ?? []} 
                            selectedValue={selectedExercise} 
                            onValueChange={setSelectedExercise} 
                            theme={theme} 
                        />
                    </View>
                )}

                {hasSelectedExercise && (
                    <>
                        <View style={styles.statsRow}>
                            <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
                                <ThemedText style={styles.statLabel}>ONE REP MAX</ThemedText>
                                <View style={styles.statValueRow}>
                                    <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                                        {oneRepMax}
                                    </ThemedText>
                                    <ThemedText style={styles.statUnit}>lbs</ThemedText>
                                </View>
                            </View>

                            <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
                                <ThemedText style={styles.statLabel}>TOTAL VOLUME</ThemedText>
                                <View style={styles.statValueRow}>
                                    <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                                        {totalVolume >= 1000 
                                            ? (totalVolume / 1000).toFixed(1) 
                                            : totalVolume
                                        }
                                    </ThemedText>
                                    <ThemedText style={styles.statUnit}>
                                        {totalVolume >= 1000 ? 'k lbs' : 'lbs'}
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        {maxSetWeightProgression && (() => {
                            const chartData = Object.entries(maxSetWeightProgression)
                                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                                .map(([date, volume]) => ({
                                    value: volume,
                                    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                }));

                            return (
                                <View style={[styles.chartCard, { backgroundColor: theme.uiBackground }]}>
                                    <ThemedText style={styles.sectionLabel}>MAX SET PROGRESSION</ThemedText>
                                    <ThemedText style={[styles.chartSubtitle, { color: theme.text }]}>
                                        Max set volume over time
                                    </ThemedText>
                                    
                                    <View style={styles.chartContainer}>
                                        <ThemedLineChart data={chartData} />
                                    </View>
                                </View>
                            );
                        })()}
                        {averageSetWeightProgression && (() => {
                            const chartData = Object.entries(averageSetWeightProgression)
                                .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                                .map(([date, volume]) => ({
                                    value: volume,
                                    label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                }));

                            return (
                                <View style={[styles.chartCard, { backgroundColor: theme.uiBackground }]}>
                                    <ThemedText style={styles.sectionLabel}>AVERAGE SET PROGRESSION</ThemedText>
                                    <ThemedText style={[styles.chartSubtitle, { color: theme.text }]}>
                                        Average set volume over time
                                    </ThemedText>
                                    
                                    <View style={styles.chartContainer}>
                                        <ThemedLineChart data={chartData} />
                                    </View>
                                </View>
                            );
                        })()}
                    </>
                )}

                {!selectedWorkout && (
                    <View style={[styles.emptyState, { backgroundColor: theme.uiBackground }]}>
                        <ThemedText style={[styles.emptyText, { color: theme.text }]}>
                            Select a workout type to view exercise stats
                        </ThemedText>
                    </View>
                )}

            </ScrollView>
        </ThemedView>
    )
}

export default WeightStats;