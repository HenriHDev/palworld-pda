import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppShell } from './src/components/layout/AppShell';

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0F172A" />
      <AppShell />
    </>
  );
}
