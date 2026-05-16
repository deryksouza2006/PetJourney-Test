import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Pet } from '../types';
import PetCard from '../components/PetCard';
import AppButton from '../components/AppButton';
import { getPets, getSelectedPetId, saveSelectedPetId } from '../services/storageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PetListScreen() {
  const navigation = useNavigation<Nav>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const list = await getPets();
        const id = await getSelectedPetId();
        setPets(list);
        setSelectedPetId(id ?? (list[0]?.id ?? null));
      }
      load();
    }, [])
  );

  async function handleSelectPet(pet: Pet) {
    await saveSelectedPetId(pet.id);
    setSelectedPetId(pet.id);
    Alert.alert('Pet selecionado', `${pet.name} agora é o pet ativo.`);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pets</Text>
        <Text style={styles.subtitle}>
          {pets.length} {pets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {pets.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🐾</Text>
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione seu primeiro pet para começar a acompanhar a jornada de saúde.
            </Text>
          </View>
        ) : (
          pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isSelected={pet.id === selectedPetId}
              onPress={() => handleSelectPet(pet)}
            />
          ))
        )}

        <AppButton
          title="+ Cadastrar novo pet"
          onPress={() => navigation.navigate('PetForm', {})}
          variant="outline"
          style={styles.addBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#101820',
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6B7A',
    marginTop: 2,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#5F6B7A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addBtn: { marginTop: 8 },
});
