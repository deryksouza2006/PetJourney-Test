import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    navigation.navigate('MainTabs');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logoIcon}>🐾</Text>
            <Text style={styles.title}>Entrar na PetJourney</Text>
            <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              isPassword
            />

            <AppButton title="Entrar" onPress={handleLogin} style={styles.btn} />

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('RegisterTutor')}
            >
              <Text style={styles.registerText}>
                Não tem conta? <Text style={styles.registerLink}>Criar conta</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            Acesso simulado para protótipo — nenhuma autenticação real.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#101820',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#5F6B7A',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  btn: {
    marginTop: 8,
    marginBottom: 16,
  },
  registerBtn: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#5F6B7A',
  },
  registerLink: {
    color: '#1E88E5',
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9BA8B4',
    textAlign: 'center',
  },
});
