import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginSignupScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();

  const handleFieldChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (field === 'name') setName(value);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleValidateAndSubmit = async () => {
    let newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/.test(email);

    if (!email || !emailRegex) newErrors.email = 'Valid email format required.';
    if (!password || password.length < 8 || !/\d/.test(password)) {
      newErrors.password = 'Password must be 8+ chars and contain a digit.';
    }
    if (isSignup) {
      if (!name) newErrors.name = 'Full name required.';
      if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(async () => {
        setIsSubmitting(false);
        const res = await login(email, password);
        if (!res.success && !isSignup) {
          Alert.alert('Login Failed', res.message);
        } else if (isSignup) {
          Alert.alert('Success', 'Account created! You are now logged in.');
          await login(email, password);
        }
      }, 1000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{isSignup ? 'Create Account' : 'Welcome Back'}</Text>

      {isSignup && (
        <>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={theme.subText}
            style={[styles.input, { color: theme.text, borderColor: errors.name ? 'red' : theme.border }]}
            value={name}
            onChangeText={(t) => handleFieldChange('name', t)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </>
      )}

      <TextInput
        placeholder="Email (e.g. customer@restaurant.com)"
        placeholderTextColor={theme.subText}
        style={[styles.input, { color: theme.text, borderColor: errors.email ? 'red' : theme.border }]}
        value={email}
        onChangeText={(t) => handleFieldChange('email', t)}
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        placeholder="Password (e.g. Password1)"
        placeholderTextColor={theme.subText}
        secureTextEntry={!showPassword}
        style={[styles.input, { color: theme.text, borderColor: errors.password ? 'red' : theme.border }]}
        value={password}
        onChangeText={(t) => handleFieldChange('password', t)}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {isSignup && (
        <>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={theme.subText}
            secureTextEntry={!showPassword}
            style={[styles.input, { color: theme.text, borderColor: errors.confirmPassword ? 'red' : theme.border }]}
            value={confirmPassword}
            onChangeText={(t) => handleFieldChange('confirmPassword', t)}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </>
      )}

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={[styles.toggleText, { color: theme.primary }]}>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.btn, { backgroundColor: theme.primary }, isSubmitting && styles.disabledBtn]} 
        onPress={handleValidateAndSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>{isSignup ? 'Sign Up' : 'Login'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={[styles.switchModeText, { color: theme.subText }]}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 8 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
  toggleText: { marginBottom: 12, textAlign: 'right' },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  disabledBtn: { opacity: 0.7 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  switchModeText: { textAlign: 'center', marginTop: 15 }
});