// src/screens/OrderSummaryScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const SERVICE_CHARGE_RATE = 0.05;
const TAX_RATE = 0.15;

export const OrderSummaryScreen = ({ navigation }) => {
  const { state, dispatch } = useCart();
  const { theme } = useTheme();
  const [promoInput, setPromoInput] = useState('');
  const [orderType, setOrderType] = useState('Dine-in');

  const { subtotal, serviceCharge, tax, discountAmount, grandTotal } = useMemo(() => {
    const sub = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const service = sub * SERVICE_CHARGE_RATE;
    const t = sub * TAX_RATE;
    const disc = (sub * state.discountPercent) / 100;
    const grand = sub + service + t - disc;
    return { subtotal: sub, serviceCharge: service, tax: t, discountAmount: disc, grandTotal: grand };
  }, [state.items, state.discountPercent]);

  const handlePlaceOrder = () => {
    Alert.alert('Success', 'Order placed successfully!', [
      { text: 'OK', onPress: () => { dispatch({ type: 'CLEAR_CART' }); navigation.navigate('CartMain'); } }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Order Summary</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {state.items.map(item => (
          <View key={item.id} style={styles.summaryRow}>
            <Text style={{ color: theme.text }}>{item.name} x {item.quantity}</Text>
            <Text style={{ color: theme.text }}>Rs. {item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.promoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput
          placeholder="Enter promo (WELCOME10 / FEAST20)"
          placeholderTextColor={theme.subText}
          style={[styles.promoInput, { color: theme.text }]}
          value={promoInput}
          onChangeText={setPromoInput}
        />
        <TouchableOpacity
          style={[styles.promoBtn, { backgroundColor: theme.primary }]}
          onPress={() => dispatch({ type: 'APPLY_PROMO', payload: promoInput })}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Apply</Text>
        </TouchableOpacity>
      </View>
      {state.promoError ? <Text style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{state.promoError}</Text> : null}
      {state.promoCode ? <Text style={{ color: 'green', fontSize: 12, marginBottom: 8 }}>Promo {state.promoCode} applied ({state.discountPercent}%)</Text> : null}

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.summaryRow}><Text style={{ color: theme.subText }}>Subtotal</Text><Text style={{ color: theme.text }}>Rs. {subtotal.toFixed(2)}</Text></View>
        <View style={styles.summaryRow}><Text style={{ color: theme.subText }}>Service Charge (5%)</Text><Text style={{ color: theme.text }}>Rs. {serviceCharge.toFixed(2)}</Text></View>
        <View style={styles.summaryRow}><Text style={{ color: theme.subText }}>Sales Tax (15%)</Text><Text style={{ color: theme.text }}>Rs. {tax.toFixed(2)}</Text></View>
        {state.discountPercent > 0 && (
          <View style={styles.summaryRow}><Text style={{ color: 'green' }}>Discount</Text><Text style={{ color: 'green' }}>-Rs. {discountAmount.toFixed(2)}</Text></View>
        )}
        <View style={[styles.summaryRow, { borderTopWidth: 1, borderColor: theme.border, marginTop: 8, paddingTop: 8 }]}>
          <Text style={[styles.grandText, { color: theme.text }]}>Grand Total</Text>
          <Text style={[styles.grandText, { color: theme.primary }]}>Rs. {grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.typeRow}>
        {['Dine-in', 'Takeaway'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeBtn, { backgroundColor: orderType === type ? theme.primary : theme.card, borderColor: theme.border }]}
            onPress={() => setOrderType(type)}
          >
            <Text style={{ color: orderType === type ? '#FFF' : theme.text, fontWeight: 'bold' }}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.orderBtn, { backgroundColor: theme.primary }]} onPress={handlePlaceOrder}>
        <Text style={styles.orderBtnText}>Confirm and Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  promoBox: { flexDirection: 'row', borderWidth: 1, borderRadius: 8, padding: 6, marginBottom: 8, alignItems: 'center' },
  promoInput: { flex: 1, paddingHorizontal: 8 },
  promoBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  grandText: { fontWeight: 'bold', fontSize: 16 },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  typeBtn: { flex: 1, padding: 12, borderWidth: 1, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  orderBtn: { padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  orderBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});