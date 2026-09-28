// src/screens/ManagerDashboardScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ManagerDashboardScreen = () => {
  const { theme } = useTheme();
  const [tab, setTab] = useState('orders');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Manager Dashboard</Text>
      
      <View style={styles.tabRow}>
        {['orders', 'reservations', 'menu'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, { backgroundColor: tab === t ? theme.primary : theme.card, borderColor: theme.border }]}
            onPress={() => setTab(t)}
          >
            <Text style={{ color: tab === t ? '#FFF' : theme.text, textTransform: 'capitalize', fontWeight: 'bold' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {tab === 'orders' && <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>Incoming customer orders list & status toggles.</Text>}
        {tab === 'reservations' && <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>Manage table booking requests (Accept / Decline).</Text>}
        {tab === 'menu' && <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>Menu Management: Add item, edit prices, toggle availability.</Text>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  tabBtn: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
});