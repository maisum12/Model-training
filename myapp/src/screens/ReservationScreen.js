// src/screens/ReservationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useReservation } from '../hooks/useReservation';

const TIME_SLOTS = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

export const ReservationScreen = () => {
  const { theme } = useTheme();
  const { reservations, createReservation, cancelReservation, checkAvailability } = useReservation();
  
  const [date, setDate] = useState('2026-10-01');
  const [timeSlot, setTimeSlot] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [phone, setPhone] = useState('0300-1234567');

  const handleBookingAttempt = () => {
    if (!timeSlot) {
      Alert.alert('Error', 'Please select a time slot.');
      return;
    }
    if (!/^03\d{2}-\d{7}$/.test(phone)) {
      Alert.alert('Error', 'Invalid Pakistani phone format (03XX-XXXXXXX)');
      return;
    }
    const available = checkAvailability(date, timeSlot, parseInt(partySize));
    if (available.length === 0) {
      Alert.alert('Fully Booked', 'No tables available for this time slot.');
      return;
    }
    const table = available[0];
    createReservation({ 
      date, 
      timeSlot, 
      partySize: parseInt(partySize), 
      phone, 
      tableId: table.id, 
      tableNumber: table.number 
    });
    Alert.alert('Success', `Table #${table.number} reserved successfully!`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Table Reservation</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.subText }]}>Date (YYYY-MM-DD)</Text>
        <TextInput 
          style={[styles.input, { color: theme.text, borderColor: theme.border }]} 
          value={date} 
          onChangeText={setDate} 
        />

        <Text style={[styles.label, { color: theme.subText }]}>Party Size (Guests)</Text>
        <TextInput 
          style={[styles.input, { color: theme.text, borderColor: theme.border }]} 
          value={partySize} 
          onChangeText={setPartySize} 
          keyboardType="numeric" 
        />

        <Text style={[styles.label, { color: theme.subText }]}>Phone (03XX-XXXXXXX)</Text>
        <TextInput 
          style={[styles.input, { color: theme.text, borderColor: theme.border }]} 
          value={phone} 
          onChangeText={setPhone} 
        />

        <Text style={[styles.label, { color: theme.subText, marginTop: 10 }]}>Select Time Slot</Text>
        <View style={styles.slotsGrid}>
          {TIME_SLOTS.map(slot => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotBtn, 
                { 
                  backgroundColor: timeSlot === slot ? theme.primary : theme.card, 
                  borderColor: theme.border 
                }
              ]}
              onPress={() => setTimeSlot(slot)}
            >
              <Text style={{ color: timeSlot === slot ? '#FFF' : theme.text }}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.bookBtn, { backgroundColor: theme.primary, marginTop: 20 }]} 
          onPress={handleBookingAttempt}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Reserve Table</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: theme.text, marginTop: 20 }]}>My Reservations</Text>
      {reservations.length === 0 ? (
        <Text style={{ color: theme.subText, textAlign: 'center', marginBottom: 20 }}>No active reservations.</Text>
      ) : (
        reservations.map(res => (
          <View key={res.id} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>Table #{res.tableNumber} - {res.date} at {res.timeSlot}</Text>
            <Text style={{ color: theme.subText }}>Status: {res.status} | Guests: {res.partySize}</Text>
            {res.status === 'Confirmed' && (
              <TouchableOpacity onPress={() => cancelReservation(res.id)}>
                <Text style={{ color: 'red', marginTop: 6 }}>Cancel Reservation</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { fontSize: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 10 },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  slotBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderRadius: 6, marginBottom: 6 },
  bookBtn: { padding: 12, borderRadius: 6, alignItems: 'center' },
});