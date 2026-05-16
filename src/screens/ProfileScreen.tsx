import React, { useState, useCallback } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Tutor } from '../types';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { getTutor, saveTutor, getPets } from '../services/storageService';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [petCount, setPetCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const t = await getTutor();
        const pets = await getPets();
        if (t) {
          setTutor(t);
          setName(t.name);
          setEmail(t.email);
          setPhone(t.phone);
        }
        setPetCount(pets.length);
      }
      load();
    }, [])
  );

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'O nome não pode estar vazio.');
      return;
    }
    if (!tutor) return;

    setSaving(true);
    try {
      const updated: Tutor = {
        ...tutor,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };
      await saveTutor(updated);
      setTutor(updated);
      setIsEditing(false);
      Alert.alert('Salvo!', 'Perfil atualizado com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil-outline" size={18} color="#1E88E5" />
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(name || 'T').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.avatarName}>{name || 'Tutor'}</Text>
            <View style={styles.planBadge}>
              <Ionicons name="star-outline" size={12} color="#1E88E5" />
              <Text style={styles.planText}>Plano Free</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{petCount}</Text>
              <Text style={styles.statLabel}>
                {petCount === 1 ? 'Pet' : 'Pets'} cadastrado{petCount !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Free</Text>
              <Text style={styles.statLabel}>Plano atual</Text>
            </View>
          </View>

          {/* Info or Edit Form */}
          {isEditing ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Editar perfil</Text>
              <AppInput
                label="Nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <AppInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AppInput
                label="Telefone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <View style={styles.formActions}>
                <AppButton
                  title="Salvar"
                  onPress={handleSave}
                  loading={saving}
                  style={styles.saveBtn}
                />
                <AppButton
                  title="Cancelar"
                  onPress={() => {
                    setIsEditing(false);
                    if (tutor) {
                      setName(tutor.name);
                      setEmail(tutor.email);
                      setPhone(tutor.phone);
                    }
                  }}
                  variant="outline"
                  style={styles.cancelBtn}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <InfoRow icon="person-outline" label="Nome" value={name} />
              <InfoRow icon="mail-outline" label="E-mail" value={email} />
              <InfoRow icon="call-outline" label="Telefone" value={phone || 'Não informado'} />
            </View>
          )}

          <AppButton
            title="Sair da conta"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutBtn}
            textStyle={styles.logoutText}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={infoStyles.row}>
      <Ionicons name={icon as any} size={18} color="#5F6B7A" style={infoStyles.icon} />
      <View style={infoStyles.text}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F6',
  },
  icon: { marginRight: 12 },
  text: { flex: 1 },
  label: { fontSize: 12, color: '#9BA8B4', marginBottom: 2 },
  value: { fontSize: 15, color: '#101820', fontWeight: '500' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F7FA' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#101820' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1E88E5',
  },
  editBtnText: { fontSize: 13, color: '#1E88E5', fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  avatarName: { fontSize: 20, fontWeight: '800', color: '#101820', marginBottom: 6 },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  planText: { fontSize: 12, color: '#1E88E5', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#101820', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#5F6B7A', textAlign: 'center' },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#101820', marginBottom: 14 },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  saveBtn: { flex: 1 },
  cancelBtn: { flex: 1 },
  logoutBtn: {
    borderColor: '#E53935',
  },
  logoutText: { color: '#E53935' },
});
