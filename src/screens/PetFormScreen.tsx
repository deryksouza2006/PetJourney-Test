import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Pet } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { savePet, saveSelectedPetId, getPets } from '../services/storageService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PetForm'>;
  route: RouteProp<RootStackParamList, 'PetForm'>;
};

const SPECIES = ['Cachorro', 'Gato', 'Pássaro', 'Coelho', 'Peixe', 'Outro'];
const SEXES = ['Macho', 'Fêmea'];

export default function PetFormScreen({ navigation, route }: Props) {
  const isFirst = route.params?.isFirst ?? false;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [weight, setWeight] = useState('');
  const [clinic, setClinic] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o nome do pet.');
      return;
    }
    if (!species.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, selecione a espécie do pet.');
      return;
    }
    if (!weight.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o peso atual do pet.');
      return;
    }

    setLoading(true);
    try {
      const newPet: Pet = {
        id: `pet-${Date.now()}`,
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim(),
        age: age.trim(),
        sex: sex.trim(),
        weight: weight.trim(),
        clinic: clinic.trim() || undefined,
        tutorId: 'tutor-001',
      };

      await savePet(newPet);

      const allPets = await getPets();
      if (allPets.length === 1 || isFirst) {
        await saveSelectedPetId(newPet.id);
      }

      Alert.alert('Pet cadastrado!', `${newPet.name} foi adicionado com sucesso.`, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o pet.');
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
            <Text style={styles.icon}>🐾</Text>
            <Text style={styles.title}>
              {isFirst ? 'Cadastre seu primeiro pet!' : 'Novo pet'}
            </Text>
            <Text style={styles.subtitle}>
              {isFirst
                ? 'Agora vamos adicionar informações sobre seu companheiro.'
                : 'Preencha os dados do seu novo pet.'}
            </Text>
          </View>

          <View style={styles.form}>
            <AppInput
              label="Nome do pet *"
              value={name}
              onChangeText={setName}
              placeholder="Ex: Thor, Mel, Bolinha..."
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Espécie *</Text>
            <View style={styles.chipRow}>
              {SPECIES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, species === s && styles.chipSelected]}
                  onPress={() => setSpecies(s)}
                >
                  <Text style={[styles.chipText, species === s && styles.chipTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppInput
              label="Raça"
              value={breed}
              onChangeText={setBreed}
              placeholder="Ex: Labrador, SRD..."
              autoCapitalize="words"
            />
            <AppInput
              label="Idade (anos)"
              value={age}
              onChangeText={setAge}
              placeholder="Ex: 3"
              keyboardType="numeric"
            />

            <Text style={styles.fieldLabel}>Sexo</Text>
            <View style={styles.chipRow}>
              {SEXES.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, sex === s && styles.chipSelected]}
                  onPress={() => setSex(s)}
                >
                  <Text style={[styles.chipText, sex === s && styles.chipTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppInput
              label="Peso atual (kg) *"
              value={weight}
              onChangeText={setWeight}
              placeholder="Ex: 12.5"
              keyboardType="decimal-pad"
            />
            <AppInput
              label="Clínica vinculada (opcional)"
              value={clinic}
              onChangeText={setClinic}
              placeholder="Nome da clínica veterinária"
              autoCapitalize="words"
            />

            <AppButton
              title="Cadastrar pet"
              onPress={handleSave}
              loading={loading}
              style={styles.btn}
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
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 40, marginBottom: 10 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#101820',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6B7A',
    textAlign: 'center',
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
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101820',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D8E0E8',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  chipText: {
    fontSize: 13,
    color: '#5F6B7A',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#1E88E5',
    fontWeight: '700',
  },
  btn: {
    marginTop: 12,
  },
});
