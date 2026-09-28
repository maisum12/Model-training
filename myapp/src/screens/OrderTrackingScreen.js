// src/screens/OrderTrackingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const STAGES = ['Pending', 'Preparing', 'Ready', 'Served'];

export const OrderTrackingScreen = () => {
  const { theme } = useTheme();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setCurrentStageIndex(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 10000);

    const clockTimer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Order Tracking</Text>
      <Text style={[styles.timer, { color: theme.primary }]}>Elapsed Time: {formatTime(elapsedSeconds)}</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {STAGES.map((stage, index) => {
          const isDone = index <= currentStageIndex;
          return (
            <View key={stage} style={styles.stepRow}>
              <View style={[styles.bullet, { backgroundColor: isDone ? theme.primary : theme.border }]} />
              <Text style={[styles.stepText, { color: isDone ? theme.text : theme.subText, fontWeight: isDone ? 'bold' : 'normal' }]}>
                {stage}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  timer: { fontSize: 18, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  card: { borderWidth: 1, borderRadius: 12, padding: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  bullet: { width: 16, height: 16, borderRadius: 8, marginRight: 15 },
  stepText: { fontSize: 16 },
});