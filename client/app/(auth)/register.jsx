import { StyleSheet, Text,  Alert, TextInput, useColorScheme } from 'react-native'
import { useState } from "react";
import { Link } from 'expo-router'
import { Colors } from "../../constants/Colors"

import ThemedView from '../../components/ThemedView'
import Spacer from '../../components/Spacer'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'expo-router';

const Register = () => {
    const router = useRouter()
    const colorScheme = useColorScheme() ?? 'light'
    const theme = Colors[colorScheme]

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const[loading, setLoading] = useState(false)
    const handleSubmit = async () => {
        if (!password || !confirmPassword || !email) return
        if(password !== confirmPassword) return

        setLoading(true)
        const {error} = await supabase.auth.signUp({email, password})
        setLoading(false)

        if(error){
            Alert.alert('Error', error)
        }
        else {
            Alert.alert('Success', 'Registered!')
            router.push('/profile')
        }
    }
    return (
       <ThemedView style={styles.container}>

            <Spacer />
            <ThemedText title={true} style={styles.title}>
                Register For An Account
            </ThemedText>

            <ThemedText type="defaultSemiBold" style={styles.label}>
                Email address
            </ThemedText>
            <TextInput
                style={[styles.input, { borderColor: theme.text, color: theme.text, backgroundColor: theme.background }]}
                placeholder="Enter your email"
                placeholderTextColor={theme.text}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(t) => { setEmail(t) }}
            />

            <ThemedText type="defaultSemiBold" style={styles.label}>
                Password
            </ThemedText>
            <TextInput
                style={[styles.input, { borderColor: theme.text, color: theme.text, backgroundColor: theme.background }]}
                placeholder="Enter your password"
                placeholderTextColor={theme.text}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <ThemedText type="defaultSemiBold" style={styles.label}>
                Confirm your Password
            </ThemedText>
            <TextInput
                style={[styles.input, { borderColor: theme.text, color: theme.text, backgroundColor: theme.background }]}
                placeholder="Enter your confirmed password"
                placeholderTextColor={theme.text}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <ThemedButton onPress={handleSubmit} disabled={loading}>
                <Text style={{ color: "#f2f2f2" }}>Register</Text>
            </ThemedButton>
            
            <Spacer height={100} />
            <Link href="/login">
                <ThemedText style={{ textAlign: 'center' }}>
                    Login Instead
                </ThemedText>
            </Link>

       </ThemedView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 30
    },
    input: {
        width: '100%',
        borderWidth: 1.5,
        borderRadius: 6,
        padding: 14,
        fontSize: 16,
        marginBottom: 12,
    },
})
