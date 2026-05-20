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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, ReminderType, Reminder } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { saveReminder, getSelectedPet } from '../services/storageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TYPES: ReminderType[] = ['Vacina', 'Consulta', 'Medicamento', 'Banho', 'Outro'];

function getTypeIcon(type: ReminderType): string {
  switch (type) {
    case 'Vacina': return '💉';
    case 'Consulta': return '🏥';
    case 'Medicamento': return '💊';
    case 'Banho': return '🛁';
    default: return '📌';
  }
}

export default function ReminderFormScreen() {
  const navigation = useNavigation<Nav>();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);

  function formatDateInput(text: string): string {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }

  function formatTimeInput(text: string): string {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  }

  function isValidTime(timeStr: string): boolean {
    if (!/^\d{2}:\d{2}$/.test(timeStr)) return false;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }

  function parseDateToISO(dateStr: string): string | null {
    const parts = dateStr.split('/');
    if (parts.length !== 3 || parts[2].length !== 4) return null;
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o título do lembrete.');
      return;
    }
    if (!type) {
      Alert.alert('Campo obrigatório', 'Por favor, selecione o tipo do lembrete.');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe a data do lembrete.');
      return;
    }
    const isoDate = parseDateToISO(date);
    if (!isoDate) {
      Alert.alert('Data inválida', 'Por favor, informe a data no formato DD/MM/AAAA.');
      return;
    }
    if (time.trim() && !isValidTime(time.trim())) {
      Alert.alert('Horário inválido', 'Por favor, informe o horário no formato HH:MM (00:00 a 23:59).');
      return;
    }

    setLoading(true);
    try {
      const pet = await getSelectedPet();
      if (!pet) {
        Alert.alert('Erro', 'Nenhum pet selecionado. Selecione um pet em Meus Pets.');
        return;
      }

      const reminder: Reminder = {
        id: `rem-${Date.now()}`,
        petId: pet.id,
        title: title.trim(),
        type: type as ReminderType,
        date: isoDate,
        time: time.trim() || undefined,
        observation: observation.trim() || undefined,
        status: 'Pendente',
      };

      await saveReminder(reminder);
      Alert.alert('Lembrete salvo!', `"${reminder.title}" foi adicionado à agenda.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o lembrete.');
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
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#101820" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Novo Lembrete</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <AppInput
              label="Título *"
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Vacina antirrábica, Consulta anual..."
              autoCapitalize="sentences"
            />

            <Text style={styles.fieldLabel}>Tipo *</Text>
            <View style={styles.typeGrid}>
              {TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, type === t && styles.typeChipSelected]}
                  onPress={() => setType(t)}
                >
                  <Text style={styles.typeIcon}>{getTypeIcon(t)}</Text>
                  <Text style={[styles.typeText, type === t && styles.typeTextSelected]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppInput
              label="Data *"
              value={date}
              onChangeText={(v) => setDate(formatDateInput(v))}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />

            <AppInput
              label="Horário (opcional)"
              value={time}
              onChangeText={(v) => setTime(formatTimeInput(v))}
              placeholder="HH:MM"
              keyboardType="numeric"
              maxLength={5}
            />

            <AppInput
              label="Observação (opcional)"
              value={observation}
              onChangeText={setObservation}
              placeholder="Alguma informação adicional..."
              multiline
              numberOfLines={3}
              autoCapitalize="sentences"
            />
          </View>

          {/* Preview */}
          {(title || type || date) && (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Prévia do lembrete</Text>
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>
                  {getTypeIcon(type as ReminderType)} {title || 'Sem título'}
                </Text>
                {type ? (
                  <Text style={styles.previewDetail}>Tipo: {type}</Text>
                ) : null}
                {date ? (
                  <Text style={styles.previewDetail}>Data: {date}{time ? ` • ${time}` : ''}</Text>
                ) : null}
                {observation ? (
                  <Text style={styles.previewDetail}>Obs: {observation}</Text>
                ) : null}
                <View style={styles.previewStatusBadge}>
                  <Text style={styles.previewStatusText}>Pendente</Text>
                </View>
              </View>
            </View>
          )}

          <AppButton
            title="Salvar lembrete"
            onPress={handleSave}
            loading={loading}
            style={styles.btn}
          />
          <AppButton
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
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
    backgroundColor: '#F5F7FA',
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
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#101820',
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D8E0E8',
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  typeChipSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  typeIcon: { fontSize: 14 },
  typeText: {
    fontSize: 13,
    color: '#5F6B7A',
    fontWeight: '500',
  },
  typeTextSelected: {
    color: '#1E88E5',
    fontWeight: '700',
  },
  preview: { marginBottom: 16 },
  previewLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F6B7A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#1E88E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 6,
  },
  previewDetail: {
    fontSize: 13,
    color: '#5F6B7A',
    marginBottom: 2,
  },
  previewStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  previewStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57F17',
  },
  btn: { marginBottom: 10 },
});
