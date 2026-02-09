import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import ThemedButton from '../components/ThemedButton';
import Spacer from '../components/Spacer';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMessage = () => {
      fetch(`${API_URL}/api/message`)
        .then(response => response.json())
        .then(data => setMessage(data.text));
    };
    
    getMessage();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} title={true}>Workout Tracker</ThemedText>
      <Spacer height={20}/>
      <ThemedText>{message}</ThemedText>

      <Link href="/profile" style = {styles.link}>
        <ThemedText>Profile Page</ThemedText>
      </Link>
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