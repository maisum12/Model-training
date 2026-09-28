// src/screens/CartScreen.js
import React from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const CartScreen = ({ navigation }) => {
  const { state, dispatch } = useCart();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Your Cart</Text>
      
      <FlatList
        data={state.items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.row}>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <TouchableOpacity onPress={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}>
                <Text style={{ color: 'red' }}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.itemPrice, { color: theme.primary }]}>Rs. {item.price * item.quantity}</Text>
            
            <View style={styles.stepperRow}>
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => dispatch({ type: 'DECREMENT', payload: { id: item.id } })}>
                  <Text style={[styles.stepBtn, { color: theme.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.stepVal, { color: theme.text }]}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => dispatch({ type: 'INCREMENT', payload: { id: item.id } })}>
                  <Text style={[styles.stepBtn, { color: theme.text }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              placeholder="Special instructions (e.g. no onions)"
              placeholderTextColor={theme.subText}
              style={[styles.noteInput, { color: theme.text, borderColor: theme.border }]}
              value={item.note}
              onChangeText={text => dispatch({ type: 'UPDATE_NOTE', payload: { id: item.id, note: text } })}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.subText }]}>Your cart is empty.</Text>}
      />

      {state.items.length > 0 && (
        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('OrderSummary')}
        >
          <Text style={styles.checkoutText}>Proceed to Summary</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  itemCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontWeight: 'bold', marginVertical: 4 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  stepper: { flexDirection: 'row', borderWidth: 1, borderRadius: 6, alignItems: 'center', paddingHorizontal: 8 },
  stepBtn: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 8 },
  stepVal: { marginHorizontal: 8, fontWeight: 'bold' },
  noteInput: { borderWidth: 1, borderRadius: 6, padding: 6, fontSize: 12, marginTop: 6 },
  empty: { textAlign: 'center', marginTop: 40 },
  checkoutBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  checkoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});