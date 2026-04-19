import { ScrollView, View, Pressable, Alert, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tipsStyles from "../../styles/tipsStyles";
import tipModalStyles from "../../styles/tipModalStyles";
import { useEffect, useState } from "react";
import { getUser } from "../../lib/getUser";

const styles = tipsStyles;
const ms = tipModalStyles;

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

const TipModal = ({ tip, visible, onClose, theme, colorScheme }) => {
  if (!tip) return null;

  const isDark = colorScheme === "dark";
  const { color, bg, icon } = CATEGORY_STYLES[tip.category] ?? DEFAULT_STYLE;

  const reasonBg = isDark ? color + "20" : bg;
  const reasonBorder = isDark ? color + "40" : color + "25";
  const reasonLabelColor = isDark ? color : color;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={ms.backdrop} onPress={onClose}>
        <Pressable
          style={[ms.sheet, { backgroundColor: theme.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          
          <TouchableOpacity
            style={[ms.closeBtn, { backgroundColor: theme.text + "15" }]}
            onPress={onClose}
            hitSlop={10}
          >
            <Ionicons name="close" size={15} color={theme.text} />
          </TouchableOpacity>

          <View style={ms.categoryRow}>
            <View style={[ms.categoryIconWrap, { backgroundColor: isDark ? color + "25" : bg }]}>
              <Ionicons name={icon} size={16} color={color} />
            </View>
            <ThemedText style={[ms.categoryTag, { color }]}>
              {tip.category}
            </ThemedText>
          </View>

          <ThemedText style={ms.modalTitle}>{tip.title}</ThemedText>

          <View style={ms.tipSection}>
            <ThemedText style={[ms.sectionLabel, { color: theme.text }]}>Tip</ThemedText>
            <ThemedText style={[ms.modalBody, { color: theme.text }]}>{tip.body}</ThemedText>
          </View>

          {tip.reason ? (
            <View style={[ms.reasonSection, { backgroundColor: reasonBg, borderWidth: 0.5, borderColor: reasonBorder }]}>
              <ThemedText style={[ms.reasonLabel, { color: reasonLabelColor }]}>
                Why
              </ThemedText>
              <ThemedText style={[ms.reasonText, { color: theme.text }]}>
                {tip.reason}
              </ThemedText>
            </View>
          ) : null}

          {tip.show ? (
            <View style={ms.showSection}>
              <ThemedText style={[ms.sectionLabel, { color: theme.text }]}>Based on</ThemedText>
              <View style={[ms.showBadge, { backgroundColor: isDark ? color + "20" : bg, borderColor: reasonBorder }]}>
                <Ionicons name="bar-chart-outline" size={12} color={color} />
                <ThemedText style={[ms.showBadgeText, { color }]}>{tip.show}</ThemedText>
              </View>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const TipCard = ({ tip, theme, onPress }) => {
  const { color, bg, icon } = CATEGORY_STYLES[tip.category] ?? DEFAULT_STYLE;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tipCard,
        { borderBottomColor: theme.text + "20", opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => onPress(tip)}
    >
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
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [allTips, setAllTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleTipPress = (tip) => {
    setSelectedTip(tip);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedTip(null), 300);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.aiBadge, { backgroundColor: theme.uiBackground, borderColor: theme.text + "30" }]}>
            <Ionicons name="sparkles" size={12} color={theme.text} />
            <ThemedText style={styles.aiText}>AI-powered</ThemedText>
          </View>
          <ThemedText style={styles.pageTitle}>Tips for you</ThemedText>
          <ThemedText style={[styles.pageSub, { color: theme.text }]}>
            Personalised insights based on your training data
          </ThemedText>
        </View>

        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <ThemedText style={{ opacity: 0.5, fontSize: 14 }}>Analyzing your training data...</ThemedText>
          </View>
        ) : (
          allTips.slice(0, 4).map((tip, i) => (
            <TipCard key={i} tip={tip} theme={theme} onPress={handleTipPress} />
          ))
        )}
      </ScrollView>

      <TipModal
        tip={selectedTip}
        visible={modalVisible}
        onClose={handleClose}
        theme={theme}
        colorScheme={colorScheme}
      />
    </ThemedView>
  );
};

export default Tips;