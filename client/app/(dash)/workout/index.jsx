import { useCallback, useState } from "react";
import { StyleSheet, TextInput, Alert, ScrollView, Pressable, useColorScheme, View } from 'react-native';
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedButton from "../../../components/ThemedButton";
import { Calendar } from 'react-native-calendars';
import { supabase } from '../../../lib/supabase'
import { router, useFocusEffect } from "expo-router";
import { Colors } from "../../../constants/Colors"
import Spacer from "../../../components/Spacer";
import ThemedCalendar from "../../../components/ThemedCalender";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Workout = () => {
  const colorScheme = useColorScheme() || 'light'
  const theme = Colors[colorScheme]

  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState('')
  const [loading, setLoading] = useState(false);
  const [allWorkouts, setAllWorkouts] = useState([])
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [showInput, setShowInput] = useState(false)
  const [newWorkout, setNewWorkout] = useState('')

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  useFocusEffect(
    useCallback(() => {
      const handleDisplay = async () => {
        let user_id = await getUser()
        const response = await fetch(`${API_URL}/api/get-workouts?user_id=${user_id}`)
        const fullData = await response.json();
        setAllWorkouts(fullData.workouts)
        
        const marked = {};
        fullData.all_dates.forEach(date => {
          marked[date] = { marked: true, dotColor: Colors.primary };
        });
        setMarkedDates(marked);
      }
      handleDisplay()
    }, [])
  );

  async function getUser() {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Alert.alert('Error', userError?.message || 'Unable to get user info.')
      return
    }
    return user.id
  }

  const handleAddWorkout = async () => {
    if (!selectedDate) {
      Alert.alert('Missing Date', 'Please select a date to add your workout.');
      return;
    }
    if (!selectedWorkout) {
      Alert.alert('Missing Workout', 'Please select or add a workout type.');
      return;
    }
    setLoading(true)
    try {
      let user_id = await getUser()
      const response = await fetch(`${API_URL}/api/add-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user_id,
          date: selectedDate,
          workout_type: selectedWorkout
        })
      });

      if (response.ok) {
        Alert.alert('Added!', `${selectedWorkout} added for ${selectedDate}.`);
        setSelectedWorkout(null);
        setSelectedDate('');
      } else {
        Alert.alert('Error', 'Failed to add workout');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
    if (newWorkout.trim()) setAllWorkouts([...allWorkouts, newWorkout.trim()])
    setNewWorkout('') 
    setShowInput(false)
  };

  const handleSelectDay = async (day) => {
    if (markedDates[day.dateString]) {
      const userId = await getUser();
      router.push({
        pathname: '/(dash)/workout/workoutDetails',
        params: { date: day.dateString, userId: userId}
      })
    }
    setSelectedDate(day.dateString)
  }

  return (
    <ThemedView style={styles.container}>
      <Spacer />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionLabel}>SELECT DATE</ThemedText>
          <ThemedCalendar
            onDayPress={handleSelectDay}
            markedDates={markedDates}
            selectedDate={selectedDate}
            maxDate={todayString}
          />
          {selectedDate ? (
            <ThemedView style={[styles.selectedDateBadge, { backgroundColor: Colors.primary + '20' }]}>
              <ThemedText style={[styles.selectedDateText, { color: Colors.primary }]}>
                {selectedDate}
              </ThemedText>
            </ThemedView>
          ) : (
            <ThemedText style={[styles.hintText, { color: theme.text }]}>Tap a day to select it</ThemedText>
          )}
        </ThemedView>

        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>WORKOUT TYPE</ThemedText>

          <ThemedView style={styles.grid}>
            {allWorkouts.map((workout, index) => {
              const isSelected = selectedWorkout === workout;
              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedWorkout(workout)}
                  style={({ pressed }) => [
                    styles.card,
                    { backgroundColor: theme.uiBackground },
                    isSelected && { backgroundColor: Colors.primary + '18', borderColor: Colors.primary, borderWidth: 2 },
                    pressed && { opacity: 0.75 }
                  ]}
                >
                  <ThemedText style={[styles.cardText, isSelected && { color: Colors.primary }]}>
                    {workout}
                  </ThemedText>
                </Pressable>
              );
            })}

            {!showInput && (
              <Pressable
                onPress={() => setShowInput(true)}
                style={({ pressed }) => [
                  styles.card,
                  styles.addCard,
                  { borderColor: theme.text + '40', backgroundColor: 'transparent' },
                  pressed && { opacity: 0.6 }
                ]}
              >
                <ThemedText style={[styles.addCardText, { color: theme.text }]}>+ New</ThemedText>
              </Pressable>
            )}
          </ThemedView>

          {showInput && (
            <TextInput
              style={[styles.input, { borderColor: Colors.primary, color: theme.title, backgroundColor: theme.uiBackground }]}
              value={newWorkout}
              onChangeText={(text) => {
                setNewWorkout(text)
                setSelectedWorkout(text.trim())
                }}
              onBlur={() => { if (!newWorkout.trim()) setShowInput(false) }}
              placeholder="e.g. Upper Body, Legs..."
              placeholderTextColor={theme.text}
              autoFocus
              returnKeyType="done"
            />
          )}
        </View>

        <ThemedButton
          onPress={handleAddWorkout}
          disabled={loading}
          style={[styles.addButton, loading && { opacity: 0.6 }]}
        >
          <ThemedText style={[styles.addButtonText, { color: theme.title }]}>
            {loading ? 'Adding...' : 'Add Workout'}
          </ThemedText>
        </ThemedButton>

      </ScrollView>
    </ThemedView>
  );
}

export default Workout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    opacity: 0.5,
    marginBottom: 4,
  },
  selectedDateBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedDateText: {
    fontWeight: '600',
    fontSize: 14,
  },
  hintText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '47%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  addCard: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginTop: 4,
  },
  addButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});