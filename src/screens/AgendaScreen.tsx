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
      const sorted = [...filtered].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.time ?? '').localeCompare(b.time ?? '');
      });
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
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIconText}>📅</Text>
              </View>
              <Text style={styles.emptyTitle}>Tudo em dia!</Text>
              <Text style={styles.emptyText}>
                Você ainda não possui lembretes.{'\n'}Crie um para acompanhar a saúde do seu pet.
              </Text>
              <AppButton
                title="Criar primeiro lembrete"
                onPress={() => navigation.navigate('ReminderForm')}
                style={styles.emptyBtn}
              />
            </View>
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
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
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
  emptyIconText: { fontSize: 36 },
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