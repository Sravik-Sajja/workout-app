import { useEffect, useState } from "react";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView"
import { useLocalSearchParams } from 'expo-router';
import { View, useColorScheme, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../../../constants/Colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const WorkoutDetails = () => {
    const { date, userId } = useLocalSearchParams();

    const colorScheme = useColorScheme() || 'light';
    const theme = Colors[colorScheme];

    const [workoutType, setWorkoutType] = useState('')
    const [exercises, setExercises] = useState([])

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleShowWorkoutDetails = async () => {
            const response = await fetch(`${API_URL}/api/get-workout-details?user_id=${userId}&date=${date}`)
            const fullData = await response.json();
            setWorkoutType(fullData.workout_type)
            setExercises(fullData.workout_details)
            setLoading(false)
        }
        handleShowWorkoutDetails()
    }, [userId, date]);

    return (
        <ThemedView style={styles.container}>
            {loading ? (
                <ThemedText style={[styles.emptyText, { color: theme.text }]}>Loading...</ThemedText>
            ) : exercises?.length > 0 ? (
                <>
                <View style={styles.header}>
                    <ThemedText style={styles.workoutType}>{workoutType}</ThemedText>
                    <ThemedText style={[styles.date, { color: theme.text }]}>{date}</ThemedText>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <ThemedText style={[styles.sectionLabel, { color: theme.text }]}>EXERCISES</ThemedText>

                    {exercises.map((exercise, exIndex) => (
                        <View key={exIndex} style={[styles.exerciseCard, { backgroundColor: theme.uiBackground }]}>
                            <ThemedText style={styles.exerciseName}>
                                {exercise.name}
                            </ThemedText>

                            {exercise.sets.map((set, setIndex) => (
                                <View key={setIndex} style={[
                                    styles.setRow,
                                    setIndex !== 0 && styles.setRowBorder
                                ]}>
                                    <ThemedText style={[styles.setLabel, { color: theme.text }]}>
                                        Set {setIndex + 1}
                                    </ThemedText>
                                    <ThemedText style={styles.setDetails}>
                                        {set.weight} lbs × {set.reps} reps
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </>
            ) : (
            <>
                <View style={styles.header}>
                    <ThemedText style={styles.workoutType}>{workoutType}</ThemedText>
                    <ThemedText style={[styles.date, { color: theme.text }]}>{date}</ThemedText>
                </View>
                <ThemedText style={[styles.emptyText, { color: theme.text }]}>
                    No exercises were logged.
                </ThemedText>
            </>
            )}
        </ThemedView>
    );
}

export default WorkoutDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    workoutType: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        opacity: 0.5,
        marginBottom: 12,
    },
    exerciseCard: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    setRowBorder: {
        borderTopWidth: 1,
        borderTopColor: 'transparent',
    },
    setLabel: {
        fontSize: 14,
    },
    setDetails: {
        fontSize: 14,
    },
    emptyText: {
        fontSize: 14,
        opacity: 0.5,
        textAlign: 'center',
        marginTop: 24,
    },
});