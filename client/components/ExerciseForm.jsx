import { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet, TextInput, ScrollView, View, Pressable,
  useColorScheme, Alert, PanResponder, Animated,
} from 'react-native';
import ThemedText from './ThemedText';
import ThemedView from './ThemedView';
import ThemedButton from './ThemedButton';
import { Colors } from '../constants/Colors';
import Spacer from './Spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const ITEM_HEIGHT = 110;

const DraggableExerciseList = ({ exercises, onReorder, onRemove, onEdit, onDragStateChange }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  // All drag logic lives in refs so PanResponder callbacks are never stale
  const dragState = useRef({ active: false, index: null, hoverIndex: null });

  // One Animated.Value per item, stable across renders
  const animValues = useRef([]);
  if (animValues.current.length !== exercises.length) {
    animValues.current = exercises.map((_, i) => animValues.current[i] ?? new Animated.Value(0));
  }

  // UI state only used for visual highlights
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const resetDrag = useCallback(() => {
    const idx = dragState.current.index;
    if (idx !== null && animValues.current[idx]) {
      Animated.spring(animValues.current[idx], {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
      }).start();
    }
    dragState.current = { active: false, index: null, hoverIndex: null };
    setActiveIndex(null);
    setHoverIndex(null);
    onDragStateChange(false);
  }, [onDragStateChange]);

  const makePanResponder = useCallback((index) => {
    return PanResponder.create({
      // Capture immediately on the handle — beat the ScrollView
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => dragState.current.active,
      onMoveShouldSetPanResponderCapture: () => dragState.current.active,

      onPanResponderGrant: () => {
        animValues.current[index].setValue(0);
        dragState.current = { active: true, index, hoverIndex: index };
        setActiveIndex(index);
        setHoverIndex(index);
        onDragStateChange(true); // disables ScrollView scrolling
      },

      onPanResponderMove: (_, gesture) => {
        if (!dragState.current.active) return;
        animValues.current[index].setValue(gesture.dy);

        const newHover = Math.min(
          Math.max(0, index + Math.round(gesture.dy / ITEM_HEIGHT)),
          exercises.length - 1,
        );
        if (newHover !== dragState.current.hoverIndex) {
          dragState.current.hoverIndex = newHover;
          setHoverIndex(newHover);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        const newIndex = Math.min(
          Math.max(0, index + Math.round(gesture.dy / ITEM_HEIGHT)),
          exercises.length - 1,
        );
        if (newIndex !== index) {
          const reordered = [...exercises];
          const [moved] = reordered.splice(index, 1);
          reordered.splice(newIndex, 0, moved);
          onReorder(reordered);
        }
        resetDrag();
      },

      onPanResponderTerminate: resetDrag,
    });
  }, [exercises, onReorder, onDragStateChange, resetDrag]);

  // Recreate all pan responders whenever exercises array changes
  const panResponders = useRef([]);
  useEffect(() => {
    panResponders.current = exercises.map((_, i) => makePanResponder(i));
  }, [exercises, makePanResponder]);

  return (
    <View>
      {exercises.map((exercise, exIndex) => {
        const isDragging = activeIndex === exIndex;
        const isTarget = hoverIndex === exIndex && activeIndex !== null && activeIndex !== exIndex;

        return (
          <Animated.View
            key={`exercise-${exIndex}`}
            style={[
              styles.exerciseCard,
              {
                borderColor: isDragging
                  ? Colors.primary
                  : isTarget
                  ? Colors.primary
                  : Colors.primary + '30',
                backgroundColor: isDragging ? Colors.primary + '10' : 'transparent',
                transform: [{ translateY: animValues.current[exIndex] ?? 0 }],
                zIndex: isDragging ? 999 : 1,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: isDragging ? 6 : 0 },
                shadowOpacity: isDragging ? 0.2 : 0,
                shadowRadius: isDragging ? 10 : 0,
                elevation: isDragging ? 8 : 0,
              },
            ]}
          >
            <View style={styles.exerciseHeader}>
              {/* Drag handle — only touch target that initiates drag */}
              <View
                {...(panResponders.current[exIndex]?.panHandlers ?? {})}
                style={styles.dragHandle}
              >
                <ThemedText style={[styles.dragIcon, { opacity: isDragging ? 1 : 0.4, color: Colors.primary }]}>
                  ☰
                </ThemedText>
              </View>

              <Pressable onPress={() => onEdit(exIndex, exercise)} style={{ flex: 1 }}>
                <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
              </Pressable>

              <Pressable onPress={() => onRemove(exIndex)}>
                <ThemedText style={{ color: Colors.warning }}>Remove</ThemedText>
              </Pressable>
            </View>

            <Pressable onPress={() => onEdit(exIndex, exercise)}>
              {exercise.sets.map((set, setIndex) => (
                <ThemedText key={setIndex} style={[styles.setText, { color: theme.text }]}>
                  Set {setIndex + 1}: {set.weight} lbs × {set.reps} reps
                </ThemedText>
              ))}
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

const ExerciseForm = ({ date, workoutType, userId, onClose, isNewWorkout }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const [workoutName, setWorkoutName] = useState(workoutType);
  const [exercises, setExercises] = useState([]);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const [sets, setSets] = useState([{ weight: '', reps: '' }]);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // passed to ScrollView
  const [isSaving, setIsSaving] = useState(false);

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

    if (editingExerciseIndex !== null) {
      const updated = [...exercises];
      updated[editingExerciseIndex] = { name: currentExerciseName.trim(), sets: [...sets] };
      setExercises(updated);
      setEditingExerciseIndex(null);
    } else {
      setExercises([...exercises, { name: currentExerciseName.trim(), sets: [...sets] }]);
    }
    setCurrentExerciseName('');
    setSets([{ weight: '', reps: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleEdit = (index, exercise) => {
    setCurrentExerciseName(exercise.name);
    setSets(exercise.sets.map((s) => ({ weight: String(s.weight), reps: String(s.reps) })));
    setEditingExerciseIndex(index);
  };

  const saveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise');
      return;
    }
    if (!workoutName || workoutName.trim().length === 0){
      Alert.alert('Error', 'Add a workout name');
      return
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/add-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          date,
          workout_type: workoutName.trim(),
          exercises
        })
      });
      if (response.ok) {
        Alert.alert('Success', 'Workout saved!');
        onClose();
      } else {
        Alert.alert('Error', 'Failed to save workout');
      }
    } catch {
      Alert.alert('Error', 'Could not connect to server');
    }
    finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isNewWorkout && workoutType) {
      (async () => {
        try {
          const response = await fetch(`${API_URL}/api/get-recent-exercises?user_id=${userId}&workout_type=${workoutType}`);
          const data = await response.json();
          setExercises(data.exercises || []);
        } catch (error) {
          Alert.alert('Error', 'Failed to load exercises');
        }
      })();
    }
  }, [isNewWorkout, workoutType, userId, date]);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isDragging}
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        enableResetScrollToCoords={false}
      >
        <Spacer />

        <View style={styles.header}>
          <ThemedText style={styles.label}>Workout Name</ThemedText>
          <TextInput
            style={[styles.input, { borderColor: Colors.primary, color: theme.title, backgroundColor: theme.background }]}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="e.g., Upper Body, Legs..."
            placeholderTextColor={theme.text}
            autoFocus
          />
          <ThemedText style={[styles.date, { color: theme.text }]}>{date}</ThemedText>
        </View>

        {exercises.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.uiBackground }]}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText style={styles.sectionLabel}>EXERCISES</ThemedText>
              <ThemedText style={[styles.dragHint, { color: theme.text }]}>☰ drag to reorder</ThemedText>
            </View>
            <DraggableExerciseList
              exercises={exercises}
              onReorder={setExercises}
              onRemove={removeExercise}
              onEdit={handleEdit}
              onDragStateChange={setIsDragging}
            />
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.uiBackground }]}>
          <ThemedText style={styles.sectionLabel}>SAVE EXERCISE</ThemedText>

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
            <ThemedText style={styles.buttonText}>Save Exercise</ThemedText>
          </ThemedButton>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.bottomActions}>
      <ThemedButton onPress={onClose} style={styles.cancelButton}>
        <ThemedText style={styles.buttonText}>
          Cancel
        </ThemedText>
      </ThemedButton>
      <ThemedButton
        onPress={saveWorkout}
        style={[
          styles.saveButton,
          isSaving && { opacity: 0.6 }
        ]}
        disabled={isSaving}
      >
        <ThemedText style={styles.buttonText}>
          {isSaving ? 'Saving...' : 'Save Workout'}
        </ThemedText>
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
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
  sectionHeaderRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    opacity: 0.5,
    marginBottom: 8
  },
  dragHint: { 
    fontSize: 11, 
    opacity: 0.4, 
    fontStyle: 'italic',
  },
  exerciseCard: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dragHandle: { 
    paddingHorizontal: 6, 
    paddingVertical: 4,
  },
  dragIcon: { 
    fontSize: 18,
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
  },
  saveButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});