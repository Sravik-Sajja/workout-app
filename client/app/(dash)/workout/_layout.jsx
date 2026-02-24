import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default function WorkoutLayout() {
    const colorScheme = useColorScheme() || 'light';
    const theme = Colors[colorScheme];
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="workoutDetails" 
                options={{ 
                    title: "Workout Details",
                    headerBackTitle: "Workout",
                    headerStyle: {
                    backgroundColor: theme.navBackground,
                    },
                    headerTintColor: theme.title,
                    headerTitleStyle: {
                    fontWeight: '600',
                    },
                }} 
            />
        </Stack>
    );
}