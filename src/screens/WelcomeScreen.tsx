import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AppButton from '../components/AppButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101820" />
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🐾</Text>
          </View>
          <Text style={styles.appName}>PetJourney</Text>
          <Text style={styles.tagline}>
            A jornada de saúde do seu pet, organizada e contínua.
          </Text>
          <Text style={styles.description}>
            Acompanhe lembretes, consultas, vacinas e peso do seu pet em um só lugar.
          </Text>
        </View>

        <View style={styles.bottom}>
          <AppButton
            title="Começar"
            onPress={() => navigation.navigate('Login')}
            style={styles.btn}
          />
          <Text style={styles.version}>PetJourney v1.0 • Protótipo Acadêmico</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#101820',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 17,
    color: '#64B5F6',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#9BA8B4',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  bottom: {
    gap: 12,
  },
  btn: {
    width: '100%',
  },
  version: {
    fontSize: 12,
    color: '#5F6B7A',
    textAlign: 'center',
  },
});
