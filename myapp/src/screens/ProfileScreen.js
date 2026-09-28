import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Profile & Settings</Text>
      
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.subText }]}>Name:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.name}</Text>

        <Text style={[styles.label, { color: theme.subText }]}>Email:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{user?.email}</Text>

        <Text style={[styles.label, { color: theme.subText }]}>Role:</Text>
        <Text style={[styles.value, { color: theme.text, textTransform: 'capitalize' }]}>{user?.role}</Text>
      </View>

      <View style={[styles.row, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Dark Theme</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.primary }]} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { fontSize: 12, marginTop: 8 },
  value: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 20 },
  logoutBtn: { padding: 14, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});