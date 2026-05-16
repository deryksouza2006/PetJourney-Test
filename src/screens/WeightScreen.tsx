import React, { useState, useCallback } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Pet, WeightRecord } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import {
  getSelectedPet,
  getWeightRecords,
  saveWeightRecord,
} from '../services/storageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export default function WeightScreen() {
  const navigation = useNavigation<Nav>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const selectedPet = await getSelectedPet();
    setPet(selectedPet);
    if (selectedPet) {
      const allRecords = await getWeightRecords();
      const filtered = allRecords
        .filter((r) => r.petId === selectedPet.id)
        .sort((a, b) => b.date.localeCompare(a.date));
      setRecords(filtered);
    }
  }

  async function handleSaveWeight() {
    if (!newWeight.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o peso.');
      return;
    }
    const weightNum = parseFloat(newWeight.replace(',', '.'));
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Peso inválido', 'Por favor, informe um peso válido em kg.');
      return;
    }
    if (!pet) {
      Alert.alert('Erro', 'Nenhum pet selecionado.');
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const record: WeightRecord = {
        id: `w-${Date.now()}`,
        petId: pet.id,
        weight: weightNum.toFixed(1),
        date: today,
      };
      await saveWeightRecord(record);
      setNewWeight('');
      await loadData();
      Alert.alert('Peso salvo!', `Peso de ${record.weight} kg registrado com sucesso.`);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o peso.');
    } finally {
      setLoading(false);
    }
  }

  const latestRecord = records[0];
  const latestWeight = latestRecord ? parseFloat(latestRecord.weight) : null;

  function getWeightStatus(): string {
    if (!latestWeight) return '—';
    if (latestWeight < 5) return 'Peso abaixo do esperado';
    if (latestWeight > 50) return 'Peso acima do esperado';
    return 'Peso dentro da faixa esperada';
  }

  function getWeightStatusColor(): string {
    if (!latestWeight) return '#5F6B7A';
    if (latestWeight < 5 || latestWeight > 50) return '#E53935';
    return '#2E7D32';
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#101820" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Controle de Peso</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Pet Header */}
          {pet && (
            <View style={styles.petCard}>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petSpecies}>{pet.species} • {pet.breed}</Text>
              </View>
              <View style={styles.currentWeightBox}>
                <Text style={styles.currentWeightLabel}>Peso atual</Text>
                <Text style={styles.currentWeightValue}>
                  {latestWeight ? `${latestWeight} kg` : '—'}
                </Text>
                <Text style={[styles.weightStatus, { color: getWeightStatusColor() }]}>
                  {getWeightStatus()}
                </Text>
              </View>
            </View>
          )}

          {/* New Weight Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Registrar novo peso</Text>
            <View style={styles.inputRow}>
              <AppInput
                label=""
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="Ex: 28.5"
                keyboardType="decimal-pad"
                containerStyle={styles.weightInput}
              />
              <Text style={styles.unit}>kg</Text>
            </View>
            <AppButton
              title="Salvar peso"
              onPress={handleSaveWeight}
              loading={loading}
            />
          </View>

          {/* History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico de pesos</Text>
            {records.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>⚖️</Text>
                <Text style={styles.emptyText}>Nenhum registro de peso ainda.</Text>
              </View>
            ) : (
              <View style={styles.historyCard}>
                {records.map((record, index) => {
                  const prev = records[index + 1];
                  const diff = prev
                    ? parseFloat(record.weight) - parseFloat(prev.weight)
                    : null;
                  const diffStr =
                    diff !== null
                      ? diff > 0
                        ? `+${diff.toFixed(1)} kg`
                        : `${diff.toFixed(1)} kg`
                      : null;
                  const diffColor =
                    diff !== null ? (diff > 0 ? '#E53935' : '#2E7D32') : '#5F6B7A';

                  return (
                    <View key={record.id} style={[styles.historyRow, index < records.length - 1 && styles.historyRowBorder]}>
                      <View style={styles.historyLeft}>
                        <Text style={styles.historyDate}>{formatDate(record.date)}</Text>
                        {index === 0 && (
                          <View style={styles.latestBadge}>
                            <Text style={styles.latestBadgeText}>Mais recente</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.historyRight}>
                        <Text style={styles.historyWeight}>{record.weight} kg</Text>
                        {diffStr && (
                          <Text style={[styles.historyDiff, { color: diffColor }]}>
                            {diffStr}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101820',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  petCard: {
    backgroundColor: '#101820',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  petInfo: { flex: 1 },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  petSpecies: {
    fontSize: 13,
    color: '#64B5F6',
  },
  currentWeightBox: {
    alignItems: 'flex-end',
  },
  currentWeightLabel: {
    fontSize: 11,
    color: '#64B5F6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentWeightValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  weightStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  weightInput: {
    flex: 1,
    marginBottom: 0,
  },
  unit: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5F6B7A',
    marginTop: -4,
  },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 12,
  },
  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#5F6B7A', textAlign: 'center' },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
  },
  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F6',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#5F6B7A',
    fontWeight: '500',
  },
  latestBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  latestBadgeText: {
    fontSize: 11,
    color: '#1E88E5',
    fontWeight: '600',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101820',
  },
  historyDiff: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
});
