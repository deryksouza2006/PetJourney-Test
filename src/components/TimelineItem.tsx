import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Reminder, ReminderType } from '../types';

interface TimelineItemProps {
  reminder: Reminder;
  isLast?: boolean;
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

function getTypeIcon(type: ReminderType): string {
  switch (type) {
    case 'Vacina': return '💉';
    case 'Consulta': return '🏥';
    case 'Medicamento': return '💊';
    case 'Banho': return '🛁';
    default: return '📌';
  }
}

function formatShortDate(dateStr: string): string {
  try {
    const [, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  } catch {
    return dateStr;
  }
}

export default function TimelineItem({ reminder, isLast = false }: TimelineItemProps) {
  const color = getTypeColor(reminder.type);
  const isDone = reminder.status === 'Concluído';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: color }, isDone && styles.dotDone]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.date}>{formatShortDate(reminder.date)}{reminder.time ? ` ${reminder.time}` : ''}</Text>
          <Text style={styles.icon}>{getTypeIcon(reminder.type)}</Text>
          <Text style={[styles.title, isDone && styles.titleDone]}>{reminder.title}</Text>
        </View>
        {isDone && <Text style={styles.doneLabel}>✓ Concluído</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 44,
  },
  left: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  dotDone: {
    opacity: 0.4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#D8E0E8',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E88E5',
    minWidth: 80,
  },
  icon: {
    fontSize: 14,
  },
  title: {
    fontSize: 14,
    color: '#101820',
    fontWeight: '500',
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9BA8B4',
  },
  doneLabel: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 2,
  },
});
