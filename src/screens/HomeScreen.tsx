import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Pet, Reminder, Tutor } from '../types';
import TimelineItem from '../components/TimelineItem';
import {getTutor, getSelectedPet, getReminders} from '../services/storageService';
import { getPetImage } from '../helpers/petImages';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const t = await getTutor();
        const p = await getSelectedPet();
        const allReminders = await getReminders();
        setTutor(t);
        setPet(p);
        if (p) {
          const filtered = allReminders.filter((r) => r.petId === p.id);
          const sorted = [...filtered].sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return (a.time ?? '').localeCompare(b.time ?? '');
          });
          setReminders(sorted);
        }
      }
      load();
    }, [])
  );

  const now = new Date();
  const currentMonth = MONTH_NAMES[now.getMonth()];
  const currentYear = now.getFullYear();

  const nextEvent = reminders.find((r) => r.status === 'Pendente');

  function formatDate(dateStr: string): string {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#101820" />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>
            Olá, {tutor?.name?.split(' ')[0] ?? 'Tutor'} 
          </Text>
          <Text style={styles.greetingSub}>Como está seu pet hoje?</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {(tutor?.name ?? 'T').charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Card */}
        {pet ? (
          <View style={styles.petCard}>
            <View style={styles.petCardLeft}>
              <View style={styles.petImageContainer}>
                <Image source={getPetImage(pet.species)} style={styles.petImage} />
              </View>
              <View>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petInfo}>
                  {pet.species} • {pet.breed}
                </Text>
                <Text style={styles.petInfo}>
                  {pet.age} anos • {pet.weight} kg
                </Text>
              </View>
            </View>
            <View style={styles.petBadge}>
              <Text style={styles.petBadgeText}>Ativo</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyPet}>
            <Text style={styles.emptyPetText}>Nenhum pet selecionado</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PetForm', {})}>
              <Text style={styles.emptyPetLink}>Cadastrar pet →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Next Event */}
        {nextEvent && (
          <View style={styles.nextEventCard}>
            <View style={styles.nextEventHeader}>
              <Ionicons name="alarm-outline" size={18} color="#1E88E5" />
              <Text style={styles.nextEventLabel}>Próximo evento</Text>
            </View>
            <Text style={styles.nextEventTitle}>{nextEvent.title}</Text>
            <Text style={styles.nextEventDate}>
              {nextEvent.type} • {formatDate(nextEvent.date)}{nextEvent.time ? ` • ${nextEvent.time}` : ''}
            </Text>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Timeline de {currentMonth} {currentYear}
          </Text>
          {reminders.length > 0 ? (
            <View style={styles.timelineCard}>
              {reminders.slice(0, 6).map((reminder, index) => (
                <TimelineItem
                  key={reminder.id}
                  reminder={reminder}
                  isLast={index === Math.min(reminders.length - 1, 5)}
                />
              ))}
              {reminders.length > 6 && (
                <Text style={styles.moreItems}>+{reminders.length - 6} mais eventos</Text>
              )}
            </View>
          ) : (
            <View style={styles.emptyTimeline}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyTimelineIcon}>✨</Text>
              </View>
              <Text style={styles.emptyTimelineTitle}>
                Nenhum evento este mês
              </Text>
              <Text style={styles.emptyTimelineSub}>
                Acesse a Agenda para criar seus primeiros lembretes e acompanhar a saúde do seu pet.
              </Text>
            </View>
          )}
        </View>

        {/* Health Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo de saúde</Text>

          <View style={styles.healthCard}>
            <View style={styles.healthItem}>
              <Ionicons name="barbell-outline" size={22} color="#1E88E5" />
              <View>
                <Text style={styles.healthLabel}>Peso atual</Text>
                <Text style={styles.healthValue}>
                  {pet ? `${pet.weight} kg` : 'Não informado'}
                </Text>
              </View>
            </View>

            <Text style={styles.healthStatus}>Peso dentro da faixa esperada</Text>

            <TouchableOpacity
              style={styles.weightButton}
              onPress={() => navigation.navigate('Weight')}
              activeOpacity={0.8}
            >
              <Text style={styles.weightButtonText}>Ver controle de peso</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#101820' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#101820',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  greetingSub: {
    fontSize: 13,
    color: '#64B5F6',
    marginTop: 2,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  petCard: {
    backgroundColor: '#101820',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  petCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E88E5',
  },
  petImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  petName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  petInfo: {
    fontSize: 12,
    color: '#64B5F6',
    marginTop: 1,
  },
  petBadge: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  petBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyPet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyPetText: { fontSize: 14, color: '#5F6B7A', marginBottom: 6 },
  emptyPetLink: { fontSize: 14, color: '#1E88E5', fontWeight: '700' },
  nextEventCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  
  },
  nextEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  nextEventLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nextEventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 2,
  },
  nextEventDate: {
    fontSize: 13,
    color: '#5F6B7A',
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  moreItems: {
    fontSize: 13,
    color: '#1E88E5',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyTimeline: {
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F3F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTimelineIcon: {
    fontSize: 32,
  },
  emptyTimelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 8,
  },
  emptyTimelineSub: {
    fontSize: 14,
    color: '#5F6B7A',
    textAlign: 'center',
    lineHeight: 20,
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: 13,
    color: '#5F6B7A',
  },
  healthValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#101820',
    marginTop: 2,
  },
  healthStatus: {
    fontSize: 14,
    color: '#5F6B7A',
    marginBottom: 14,
  },
  weightButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  weightButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});