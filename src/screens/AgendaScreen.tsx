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
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Reminder, Pet } from '../types';
import ReminderCard from '../components/ReminderCard';
import AppButton from '../components/AppButton';
import {
  getReminders,
  getSelectedPet,
  updateReminderStatus,
  deleteReminder,
} from '../services/storageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function AgendaScreen() {
  const navigation = useNavigation<Nav>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const selectedPet = await getSelectedPet();
    setPet(selectedPet);
    if (selectedPet) {
      const allReminders = await getReminders();
      const filtered = allReminders.filter((r) => r.petId === selectedPet.id);
      const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
      setReminders(sorted);
    } else {
      setReminders([]);
    }
  }

  async function handleComplete(reminderId: string) {
    Alert.alert('Concluir lembrete', 'Deseja marcar este lembrete como concluído?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Concluir',
        onPress: async () => {
          await updateReminderStatus(reminderId, 'Concluído');
          await loadData();
        },
      },
    ]);
  }

  async function handleDelete(reminderId: string) {
    Alert.alert('Excluir lembrete', 'Tem certeza que deseja excluir este lembrete?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteReminder(reminderId);
          await loadData();
        },
      },
    ]);
  }

  const pending = reminders.filter((r) => r.status === 'Pendente');
  const done = reminders.filter((r) => r.status === 'Concluído');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Agenda</Text>
          {pet && (
            <View style={styles.petRow}>
              <Ionicons name="paw-outline" size={14} color="#1E88E5" />
              <Text style={styles.petName}> {pet.name}</Text>
            </View>
          )}
        </View>
        {reminders.length > 0 && (
          <AppButton
            title="+ Novo"
            onPress={() => navigation.navigate('ReminderForm')}
            style={styles.newBtn}
          />
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {reminders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Nenhum lembrete cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione lembretes de vacinas, consultas, banhos e muito mais.
            </Text>
            <AppButton
              title="Criar primeiro lembrete"
              onPress={() => navigation.navigate('ReminderForm')}
              style={styles.emptyBtn}
            />
          </View>
        ) : (
          <>
            {pending.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Pendentes ({pending.length})
                </Text>
                {pending.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={() => handleComplete(reminder.id)}
                    onDelete={() => handleDelete(reminder.id)}
                  />
                ))}
              </View>
            )}
            {done.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Concluídos ({done.length})
                </Text>
                {done.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onComplete={undefined}
                    onDelete={() => handleDelete(reminder.id)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#101820',
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  petName: {
    fontSize: 13,
    color: '#1E88E5',
    fontWeight: '600',
  },
  newBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5F6B7A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  emptyBtn: { width: '100%' },
});