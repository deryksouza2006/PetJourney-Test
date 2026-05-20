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
  Alert,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { loginUser } from '../services/storageService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe seu e-mail.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe sua senha.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(email.trim(), password);
      if (result.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Erro no login', result.error ?? 'Não foi possível entrar.');
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar entrar.');
    } finally {
      setLoading(false);
    }
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
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
              />
            </View>
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

            <AppButton
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              style={styles.btn}
            />

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('RegisterTutor')}
            >
              <Text style={styles.registerText}>
                Não tem conta? <Text style={styles.registerLink}>Criar conta</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  logoWrapper: {
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
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
});
