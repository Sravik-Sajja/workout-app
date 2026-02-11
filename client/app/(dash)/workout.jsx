import { useState } from "react";
import { StyleSheet, TextInput, Alert } from 'react-native';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import { Calendar } from 'react-native-calendars';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Workout = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const handleAddWorkout = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/add-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          workout_type: workoutType.trim()
        })
      });

      if (response.ok) {
        Alert.alert('Success', 'Workout added successfully!');
        setWorkoutType('');
      } else {
        Alert.alert('Error', 'Failed to add workout');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
    return (
      <ThemedView style={{ flex: 1, padding: 40}}>
        <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#4CAF50' },
        }}
        maxDate={todayString}
        style={{ marginBottom: 20 }}
        />
        {selectedDate ? (
          <ThemedText style={{ fontSize: 18 }}>
            Selected Date: {selectedDate}
          </ThemedText>
        ) : (
        <ThemedText style={{ fontSize: 18 }}>Select a date</ThemedText>
        )}
        <TextInput
          style={styles.input}
          placeholder="Workout Type (e.g., Legs, Push, Pull)"
          placeholderTextColor="#999"
          value={workoutType}
          onChangeText={setWorkoutType}
        />
        
        <Spacer />
        <ThemedButton 
        onPress={handleAddWorkout}
        disabled={loading}
        style={loading && styles.buttonDisabled}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Workout'}
          </ThemedText>
        </ThemedButton>
      </ThemedView>
    );
  }
  export default Workout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});