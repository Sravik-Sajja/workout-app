import { useState, useEffect } from "react";
import { StyleSheet, Alert } from 'react-native';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Stats = () => {

  const [currentStreak, setCurrentStreak] = useState()
  const [workoutDis, setWorkoutDis] = useState()
  useEffect(() => {  
    const getStats  = async () => {
        try{
          const streakResponse = await fetch(`${API_URL}/api/streak`);
          const streakData = await streakResponse.json();
          setCurrentStreak(streakData.streak); 
          
          const chartResponse = await fetch(`${API_URL}/api/distribution`);
          const data = await chartResponse.json();
          setWorkoutDis(data.workoutDis)       
        }
        catch(error){
          Alert.alert('Error: ', error + ' fetching streak');
        }
      };
      getStats()
  }, []);
    return (
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.streak}>Current Streak: {currentStreak} days</ThemedText>

      </ThemedView>
    );
  }
  export default Stats

  const styles = StyleSheet.create({
    streak: {
      textAlign: 'center',
      fontSize: 24,
      marginTop: 50,
    }
  })