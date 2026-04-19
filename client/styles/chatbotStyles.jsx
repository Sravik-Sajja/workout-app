import { StyleSheet } from "react-native";

const chatbotStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        padding: 16,
        gap: 10,
        paddingBottom: 8,
    },
    bubble: {
        maxWidth: "80%",
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    userBubble: {
        alignSelf: "flex-end",
        borderBottomRightRadius: 4,
    },
    botBubble: {
        alignSelf: "flex-start",
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: 12,
        gap: 10,
        borderTopWidth: 0.5,
        borderTopColor: "transparent",
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
        borderWidth: 1,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    sendText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});
export default chatbotStyles;