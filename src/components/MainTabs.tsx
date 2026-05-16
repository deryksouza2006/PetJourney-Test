import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types';

import HomeScreen from '../screens/HomeScreen';
import PetListScreen from '../screens/PetListScreen';
import AgendaScreen from '../screens/AgendaScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#9BA8B4',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8ECF0',
          borderTopWidth: 1,
          height: 68 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 14),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Pets') iconName = 'paw-outline';
          if (route.name === 'Agenda') iconName = 'calendar-outline';
          if (route.name === 'Perfil') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Pets" component={PetListScreen} options={{ title: 'Meus Pets' }} />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={{ title: 'Agenda' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}