import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from "../constants/Colors"
import { StatusBar } from 'expo-status-bar'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <>
            <StatusBar value="auto" />
            <Stack screenOptions={{
                    headerStyle: {backgroundColor: theme.navBackground},
                    headerTintColor: theme.title
                }}>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="(dash)" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}

export default RootLayout