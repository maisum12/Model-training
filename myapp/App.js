// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { CartProvider, useCart } from './src/context/CartContext';

import { LoginSignupScreen } from './src/screens/LoginSignupScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CartScreen } from './src/screens/CartScreen';
import { OrderSummaryScreen } from './src/screens/OrderSummaryScreen';
import { ReservationScreen } from './src/screens/ReservationScreen';
import { OrderTrackingScreen } from './src/screens/OrderTrackingScreen';
import { ManagerDashboardScreen } from './src/screens/ManagerDashboardScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartMain" component={CartScreen} />
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { state } = useCart();
  
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  if (!user) {
    return <LoginSignupScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.primary,
      }}
    >
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
      <Tab.Screen 
        name="CartTab" 
        component={CartStack} 
        options={{ 
          title: 'Cart', 
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          headerShown: false
        }} 
      />
      <Tab.Screen name="Reservation" component={ReservationScreen} options={{ title: 'Reserve' }} />
      <Tab.Screen name="Tracking" component={OrderTrackingScreen} options={{ title: 'Tracking' }} />
      {user.role === 'manager' && (
        <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} options={{ title: 'Dashboard' }} />
      )}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}