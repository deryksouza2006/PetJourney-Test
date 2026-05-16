# 🐾 PetJourney

Aplicativo mobile desenvolvido em React Native com Expo para tutores acompanharem a jornada de saúde dos seus pets.

---

## 📋 Descrição

PetJourney é um protótipo acadêmico do Módulo Tutor, onde o tutor pode:

- Cadastrar seu perfil
- Gerenciar seus pets
- Organizar lembretes de vacinas, consultas, banhos e medicamentos
- Controlar o histórico de peso dos pets
- Visualizar uma timeline mensal de eventos de saúde

> ⚠️ Este projeto é um protótipo para fins acadêmicos. Não há backend, API ou autenticação real. Todos os dados são armazenados localmente com AsyncStorage.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** — framework para apps mobile
- **Expo SDK 51** — ambiente de desenvolvimento
- **TypeScript** — tipagem estática
- **React Navigation** — navegação entre telas (Stack + Bottom Tabs)
- **@react-native-async-storage/async-storage** — armazenamento local
- **@expo/vector-icons (Ionicons)** — ícones
- **react-native-screens** — otimização de telas
- **react-native-safe-area-context** — safe area
- **react-native-gesture-handler** — gestos
- **react-native-reanimated** — animações

---

## ✅ Funcionalidades

- [x] Tela de boas-vindas
- [x] Login simulado (sem autenticação real)
- [x] Cadastro de tutor com validação e AsyncStorage
- [x] Cadastro de pets com campos completos
- [x] Múltiplos pets com seleção de pet ativo
- [x] Home com timeline mensal resumida
- [x] Lista de pets com seleção do pet ativo
- [x] Agenda com lembretes detalhados (concluir e excluir)
- [x] Formulário de novo lembrete com prévia dinâmica
- [x] Controle de peso com histórico por pet
- [x] Perfil do tutor com edição de dados
- [x] Persistência de dados com AsyncStorage
- [x] Dados mockados para demonstração inicial

---

## 🚀 Como Instalar

Pré-requisitos:
- Node.js (v18 ou superior)
- npm ou yarn
- Expo Go instalado no celular (iOS ou Android) **ou** emulador configurado

```bash
# 1. Clone o repositório ou copie os arquivos para uma pasta
cd PetJourney

# 2. Instale as dependências
npm install

# 3. Inicie o projeto
npx expo start
```

---

## ▶️ Como Executar

Após rodar `npx expo start`:

- **Expo Go (celular):** Escaneie o QR Code com o app Expo Go
- **Android Emulator:** Pressione `a` no terminal
- **iOS Simulator:** Pressione `i` no terminal (somente macOS)

---

## 📁 Estrutura de Pastas

```
PetJourney/
├── App.tsx                      # Ponto de entrada e Stack Navigator
├── app.json                     # Configuração Expo
├── package.json
├── tsconfig.json
├── babel.config.js
└── src/
    ├── components/
    │   ├── AppButton.tsx        # Botão reutilizável
    │   ├── AppInput.tsx         # Campo de texto reutilizável
    │   ├── PetCard.tsx          # Card de pet
    │   ├── ReminderCard.tsx     # Card de lembrete com ações
    │   ├── TimelineItem.tsx     # Item da timeline mensal
    │   └── MainTabs.tsx         # Bottom Tab Navigator
    ├── data/
    │   └── mockData.ts          # Dados mockados iniciais
    ├── screens/
    │   ├── WelcomeScreen.tsx    # Tela de boas-vindas
    │   ├── LoginScreen.tsx      # Tela de login
    │   ├── RegisterTutorScreen.tsx # Cadastro de tutor
    │   ├── HomeScreen.tsx       # Home com timeline mensal
    │   ├── PetListScreen.tsx    # Lista de pets
    │   ├── PetFormScreen.tsx    # Formulário de pet
    │   ├── AgendaScreen.tsx     # Agenda de lembretes
    │   ├── ReminderFormScreen.tsx # Formulário de lembrete
    │   ├── WeightScreen.tsx     # Controle de peso
    │   └── ProfileScreen.tsx   # Perfil do tutor
    ├── services/
    │   └── storageService.ts   # Funções AsyncStorage
    └── types/
        └── index.ts            # Interfaces TypeScript
```

---

## 🗺️ Fluxo de Navegação

```
Welcome
  └─→ Login
        ├─→ RegisterTutor → PetForm → MainTabs
        └─→ MainTabs
              ├─ Home (Tab)
              │    ├─→ ReminderForm (Stack)
              │    └─→ Weight (Stack)
              ├─ Pets (Tab)
              │    └─→ PetForm (Stack)
              ├─ Agenda (Tab)
              │    └─→ ReminderForm (Stack)
              └─ Perfil (Tab)
                   └─→ Login (ao sair)
```

---

## 💾 Dados Salvos com AsyncStorage

| Chave | Conteúdo |
|---|---|
| `@petjourney:tutor` | Objeto do tutor (nome, e-mail, telefone, senha, plano) |
| `@petjourney:pets` | Array de pets cadastrados |
| `@petjourney:selectedPetId` | ID do pet ativo selecionado |
| `@petjourney:reminders` | Array de lembretes de todos os pets |
| `@petjourney:weightRecords` | Array de registros de peso de todos os pets |

---

## 🔌 Observações Técnicas

- **Não há backend, API ou banco de dados** nesta sprint.
- Todos os dados são armazenados localmente no dispositivo via AsyncStorage.
- Os dados mockados (tutor "Ana Carolina", pet "Thor", lembretes e pesos) são usados quando o AsyncStorage está vazio.
- A autenticação é simulada: qualquer e-mail e senha navega para a tela principal.
- Ao pressionar "Sair", o app navega para Login sem apagar os dados salvos.

---

## 👥 Integrantes

- [Integrante 1 — RA: xxxxxxxx]
- [Integrante 2 — RA: xxxxxxxx]
- [Integrante 3 — RA: xxxxxxxx]
- [Integrante 4 — RA: xxxxxxxx]

---

## 📚 Disciplina

> Preencha com nome da disciplina, semestre e nome do professor.
