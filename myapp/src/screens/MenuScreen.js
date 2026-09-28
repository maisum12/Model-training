// src/screens/MenuScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { initialMenu } from '../data/menu';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const { dispatch } = useCart();

  // Refs as required by Question 5
  const searchInputRef = useRef(null);
  const flatListRef = useRef(null);
  const renderCountRef = useRef(0);
  const debounceTimerRef = useRef(null);
  const lastQueryRef = useRef('');

  renderCountRef.current += 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuItems(initialMenu);
      setFilteredItems(initialMenu);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (text) => {
    setSearchText(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      let result = menuItems;
      if (selectedCategory !== 'All') {
        result = result.filter(item => item.category === selectedCategory);
      }
      if (text.trim()) {
        result = result.filter(item => item.name.toLowerCase().includes(text.toLowerCase()));
        
        if (text !== lastQueryRef.current) {
          lastQueryRef.current = text;
          setRecentSearches(prev => [text, ...prev.filter(q => q !== text)].slice(0, 5));
        }
      }
      setFilteredItems(result);
    }, 400);
  };

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.debugLabel}>Renders: {renderCountRef.current}</Text>

      <Text style={styles.headerTitle}>Search Menu</Text>

      <View style={styles.searchBox}>
        <TextInput
          ref={searchInputRef}
          placeholder="Search items..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearchChange}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => handleSearchChange('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {searchText === '' && recentSearches.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
          {recentSearches.map((term, index) => (
            <TouchableOpacity key={index} style={styles.suggestionChip} onPress={() => handleSearchChange(term)}>
              <Text style={styles.suggestionText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.activeChip]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.activeChipText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        ref={flatListRef}
        data={filteredItems}
        keyExtractor={item => item.id}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;
          setShowScrollTop(offsetY > 300);
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No items match your search.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.isAvailable && styles.unavailableCard]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardInfo}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                {item.isSpecial && <Text style={styles.badge}>Special</Text>}
              </View>
              <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
              <View style={styles.row}>
                <Text style={styles.price}>Rs. {item.price}</Text>
                <TouchableOpacity
                  style={[styles.addBtn, !item.isAvailable && styles.disabledBtn]}
                  disabled={!item.isAvailable}
                  onPress={() => handleAddToCart(item)}
                >
                  <Text style={styles.addBtnText}>{item.isAvailable ? 'Add' : 'N/A'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollTopBtn}
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        >
          <Text style={styles.scrollTopText}>↑ Top</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16, paddingTop: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  debugLabel: { fontSize: 10, color: '#888', textAlign: 'right', marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 12, marginBottom: 8 },
  searchInput: { flex: 1, paddingVertical: 10 },
  clearText: { fontSize: 16, color: '#888', paddingLeft: 8 },
  suggestionsContainer: { maxHeight: 35, marginBottom: 8 },
  suggestionChip: { backgroundColor: '#E9ECEF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 6 },
  suggestionText: { fontSize: 12, color: '#333' },
  categoryContainer: { maxHeight: 50, marginBottom: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#FFF', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E0E0E0', height: 36 },
  activeChip: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
  chipText: { color: '#333', fontWeight: '600' },
  activeChipText: { color: '#FFF' },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  unavailableCard: { opacity: 0.6 },
  image: { width: 80, height: 80, borderRadius: 8 },
  cardInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  badge: { backgroundColor: '#FFD93D', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
  desc: { fontSize: 12, color: '#666' },
  price: { fontWeight: 'bold', color: '#FF6B6B', fontSize: 14 },
  addBtn: { backgroundColor: '#FF6B6B', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  disabledBtn: { backgroundColor: '#CCC' },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' },
  scrollTopBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#FF6B6B', padding: 12, borderRadius: 25, elevation: 5 },
  scrollTopText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});