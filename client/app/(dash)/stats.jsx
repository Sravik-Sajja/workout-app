import { useState, useCallback } from "react";
import { StyleSheet, Alert, ScrollView, View, useColorScheme } from 'react-native';
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import Spacer from "../../components/Spacer";
import { supabase } from '../../lib/supabase'
import { useFocusEffect } from 'expo-router';
import { PieChart } from 'react-native-gifted-charts';
import { Colors } from "../../constants/Colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Stats = () => {
  const colorScheme = useColorScheme() || 'light'
  const theme = Colors[colorScheme]

  const [currentStreak, setCurrentStreak] = useState(0)
  const [workoutDis, setWorkoutDis] = useState(null)
  const [percentage, setPercentage] = useState(0)
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
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            setLoading(false)
            Alert.alert('Error', userError?.message || 'Unable to get user info.')
            return
          }
          const dataResponse = await fetch(`${API_URL}/api/overall-stats?user_id=${user.id}`);
          const fullData = await dataResponse.json();
          setCurrentStreak(fullData.streak);
          setPercentage(fullData.percentage);
          setWorkoutDis(fullData.workoutDis);
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
              <ThemedText style={styles.statUnit}>days</ThemedText>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: theme.uiBackground }]}>
            <ThemedText style={styles.statLabel}>PERCENTAGE</ThemedText>
            <View style={styles.statValueRow}>
              <ThemedText style={[styles.statValue, { color: Colors.primary }]}>
                {percentage}
              </ThemedText>
              <ThemedText style={styles.statUnit}>%</ThemedText>
            </View>
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

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.6,
  },
  chartSection: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 12,
    opacity: 0.6,
  },
  centerLabelValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  legend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.6,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.6,
  },
});