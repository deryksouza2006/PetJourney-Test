import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AppButton from '../components/AppButton';
import { getSession } from '../services/storageService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getSession();
        if (session?.active) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
          return;
        }
      } catch {
        // sem sessão ativa, continua na Welcome
      }
      setChecking(false);
    }
    checkSession();
  }, []);

  if (checking) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#101820" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101820" />
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.tagline}>
            A jornada de saúde do seu pet,{'\n'}organizada e contínua.
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  logoWrapper: {
    
  },
  logoImage: {
    width: 140,
    height: 140,
    resizeMode: 'cover',
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
