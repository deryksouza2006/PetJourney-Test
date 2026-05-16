import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reminder, ReminderType } from '../types';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

function getTypeIcon(type: ReminderType): string {
  switch (type) {
    case 'Vacina': return '💉';
    case 'Consulta': return '🏥';
    case 'Medicamento': return '💊';
    case 'Banho': return '🛁';
    default: return '📌';
  }
}

function getTypeColor(type: ReminderType): string {
  switch (type) {
    case 'Vacina': return '#E53935';
    case 'Consulta': return '#1E88E5';
    case 'Medicamento': return '#8E24AA';
    case 'Banho': return '#00ACC1';
    default: return '#5F6B7A';
  }
}

function formatDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

export default function ReminderCard({
  reminder,
  onComplete,
  onDelete,
  showActions = true,
}: ReminderCardProps) {
  const isDone = reminder.status === 'Concluído';

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(reminder.type) }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>{getTypeIcon(reminder.type)}</Text>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, isDone && styles.titleDone]}>{reminder.title}</Text>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(reminder.type) + '20' }]}>
              <Text style={[styles.typeText, { color: getTypeColor(reminder.type) }]}>
                {reminder.type}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isDone ? styles.statusDone : styles.statusPending]}>
            <Text style={[styles.statusText, isDone ? styles.statusDoneText : styles.statusPendingText]}>
              {reminder.status}
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#5F6B7A" />
          <Text style={styles.date}> {formatDate(reminder.date)}</Text>
        </View>

        {reminder.observation ? (
          <Text style={styles.observation}>{reminder.observation}</Text>
        ) : null}

        {showActions && (
          <View style={styles.actions}>
            {!isDone && (
              <TouchableOpacity style={styles.btnComplete} onPress={onComplete}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#2E7D32" />
                <Text style={styles.btnCompleteText}>Concluir</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btnDelete} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color="#E53935" />
              <Text style={styles.btnDeleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDone: {
    opacity: 0.75,
  },
  typeIndicator: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 1,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101820',
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9BA8B4',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  statusPending: {
    backgroundColor: '#FFF8E1',
  },
  statusDone: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusPendingText: {
    color: '#F57F17',
  },
  statusDoneText: {
    color: '#2E7D32',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#5F6B7A',
  },
  observation: {
    fontSize: 13,
    color: '#5F6B7A',
    fontStyle: 'italic',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  btnComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  btnCompleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  btnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  btnDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E53935',
  },
});
