import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { WelcomeScreen } from './src/screens';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0B0F19" />
      <WelcomeScreen />
    </>
  );
}
