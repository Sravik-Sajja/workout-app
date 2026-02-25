import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, ScrollView, View, Pressable, useColorScheme, Alert } from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import ThemedButton from './ThemedButton';
import { Colors } from '../constants/Colors';
import Spacer from './Spacer';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const ExerciseForm = ({ date, workoutType, userId, onClose, isNewWorkout }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [workoutName, setWorkoutName] = useState(workoutType)
  const [exercises, setExercises] = useState([]);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);

  const addSet = () => {
    setSets([...sets, { weight: '', reps: '' }]);
  };

  const removeSet = (index) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value;
    setSets(newSets);
  };

  const addExercise = () => {
    if (!currentExerciseName.trim()) {
      Alert.alert('Error', 'Enter an exercise name');
      return;
    }
    if (sets.some(set => !set.weight || !set.reps)) {
      Alert.alert('Error', 'Fill in all weight and rep fields');
      return;
    }

    setExercises([...exercises, { 
      name: currentExerciseName.trim(), 
      sets: [...sets] 
    }]);
    
    // Reset for next exercise
    setCurrentExerciseName('');
    setSets([{ weight: '', reps: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/add-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          date,
          workout_type: workoutName,
          exercises
        })
      });

      if (response.ok) {
        Alert.alert('Success', 'Workout saved!');
        onClose();
      } else {
        Alert.alert('Error', 'Failed to save workout');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
      console.error(error);
    }
  };
  useEffect(() => {
    if (!isNewWorkout && workoutType) {
      const fetchExistingExercises = async () => {
        try {
          const response = await fetch(`${API_URL}/api/get-exercises?user_id=${userId}&workout_type=${workoutType}`);
          const data = await response.json();
          
          setExercises(data.exercises || []);
        } catch (error) {
          Alert.alert('Error', 'Failed to load exercises');
        }
      };
      fetchExistingExercises();
    }
  }, [isNewWorkout, workoutType, userId, date]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <Spacer />
        
      <View style={styles.header}>
          {isNewWorkout ? (
            <>
              <ThemedText style={styles.label}>Workout Name</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: Colors.primary, color: theme.title, backgroundColor: theme.background }]}
                value={workoutName}
                onChangeText={setWorkoutName}
                placeholder="e.g., Upper Body, Legs..."
                placeholderTextColor={theme.text}
                autoFocus
              />
            </>
          ) : (
            <>
              <ThemedText style={styles.title}>{workoutName}</ThemedText>
              <ThemedText style={[styles.date, { color: theme.text }]}>{date}</ThemedText>
            </>
          )}
        </View>

        {exercises.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.sectionLabel}>EXERCISES</ThemedText>
            {exercises.map((exercise, exIndex) => (
              <View key={exIndex} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
                  <Pressable onPress={() => removeExercise(exIndex)}>
                    <ThemedText style={{ color: Colors.warning }}>Remove</ThemedText>
                  </Pressable>
                </View>
                {exercise.sets.map((set, setIndex) => (
                  <ThemedText key={setIndex} style={[styles.setText, { color: theme.text }]}>
                    Set {setIndex + 1}: {set.weight} lbs × {set.reps} reps
                  </ThemedText>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.uiBackground }]}>
          <ThemedText style={styles.sectionLabel}>ADD EXERCISE</ThemedText>
          
          <TextInput
            style={[styles.input, { borderColor: theme.text, color: theme.title, backgroundColor: theme.background }]}
            placeholder="Exercise name (e.g., Bench Press)"
            placeholderTextColor={theme.text}
            value={currentExerciseName}
            onChangeText={setCurrentExerciseName}
          />

          <ThemedText style={[styles.subsectionLabel, { color: theme.text }]}>Sets</ThemedText>
          
          {sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <ThemedText style={[styles.setNumber, { color: theme.text }]}>{index + 1}</ThemedText>
              
              <TextInput
                style={[styles.setInput, { borderColor: theme.text, color: theme.title, backgroundColor: theme.background }]}
                placeholder="Weight"
                placeholderTextColor={theme.text}
                value={set.weight}
                onChangeText={(val) => updateSet(index, 'weight', val)}
                keyboardType="numeric"
              />
              
              <ThemedText style={{ color: theme.text }}>lbs ×</ThemedText>
              
              <TextInput
                style={[styles.setInput, { borderColor: theme.text, color: theme.title, backgroundColor: theme.background }]}
                placeholder="Reps"
                placeholderTextColor={theme.text}
                value={set.reps}
                onChangeText={(val) => updateSet(index, 'reps', val)}
                keyboardType="numeric"
              />
              
              <ThemedText style={{ color: theme.text }}>reps</ThemedText>
              
              {sets.length > 1 && (
                <Pressable onPress={() => removeSet(index)}>
                  <ThemedText style={{ color: Colors.warning, marginLeft: 8 }}>×</ThemedText>
                </Pressable>
              )}
            </View>
          ))}

          <Pressable 
            onPress={addSet}
            style={[styles.addSetButton, { borderColor: theme.text }]}
          >
            <ThemedText style={{ color: Colors.primary }}>+ Add Set</ThemedText>
          </Pressable>

          <ThemedButton onPress={addExercise} style={styles.addExerciseButton}>
            <ThemedText style={styles.buttonText}>Add Exercise</ThemedText>
          </ThemedButton>
        </View>

      </ScrollView>

      <View style={styles.bottomActions}>
        <Pressable onPress={onClose} style={styles.cancelButton}>
          <ThemedText style={{ color: theme.text }}>Cancel</ThemedText>
        </Pressable>
        
        <ThemedButton onPress={saveWorkout} style={styles.saveButton}>
          <ThemedText style={styles.buttonText}>Save Workout</ThemedText>
        </ThemedButton>
      </View>
    </ThemedView>
  );
};

export default ExerciseForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    opacity: 0.6,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    opacity: 0.5,
    marginBottom: 12,
  },
  exerciseCard: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  setText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  subsectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  setNumber: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
  },
  setInput: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  addSetButton: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addExerciseButton: {
    padding: 14,
    borderRadius: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.primary + '20',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary + '40',
  },
  saveButton: {
    flex: 2,
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});