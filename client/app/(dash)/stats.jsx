import { useState, useEffect } from "react";
import { StyleSheet, Alert } from 'react-native';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import Spacer from '../../components/Spacer';
import { supabase } from '../../lib/supabase'
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { PieChart } from 'react-native-gifted-charts';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
const colors = ['red', 'yellow', 'orange', 'blue', 'green', 'purple'];

const Stats = () => {

  const [currentStreak, setCurrentStreak] = useState()
  const [workoutDis, setWorkoutDis] = useState()
  const [percentage, setPercentage] = useState()
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

            const percentageResponse = await fetch(`${API_URL}/api/percentage?user_id=${user.id}`);
            const percentageData = await percentageResponse.json();
            setPercentage(percentageData.percentage); 
            
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
    const formatChartData = (workoutDis) => {
      return workoutDis.labels.map((label, index) => ({
        value: workoutDis.datasets[0].data[index],
        color: colors[index % colors.length],
        text: label
      }));
    };
    return (
      <ThemedView style={{ flex: 1 }}>
        <ThemedText style={styles.streak}>Current Streak: {currentStreak} days</ThemedText>
        <Spacer />
        <ThemedText style={styles.streak}>Percentage: {percentage}%</ThemedText>
        <Spacer />

        {workoutDis && (
          <PieChart data={formatChartData(workoutDis)} donut radius={120} innerRadius={60}
            centerLabelComponent={() => (
              <ThemedText>Workouts</ThemedText>
            )}
          />
        )}
        {workoutDis && workoutDis.labels.map((label, index) => (
        <ThemedView key={index} style={styles.labels}>
          <ThemedView style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors[index % colors.length], marginRight: 8 }} />
          <ThemedText>{label}: {workoutDis.datasets[0].data[index]}</ThemedText>
        </ThemedView>
      ))}

      </ThemedView>
    );
  }
  export default Stats

  const styles = StyleSheet.create({
    streak: {
      textAlign: 'center',
      fontSize: 24,
      marginTop: 50,
    },
    labels: {
      flexDirection: 'row', 
      alignItems: 'center', 
      marginTop: 5,
    },
  })