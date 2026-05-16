import { Tutor, Pet, Reminder, WeightRecord } from '../types';

export const mockTutor: Tutor = {
  id: 'tutor-001',
  name: 'Ana Carolina',
  email: 'ana@email.com',
  phone: '(11) 99999-0001',
  password: '123456',
  plan: 'Free',
};

export const mockPets: Pet[] = [
  {
    id: 'pet-001',
    name: 'Thor',
    species: 'Cachorro',
    breed: 'Labrador',
    age: '3',
    sex: 'Macho',
    weight: '28',
    clinic: 'Clínica VetCare',
    tutorId: 'tutor-001',
  },
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem-001',
    petId: 'pet-001',
    title: 'Vacina Antirrábica',
    type: 'Vacina',
    date: '2024-06-05',
    observation: 'Levar carteirinha de vacinação',
    status: 'Pendente',
  },
  {
    id: 'rem-002',
    petId: 'pet-001',
    title: 'Consulta de Rotina',
    type: 'Consulta',
    date: '2024-06-10',
    observation: 'Check-up anual',
    status: 'Pendente',
  },
  {
    id: 'rem-003',
    petId: 'pet-001',
    title: 'Banho e Tosa',
    type: 'Banho',
    date: '2024-06-12',
    status: 'Concluído',
  },
  {
    id: 'rem-004',
    petId: 'pet-001',
    title: 'Vermífugo Mensal',
    type: 'Medicamento',
    date: '2024-06-20',
    observation: 'Medicamento comprado na farmácia pet',
    status: 'Pendente',
  },
];

export const mockWeightRecords: WeightRecord[] = [
  {
    id: 'w-001',
    petId: 'pet-001',
    weight: '26.5',
    date: '2024-03-15',
  },
  {
    id: 'w-002',
    petId: 'pet-001',
    weight: '27.2',
    date: '2024-04-20',
  },
  {
    id: 'w-003',
    petId: 'pet-001',
    weight: '28.0',
    date: '2024-05-25',
  },
];
