import { useState, useCallback } from "react";
import { StyleSheet, Alert, ScrollView, View, useColorScheme } from 'react-native';
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import Spacer from "../../../components/Spacer";
import { useFocusEffect } from 'expo-router';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from "../../../constants/Colors";
import { getUser } from "../../../lib/getUser";
import statsStyles from "../../../styles/statsStyles"

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
const styles = statsStyles;

const OverallStats = () => {
  const colorScheme = useColorScheme() || 'light'
  const theme = Colors[colorScheme]

  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [longestStreakStart, setLongestStreakStart] = useState('')
  const [longestStreakEnd, setLongestStreakEnd] = useState('')
  const [bestMonthPercentage, setBestMonthPercentage] = useState('')
  const [bestMonthName, setBestMonthName] = useState('')
  const [workoutDis, setWorkoutDis] = useState(null)
  const [overallPercentage, setOverallPercentage] = useState(0)
  const [loading, setLoading] = useState(true)

  // Use theme colors
  const chartColors = [
    Colors.primary,
    '#ff6b6b',
    '#ffd93d',
    '#6bcf7f',
    '#4ecdc4',
    '#a8dadc'
  ];

  useFocusEffect(
    useCallback(() => {
      const getStats = async () => {
        try {
          const userId = await getUser();
          const dataResponse = await fetch(`${API_URL}/api/overall-stats?user_id=${userId}`);
          const fullData = await dataResponse.json();
          if (fullData.error) {
            Alert.alert('API Error', fullData.error);
            setLoading(false);
            return;
          }

          setCurrentStreak(fullData.current_streak);
          setLongestStreak(fullData.longest_streak)
          setLongestStreakStart(fullData.longest_streak_start)
          setLongestStreakEnd(fullData.longest_streak_end)
          setOverallPercentage(fullData.overall_percentage);
          setBestMonthPercentage(fullData.best_month_percentage)
          setBestMonthName(fullData.best_month_name)
          setWorkoutDis(fullData.workout_dis);
          setLoading(false)
        }
        catch (error) {
          Alert.alert('Error', 'Failed to fetch stats');
          setLoading(false)
        }
      };
      getStats()
    }, [])
  );

  const formatChartData = (workoutDis) => {
    return workoutDis.labels.map((label, index) => ({
      value: workoutDis.data[index],
      color: chartColors[index % chartColors.length],
      text: label
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <Spacer />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats Cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.statLabel}>CURRENT STREAK</ThemedText>
            <View style={styles.statValueRow}>
              <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                {currentStreak}
              </ThemedText>
              <ThemedText style={styles.statUnit}>{currentStreak === 1 ? "day" : "days"}</ThemedText>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.statLabel}>PERCENTAGE</ThemedText>
            <View style={styles.statValueRow}>
              <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                {overallPercentage}
              </ThemedText>
              <ThemedText style={styles.statUnit}>%</ThemedText>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.statLabel}>LONGEST STREAK</ThemedText>
            <View style={styles.statValueRow}>
              <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                {longestStreak}
              </ThemedText>
              <ThemedText style={styles.statUnit}>{longestStreak === 1 ? "day" : "days"}</ThemedText>
            </View>
            {longestStreakStart && longestStreakEnd && (() => {
              const start = new Date(longestStreakStart + 'T12:00:00Z');
              const end = new Date(longestStreakEnd + 'T12:00:00Z');
              const sameYear = start.getFullYear() === end.getFullYear();
              const startStr = start.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: sameYear ? undefined : 'numeric'
              });
              const endStr = end.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              });
              
              return (
                <ThemedText style={[styles.dateRange, { color: theme.text }]}>
                  {startStr} - {endStr}
                </ThemedText>
            );
          })()}
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.statLabel}>BEST MONTH</ThemedText>
            <View style={styles.statValueRow}>
              <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                {bestMonthPercentage}
              </ThemedText>
              <ThemedText style={styles.statUnit}>%</ThemedText>
            </View>
            <ThemedText style={[styles.dateRange, { color: theme.text }]}>{bestMonthName}</ThemedText>
          </View>
        </View>

        {/* Workout Distribution */}
        {workoutDis && workoutDis.labels.length > 0 && (
          <View style={[styles.chartSection, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.sectionLabel}>WORKOUT BREAKDOWN</ThemedText>

            <View style={styles.chartContainer}>
              <PieChart
                data={formatChartData(workoutDis)}
                donut
                radius={100}
                innerRadius={60}
                backgroundColor={theme.uiBackground}
                centerLabelComponent={() => (
                  <View style={styles.centerLabel}>
                    <ThemedText style={[styles.centerLabelText, { color: theme.text }]}>
                      Total
                    </ThemedText>
                    <ThemedText style={[styles.centerLabelValue, { color: Colors.primary }]}>
                      {workoutDis.data.reduce((a, b) => a + b, 0)}
                    </ThemedText>
                  </View>
                )}
              />
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {workoutDis.labels.map((label, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: chartColors[index % chartColors.length] }]} />
                  <ThemedText style={styles.legendLabel}>
                    {label}
                  </ThemedText>
                  <ThemedText style={[styles.legendValue, { color: theme.text }]}>
                    {workoutDis.data[index]}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {!loading && (!workoutDis || workoutDis.labels.length === 0) && (
          <View style={[styles.emptyState, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={[styles.emptyText, { color: theme.text }]}>
              No workouts logged yet. Start tracking to see your stats!
            </ThemedText>
          </View>
        )}

      </ScrollView>
    </ThemedView>
  );
}

export default OverallStats;