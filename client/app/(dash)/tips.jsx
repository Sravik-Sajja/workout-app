import { ScrollView, View, StyleSheet, Pressable, Alert } from "react-native";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tipsStyles from "../../styles/tipsStyles";
import { useEffect, useState } from "react";
import { getUser } from "../../lib/getUser";


const styles = tipsStyles;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const CATEGORY_STYLES = {
  "Recovery":             { color: "#185FA5", bg: "#E6F1FB", icon: "time-outline" },
  "Progressive overload": { color: "#3B6D11", bg: "#EAF3DE", icon: "trending-up-outline" },
  "Consistency":          { color: "#534AB7", bg: "#EEEDFE", icon: "calendar-outline" },
  "Muscle imbalance":     { color: "#993C1D", bg: "#FAECE7", icon: "body-outline" },
  "Habit insight":        { color: "#854F0B", bg: "#FAEEDA", icon: "bulb-outline" },
  "Frequency":            { color: "#0F6E56", bg: "#E1F5EE", icon: "repeat-outline" },
}

const DEFAULT_STYLE = { color: "#888780", bg: "#F1EFE8", icon: "fitness-outline" }

const TipCard = ({ tip, theme }) => {
  const { color, bg, icon } = CATEGORY_STYLES[tip.category] ?? DEFAULT_STYLE;

  return (
    <Pressable style={[styles.tipCard, { borderBottomColor: theme.text + '20' }]}>
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.tipContent}>
        <ThemedText style={[styles.tipTag, { color }]}>{tip.category}</ThemedText>
        <ThemedText style={styles.tipTitle}>{tip.title}</ThemedText>
        <ThemedText style={[styles.tipBody, { color: theme.text }]}>{tip.body}</ThemedText>
      </View>
      <ThemedText style={[styles.arrow, { color: theme.text }]}>›</ThemedText>
    </Pressable>
  )
}

const Tips = () => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const [allTips, setAllTips] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchAllTips()
  }, [])

  const fetchAllTips = async () => {
    try {
      const userId = await getUser();
      const tipsResponse = await fetch(`${API_URL}/api/get-tips?user_id=${userId}`);
      const fullTipsData = await tipsResponse.json();
      if (fullTipsData.error) {
        Alert.alert('API Error', fullTipsData.error);
        return;
      }
      setAllTips(fullTipsData.tips)
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tips');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.aiBadge, { backgroundColor: theme.uiBackground, borderColor: theme.text + '30' }]}>
            <Ionicons name="sparkles" size={12} color={theme.text} />
            <ThemedText style={styles.aiText}>AI-powered</ThemedText>
          </View>
          <ThemedText style={styles.pageTitle}>Tips for you</ThemedText>
          <ThemedText style={[styles.pageSub, { color: theme.text }]}>
            Personalised insights based on your training data
          </ThemedText>
        </View>

        {allTips.slice(0, 2).map((tip, i) => <TipCard key={i} tip={tip} theme={theme} />)}

        {allTips.slice(2, 4).map((tip, i) => <TipCard key={i} tip={tip} theme={theme} />)}
      </ScrollView>
    </ThemedView>
  );
};

export default Tips;