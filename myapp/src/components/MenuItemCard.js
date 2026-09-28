// src/components/MenuItemCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const MenuItemCard = React.memo(({ item, onAdd, onToggleFavorite, isFavorite }) => {
  const { theme } = useTheme();
  console.log(`Render MenuItemCard: ${item.name}`);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
            <Text style={{ fontSize: 18 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text numberOfLines={2} style={[styles.desc, { color: theme.subText }]}>{item.description}</Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.primary }]}>Rs. {item.price}</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: item.isAvailable ? theme.primary : theme.border }]}
            disabled={!item.isAvailable}
            onPress={() => onAdd(item)}
          >
            <Text style={styles.addText}>{item.isAvailable ? 'Add' : 'Unavailable'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', borderRadius: 12, padding: 10, marginVertical: 6, marginHorizontal: 16, borderWidth: 1 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  desc: { fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: 'bold', fontSize: 14 },
  addButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  addText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});