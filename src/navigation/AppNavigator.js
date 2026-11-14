import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import { colors } from '../constants/theme';
import { WelcomeScreen } from '../screens';

const Stack = createNativeStackNavigator();

/**
 * Root Stack Navigator for Git Quest.
 * Uses a dark content style to prevent white screen flashes during transitions.
 */
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.WELCOME}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={ROUTES.WELCOME}
        component={WelcomeScreen}
      />
    </Stack.Navigator>
  );
}
