import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getMessage = async () => {
      const response = await fetch(`${API_URL}/api/message`);
      const data = await response.json();
      setMessage(data.text);
    };
    
    getMessage();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title} title={true}>Workout Tracker</ThemedText>
      <ThemedText>{message}</ThemedText>
      <Link href="/profile" style = {styles.link}>
        <ThemedText>Profile Page</ThemedText>
      </Link>
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