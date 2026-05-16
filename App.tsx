import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './src/types';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterTutorScreen from './src/screens/RegisterTutorScreen';
import PetFormScreen from './src/screens/PetFormScreen';
import ReminderFormScreen from './src/screens/ReminderFormScreen';
import WeightScreen from './src/screens/WeightScreen';
import MainTabs from './src/components/MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F5F7FA' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterTutor" component={RegisterTutorScreen} />
        <Stack.Screen name="PetForm" component={PetFormScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ReminderForm" component={ReminderFormScreen} />
        <Stack.Screen name="Weight" component={WeightScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
