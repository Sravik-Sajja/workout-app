import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import ThemedButton from '../components/ThemedButton';
import Spacer from '../components/Spacer';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/Colors';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Home = () => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/workout');
      else setChecking(false);
    };
    checkSession();
  }, []);

  if (checking) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} title={true}>Workout Tracker</ThemedText>
      <Spacer />

      <ThemedButton onPress={() => router.push('/login')}>
          <ThemedText>Login</ThemedText>
      </ThemedButton>

      <ThemedButton onPress={() => router.push('/register')}>
          <ThemedText>Register</ThemedText>
      </ThemedButton>

      <StatusBar style="auto" />
    </ThemedView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  }
});