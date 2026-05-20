export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  plan: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  sex: string;
  weight: string;
  clinic?: string;
  tutorId: string;
}

export type ReminderType = 'Vacina' | 'Consulta' | 'Medicamento' | 'Banho' | 'Outro';
export type ReminderStatus = 'Pendente' | 'Concluído';

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  type: ReminderType;
  date: string;
  time?: string;
  observation?: string;
  status: ReminderStatus;
}

export interface WeightRecord {
  id: string;
  petId: string;
  weight: string;
  date: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  RegisterTutor: undefined;
  PetForm: { isFirst?: boolean };
  MainTabs: undefined;
  ReminderForm: undefined;
  Weight: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Pets: undefined;
  Agenda: undefined;
  Perfil: undefined;
};
