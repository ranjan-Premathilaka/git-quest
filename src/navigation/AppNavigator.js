import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import { colors } from '../constants/theme';
import {
  WelcomeScreen,
  OnboardingScreen,
  DashboardScreen,
  LessonsScreen,
  LessonDetailsScreen,
  TerminalScreen,
  BranchVisualizerScreen,
  ProfileScreen,
  QuizScreen,
} from '../screens';

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
      <Stack.Screen
        name={ROUTES.ONBOARDING}
        component={OnboardingScreen}
      />
      <Stack.Screen
        name={ROUTES.DASHBOARD}
        component={DashboardScreen}
      />
      <Stack.Screen
        name={ROUTES.LESSONS}
        component={LessonsScreen}
      />
      <Stack.Screen
        name={ROUTES.LESSON_DETAILS}
        component={LessonDetailsScreen}
      />
      <Stack.Screen
        name={ROUTES.TERMINAL}
        component={TerminalScreen}
      />
      <Stack.Screen
        name={ROUTES.BRANCH_VISUALIZER}
        component={BranchVisualizerScreen}
      />
      <Stack.Screen
        name={ROUTES.QUIZ}
        component={QuizScreen}
      />
      <Stack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
}
