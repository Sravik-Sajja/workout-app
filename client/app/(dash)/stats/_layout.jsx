import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../../constants/Colors"

const StatsLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} theme={theme} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="recent_stats" options={{ title: "Recent" }} />
            <Tabs.Screen name="overall_stats" options={{ title: "Overall" }} />
            <Tabs.Screen name="weight_stats" options={{ title: "Weight" }} />
        </Tabs>
    )
}

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

const CustomTabBar = ({ state, descriptors, navigation, theme }) => {
    return (
        <View style={[styles.tabBar, { backgroundColor: theme.navBackground }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]
                const label = options.title || route.name
                const isFocused = state.index === index

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(route.name)}
                        style={styles.tab}
                    >
                        <Text style={[styles.label, { color: isFocused ? Colors.primary : theme.iconColor, opacity: isFocused ? 1 : 0.4 }]}>
                            {label}
                        </Text>
                        {isFocused && <View style={[styles.indicator, { backgroundColor: Colors.primary }]} />}
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        paddingTop: 55,
        paddingBottom: 8,
        position: 'absolute',
        top: 0, 
        left: 0, 
        right: 0,
        zIndex: 100, 
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
    },
    indicator: {
        height: 2,
        width: '60%',
        marginTop: 4,
        borderRadius: 2,
    }
})

export default StatsLayout