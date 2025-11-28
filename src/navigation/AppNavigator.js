import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../config/Firebase';
import LoginScreen from '../screens/auth/LoginSreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import WorkoutsScreen from '../screens/main/WorkoutsScreen';
import NutritionScreen from '../screens/main/NutritionScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import StatisticsScreen from '../screens/main/StatisticsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import AboutScreen from '../screens/main/AboutScreen';
import BarcodeScannerScreen from '../screens/main/BarcodeScannerScreen';
import AddFoodScreen from '../screens/main/AddFoodScreen';
import AddWorkoutScreen from '../screens/main/AddWorkoutScreen';
import WorkoutDetailsScreen from '../screens/main/WorkoutDetailsScreen';
import { Ionicons } from '@expo/vector-icons';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Workouts') iconName = focused ? 'barbell' : 'barbell-outline';
          else if (route.name === 'Nutrition') iconName = focused ? 'nutrition' : 'nutrition-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} options={{ title: 'Ler Código de Barras' }} />
          <Stack.Screen name="AddFood" component={AddFoodScreen} options={{ title: 'Registar Alimento' }} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ title: 'Adicionar Treino' }} />
          <Stack.Screen name="WorkoutDetails" component={WorkoutDetailsScreen} options={{ title: 'Detalhes do Treino' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}