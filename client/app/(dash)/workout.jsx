import { useState } from "react";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Calendar } from 'react-native-calendars';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Workout = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
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
      </ThemedView>
    );
  }
  export default Workout