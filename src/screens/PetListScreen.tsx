import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Pet } from '../types';
import PetCard from '../components/PetCard';
import AppButton from '../components/AppButton';
import {
  getPets,
  getSelectedPetId,
  saveSelectedPetId,
  deletePet,
} from '../services/storageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PetListScreen() {
  const navigation = useNavigation<Nav>();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const list = await getPets();
    const id = await getSelectedPetId();
    setPets(list);
    setSelectedPetId(id ?? (list[0]?.id ?? null));
  }

  async function handleSelectPet(pet: Pet) {
    await saveSelectedPetId(pet.id);
    setSelectedPetId(pet.id);
    Alert.alert('Pet selecionado', `${pet.name} agora é o pet ativo.`);
  }

  async function handleDeletePet(petId: string, petName: string) {
    Alert.alert(
      'Excluir pet',
      `Tem certeza que deseja excluir ${petName}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deletePet(petId);
            const updatedPets = pets.filter((p) => p.id !== petId);
            setPets(updatedPets);

            // Se o pet excluído era o selecionado, selecionar o próximo
            if (petId === selectedPetId) {
              const nextPet = updatedPets[0];
              if (nextPet) {
                await saveSelectedPetId(nextPet.id);
                setSelectedPetId(nextPet.id);
              } else {
                setSelectedPetId(null);
              }
            }
          },
        },
      ]
    );
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

      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>🐾</Text>
            </View>
            <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione seu primeiro companheiro para começar a jornada.
            </Text>
          </View>
          <AppButton
            title="+ Cadastrar novo pet"
            onPress={() => navigation.navigate('PetForm', {})}
            style={styles.addBtn}
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <SwipeListView
            data={pets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PetCard
                pet={item}
                isSelected={item.id === selectedPetId}
                onPress={() => handleSelectPet(item)}
              />
            )}
            renderHiddenItem={({ item }) => (
              <View style={styles.hiddenRow}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeletePet(item.id, item.name)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-90}
            disableRightSwipe
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            ListFooterComponent={
              <AppButton
                title="+ Cadastrar novo pet"
                onPress={() => navigation.navigate('PetForm', {})}
                variant="outline"
                style={styles.addBtn}
              />
            }
          />
        </View>
      )}
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
  listContainer: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F3F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIcon: { fontSize: 36 },
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
  },
  addBtn: { marginTop: 16 },
  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  deleteBtn: {
    backgroundColor: '#E53935',
    width: 90,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
