import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "@screens/DashboardScreen";
import WalletScreen from "@screens/WalletScreen";
import NotificationsScreen from "@screens/NotificationsScreen";
import JaphaCoachScreen from "@screens/JaphaCoachScreen";
import { tokens } from "@theme/tokens";

export type MainTabParamList = {
  Dashboard: undefined;
  Wallet: undefined;
  Notifications: undefined;
  JaphaCoach: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type IconName = keyof typeof Ionicons.glyphMap;

const getTabIcon = (routeName: string, focused: boolean): IconName => {
  const icons: Record<string, { focused: IconName; unfocused: IconName }> = {
    Dashboard: { focused: "home", unfocused: "home-outline" },
    Wallet: { focused: "wallet", unfocused: "wallet-outline" },
    Notifications: { focused: "notifications", unfocused: "notifications-outline" },
    JaphaCoach: { focused: "sparkles", unfocused: "sparkles-outline" },
  };
  return focused ? icons[routeName].focused : icons[routeName].unfocused;
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.color.surface,
          borderTopColor: tokens.color.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarActiveTintColor: tokens.color.gold,
        tabBarInactiveTintColor: tokens.color.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen
        name="JaphaCoach"
        component={JaphaCoachScreen}
        options={{ title: "Japha AI" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

