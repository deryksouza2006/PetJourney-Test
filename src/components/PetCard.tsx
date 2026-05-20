import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet } from '../types';
import { getPetImage } from '../helpers/petImages';

interface PetCardProps {
  pet: Pet;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function PetCard({ pet, isSelected = false, onPress }: PetCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={getPetImage(pet.species)} style={styles.petImage} />
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{pet.name}</Text>
          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>Ativo</Text>
            </View>
          )}
        </View>
        <Text style={styles.detail}>
          {pet.species} • {pet.breed}
        </Text>
        <Text style={styles.detail}>
          {pet.age} anos • {pet.sex} • {pet.weight} kg
        </Text>
      </View>
      {isSelected ? (
        <Ionicons name="checkmark-circle" size={24} color="#1E88E5" />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#9BA8B4" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#F0F8FF',
  },
  imageContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#E3F2FD',
  },
  petImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101820',
    marginRight: 8,
  },
  selectedBadge: {
    backgroundColor: '#1E88E5',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detail: {
    fontSize: 13,
    color: '#5F6B7A',
    marginTop: 2,
  },
});
