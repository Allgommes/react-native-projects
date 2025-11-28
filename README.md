# 💪 MyFit Journal

Aplicação mobile para gestão de treinos e nutrição, desenvolvida em React Native com Firebase.

## 📱 Sobre o Projeto

MyFit Journal é uma aplicação completa para acompanhamento de fitness que permite registar treinos, monitorizar alimentação e visualizar estatísticas de progresso. Desenvolvido como projeto final da UFCD 11027 - React Native.

## ✨ Funcionalidades

### 🏋️ Gestão de Treinos
- Adicionar, editar e eliminar treinos
- Registar duração, tipo, calorias gastas e notas
- Visualizar histórico de treinos ordenados por data
- Detalhes completos de cada treino

### 🍎 Gestão de Nutrição
- Registar alimentos manualmente
- Scanner de código de barras integrado (Open Food Facts API)
- Cálculo automático de macronutrientes (proteínas, carboidratos, gorduras)
- Resumo diário de calorias consumidas

### 📊 Estatísticas e Gráficos
- Gráfico de barras: Evolução de treinos (últimos 7 dias)
- Gráfico de linhas: Calorias consumidas (últimos 7 dias)
- Cards de resumo: Total de treinos, calorias gastas e consumidas
- Atualização em tempo real

### 🏠 Tela Inicial
- Resumo semanal dinâmico
- Dicas diárias de saúde e fitness
- Navegação rápida para estatísticas

### 👤 Perfil do Utilizador
- Informações da conta
- Acesso a definições e sobre
- Logout seguro

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Firebase Authentication** - Autenticação de utilizadores
- **Cloud Firestore** - Base de dados NoSQL em tempo real
- **React Navigation** - Navegação entre telas
- **Expo Camera** - Scanner de código de barras
- **React Native Chart Kit** - Gráficos e visualizações
- **Open Food Facts API** - Base de dados de alimentos

## 📦 Estrutura do Projeto

```
myfitjournal/
├── assets/                      # Imagens e recursos
├── components/                  # Componentes reutilizáveis
│   └── SimpleButton.js
├── src/
│   ├── config/
│   │   └── Firebase.js         # Configuração Firebase
│   ├── navigation/
│   │   └── AppNavigator.js     # Navegação principal
│   └── screens/
│       ├── auth/               # Telas de autenticação
│       │   ├── LoginScreen.js
│       │   └── RegisterScreen.js
│       └── main/               # Telas principais
│           ├── HomeScreen.js
│           ├── WorkoutsScreen.js
│           ├── AddWorkoutScreen.js
│           ├── WorkoutDetailsScreen.js
│           ├── NutritionScreen.js
│           ├── AddFoodScreen.js
│           ├── BarcodeScannerScreen.js
│           ├── StatisticsScreen.js
│           ├── ProfileScreen.js
│           ├── SettingsScreen.js
│           └── AboutScreen.js
├── App.js
├── package.json
└── README.md
```

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou dispositivo físico
- Conta Firebase

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/Allgommes/react-native-projects.git
cd myfitjournal
```

2. **Instale as dependências**
```bash
npm install --legacy-peer-deps
```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative Authentication (Email/Password)
   - Ative Cloud Firestore
   - Copie as credenciais para `src/config/Firebase.js`

4. **Execute o projeto**
```bash
# Iniciar Metro Bundler
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios
```

## 📱 Dependências Principais

```json
{
  "dependencies": {
    "expo": "~54.0.23",
    "expo-camera": "~17.0.9",
    "firebase": "*",
    "react": "19.1.1",
    "react-native": "0.82.1",
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "15.12.1",
    "@react-navigation/native": "^6.0.0",
    "@react-navigation/bottom-tabs": "^6.0.0",
    "@react-navigation/native-stack": "^6.0.0",
    "@react-native-picker/picker": "^2.11.4",
    "@react-native-community/datetimepicker": "^8.5.1",
    "@react-native-async-storage/async-storage": "^2.2.0"
  }
}
```

## 🔥 Configuração do Firebase

Estrutura da base de dados Firestore:

```
users/
  {userId}/
    ├── workouts/
    │   └── {workoutId}
    │       ├── name: string
    │       ├── type: string
    │       ├── duration: number
    │       ├── calories: number
    │       ├── notes: string
    │       ├── date: ISO string
    │       ├── createdAt: timestamp
    │       └── updatedAt: timestamp
    │
    └── days/
        └── {YYYY-MM-DD}/
            └── consumedFoods/
                └── {foodId}
                    ├── name: string
                    ├── calories: number
                    ├── protein: number
                    ├── carbs: number
                    ├── fat: number
                    ├── barcode: string (opcional)
                    ├── date: string
                    └── createdAt: timestamp
```

## 📸 Screenshots

*Em breve*

## 👨‍💻 Autor

**Álvaro Faria**
- GitHub: [@Allgommes](https://github.com/Allgommes)
- Projeto: UFCD 11027 - React Native
- Formador: João Monge

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 🙏 Agradecimentos

- Open Food Facts pela API de alimentos
- Firebase pela infraestrutura backend
- Expo pela plataforma de desenvolvimento
- React Native Chart Kit pelos gráficos

## 🐛 Problemas Conhecidos

- Certifique-se de ter as permissões de câmera ativadas para o scanner de código de barras
- Use `--legacy-peer-deps` ao instalar dependências devido a incompatibilidades de versões

## 🔮 Melhorias Futuras

- [ ] Exportação de dados em PDF
- [ ] Metas e objetivos personalizados
- [ ] Notificações push para lembretes
- [ ] Modo offline com sincronização
- [ ] Integração com wearables
- [ ] Partilha de progresso nas redes sociais
- [ ] Planos de treino personalizados
- [ ] Receitas saudáveis

---

⭐ **Desenvolvido com React Native + Firebase** ⭐
