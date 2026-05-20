import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tutor, Pet, Reminder, WeightRecord } from '../types';
import { mockTutor, mockPets, mockReminders, mockWeightRecords } from '../data/mockData';

const KEYS = {
  TUTOR: '@petjourney:tutor',
  PETS: '@petjourney:pets',
  SELECTED_PET_ID: '@petjourney:selectedPetId',
  REMINDERS: '@petjourney:reminders',
  WEIGHT_RECORDS: '@petjourney:weightRecords',
  USER: '@petjourney_user',
  SESSION: '@petjourney_session',
};

// ─── AUTH ────────────────────────────────────────────────

export async function saveUser(tutor: Tutor): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(tutor));
  } catch (e) {
    console.error('Erro ao salvar usuário', e);
  }
}

export async function getUser(): Promise<Tutor | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.USER);
    if (json) return JSON.parse(json) as Tutor;
    return null;
  } catch {
    return null;
  }
}

export async function createSession(tutorId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(
      KEYS.SESSION,
      JSON.stringify({ active: true, tutorId })
    );
  } catch (e) {
    console.error('Erro ao criar sessão', e);
  }
}

export async function getSession(): Promise<{ active: boolean; tutorId: string } | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.SESSION);
    if (json) return JSON.parse(json);
    return null;
  } catch {
    return null;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: 'Nenhuma conta encontrada. Crie uma conta primeiro.' };
    }
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: 'E-mail ou senha incorretos.' };
    }
    if (user.password !== password) {
      return { success: false, error: 'E-mail ou senha incorretos.' };
    }
    await createSession(user.id);
    return { success: true };
  } catch {
    return { success: false, error: 'Erro ao realizar login.' };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.SESSION);
  } catch (e) {
    console.error('Erro ao fazer logout', e);
  }
}

// ─── TUTOR ───────────────────────────────────────────────

export async function getTutor(): Promise<Tutor | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.TUTOR);
    if (json) return JSON.parse(json) as Tutor;
    return mockTutor;
  } catch {
    return mockTutor;
  }
}

export async function saveTutor(tutor: Tutor): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.TUTOR, JSON.stringify(tutor));
  } catch (e) {
    console.error('Erro ao salvar tutor', e);
  }
}

// ─── PETS ────────────────────────────────────────────────

export async function getPets(): Promise<Pet[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.PETS);
    if (json) return JSON.parse(json) as Pet[];
    return mockPets;
  } catch {
    return mockPets;
  }
}

export async function savePet(pet: Pet): Promise<void> {
  try {
    const pets = await getPets();
    const existingIndex = pets.findIndex((p) => p.id === pet.id);
    if (existingIndex >= 0) {
      pets[existingIndex] = pet;
    } else {
      pets.push(pet);
    }
    await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(pets));
  } catch (e) {
    console.error('Erro ao salvar pet', e);
  }
}

export async function deletePet(petId: string): Promise<void> {
  try {
    const pets = await getPets();
    const updated = pets.filter((p) => p.id !== petId);
    await AsyncStorage.setItem(KEYS.PETS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao excluir pet', e);
  }
}

// ─── SELECTED PET ────────────────────────────────────────

export async function getSelectedPetId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.SELECTED_PET_ID);
  } catch {
    return null;
  }
}

export async function saveSelectedPetId(petId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.SELECTED_PET_ID, petId);
  } catch (e) {
    console.error('Erro ao salvar selectedPetId', e);
  }
}

export async function getSelectedPet(): Promise<Pet | null> {
  try {
    const petId = await getSelectedPetId();
    const pets = await getPets();
    if (petId) {
      return pets.find((p) => p.id === petId) ?? pets[0] ?? null;
    }
    return pets[0] ?? null;
  } catch {
    return mockPets[0];
  }
}

// ─── REMINDERS ───────────────────────────────────────────

export async function getReminders(): Promise<Reminder[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.REMINDERS);
    if (json) return JSON.parse(json) as Reminder[];
    return mockReminders;
  } catch {
    return mockReminders;
  }
}

export async function saveReminder(reminder: Reminder): Promise<void> {
  try {
    const reminders = await getReminders();
    reminders.push(reminder);
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error('Erro ao salvar lembrete', e);
  }
}

export async function updateReminderStatus(
  reminderId: string,
  status: 'Pendente' | 'Concluído'
): Promise<void> {
  try {
    const reminders = await getReminders();
    const updated = reminders.map((r) =>
      r.id === reminderId ? { ...r, status } : r
    );
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao atualizar status', e);
  }
}

export async function deleteReminder(reminderId: string): Promise<void> {
  try {
    const reminders = await getReminders();
    const updated = reminders.filter((r) => r.id !== reminderId);
    await AsyncStorage.setItem(KEYS.REMINDERS, JSON.stringify(updated));
  } catch (e) {
    console.error('Erro ao excluir lembrete', e);
  }
}

// ─── WEIGHT RECORDS ──────────────────────────────────────

export async function getWeightRecords(): Promise<WeightRecord[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.WEIGHT_RECORDS);
    if (json) return JSON.parse(json) as WeightRecord[];
    return mockWeightRecords;
  } catch {
    return mockWeightRecords;
  }
}

export async function saveWeightRecord(record: WeightRecord): Promise<void> {
  try {
    const records = await getWeightRecords();
    records.push(record);
    await AsyncStorage.setItem(KEYS.WEIGHT_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Erro ao salvar peso', e);
  }
}
