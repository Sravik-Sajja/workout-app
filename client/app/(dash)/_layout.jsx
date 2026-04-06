import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { MaterialCommunityIcons } from '@expo/vector-icons/MaterialCommunityIcons'

const DashboardLayout = () => {

    const colorScheme= useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    return (
       <Tabs 
            screenOptions={{ headerShown: false, tabBarStyle: {
                backgroundColor: theme.navBackground,
                paddingTop: 10,
                height: 90
            },
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: theme.iconColor
        }}
       >
        <Tabs.Screen name="tips" options={{ title: "Tips", tabBarIcon: ({ focused }) => (
            <Ionicons
            size={24}
            name={focused ? 'bulb' : 'bulb-outline'}
            color={focused ? Colors.primary : theme.iconColor}
            />
        )
        }}/>
        <Tabs.Screen name="workout" options={{ title: "Workout", tabBarIcon: ({ focused }) => (
            <Ionicons
            size={24}
            name={focused ? 'walk' : 'walk-outline'}
            color={focused ? Colors.primary : theme.iconColor}
            />
        )
        }}/>
        <Tabs.Screen name="stats" options={{ title: "Stats", tabBarIcon: ({ focused }) => (
            <Ionicons
            size={24}
            name={focused ? 'stats-chart' : 'stats-chart-outline'}
            color={focused ? Colors.primary : theme.iconColor}
            />
        )
        }}/>
       
       </Tabs>
    )
}

export default DashboardLayout