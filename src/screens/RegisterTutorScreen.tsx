import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Tutor } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { saveTutor } from '../services/storageService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RegisterTutor'>;
};

export default function RegisterTutorScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe seu nome completo.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe seu e-mail.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe uma senha.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'A senha e a confirmação não conferem.');
      return;
    }

    setLoading(true);
    try {
      const tutor: Tutor = {
        id: `tutor-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        plan: 'Free',
      };
      await saveTutor(tutor);
      navigation.navigate('PetForm', { isFirst: true });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o cadastro.');
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
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Preencha seus dados para começar a jornada do seu pet.
            </Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Nome completo *"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              autoCapitalize="words"
            />
            <AppInput
              label="E-mail *"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AppInput
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              placeholder="(11) 99999-0000"
              keyboardType="phone-pad"
            />
            <AppInput
              label="Senha *"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              isPassword
            />
            <AppInput
              label="Confirmar senha *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita sua senha"
              isPassword
            />

            <AppButton
              title="Criar conta"
              onPress={handleRegister}
              loading={loading}
              style={styles.btn}
            />
            <AppButton
              title="Já tenho conta"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
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
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#101820',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6B7A',
    lineHeight: 20,
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
    gap: 4,
  },
  btn: {
    marginTop: 8,
    marginBottom: 10,
  },
});
