import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export default function AppInput({
  label,
  error,
  containerStyle,
  isPassword = false,
  ...rest
}: AppInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9BA8B4"
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#5F6B7A"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101820',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D8E0E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  inputError: {
    borderColor: '#E53935',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#101820',
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  error: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 4,
  },
});
