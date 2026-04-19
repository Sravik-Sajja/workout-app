import { useState, useRef } from "react";
import { View, TextInput, ScrollView, Pressable, ActivityIndicator, useColorScheme, KeyboardAvoidingView, Platform } from "react-native";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";
import { getUser } from "../../lib/getUser";
import Spacer from "../../components/Spacer";
import chatbotStyles from "../../styles/chatbotStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";
const styles = chatbotStyles;

const Chatbot = () => {
    const colorScheme = useColorScheme() || "light";
    const theme = Colors[colorScheme];

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hey! Ask me anything about your workouts — progress, volume, exercise tips, you name it.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage = { role: "user", text: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const userId = await getUser();
            const response = await fetch(
                `${API_URL}/api/get-chatbot-response?user_id=${userId}&user_prompt=${encodeURIComponent(trimmed)}`
            );
            const data = await response.json();

            const botMessage = {
                role: "assistant",
                text: data.response ?? "Sorry, I couldn't get a response.",
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "Failed to connect to server." },
            ]);
        } finally {
            setLoading(false);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Spacer />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                <ScrollView
                    ref={scrollRef}
                    style={styles.messageList}
                    contentContainerStyle={styles.messageListContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                >
                    {messages.map((msg, index) => (
                        <View
                            key={index}
                            style={[
                                styles.bubble,
                                msg.role === "user"
                                    ? [styles.userBubble, { backgroundColor: Colors.primary }]
                                    : [styles.botBubble, { backgroundColor: theme.uiBackground }],
                            ]}
                        >
                            <ThemedText
                                style={[
                                    styles.bubbleText,
                                    msg.role === "user" && { color: "#fff" },
                                ]}
                            >
                                {msg.text}
                            </ThemedText>
                        </View>
                    ))}

                    {loading && (
                        <View style={[styles.bubble, styles.botBubble, { backgroundColor: theme.uiBackground }]}>
                            <ActivityIndicator size="small" color={Colors.primary} />
                        </View>
                    )}
                </ScrollView>

                <View style={[styles.inputRow, { backgroundColor: theme.navBackground }]}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.uiBackground,
                                color: theme.title,
                                borderColor: theme.uiBackground,
                            },
                        ]}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask about your workouts..."
                        placeholderTextColor={theme.text}
                        multiline
                        onSubmitEditing={sendMessage}
                    />
                    <Pressable
                        onPress={sendMessage}
                        disabled={loading || !input.trim()}
                        style={({ pressed }) => [
                            styles.sendButton,
                            { backgroundColor: Colors.primary, opacity: pressed || !input.trim() ? 0.5 : 1 },
                        ]}
                    >
                        <ThemedText style={styles.sendText}>↑</ThemedText>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
    );
};

export default Chatbot;