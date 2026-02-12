import { useState, useEffect } from "react";
import { StyleSheet, Alert } from 'react-native';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { supabase } from '../../lib/supabase'
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Stats = () => {

  const [currentStreak, setCurrentStreak] = useState()
  const [workoutDis, setWorkoutDis] = useState()
  useFocusEffect(
    useCallback(() => {
      const getStats  = async () => {
          try{
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
              setLoading(false)
              Alert.alert('Error', userError?.message || 'Unable to get user info.')
              return
            }
            const streakResponse = await fetch(`${API_URL}/api/streak?user_id=${user.id}`);
            const streakData = await streakResponse.json();
            setCurrentStreak(streakData.streak); 
            
            const chartResponse = await fetch(`${API_URL}/api/distribution?user_id=${user.id}`);
            const data = await chartResponse.json();
            setWorkoutDis(data.workoutDis)       
          }
          catch(error){
            Alert.alert('Error: ', error + ' fetching streak');
          }
        };
        getStats()
    }, [])
    );
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