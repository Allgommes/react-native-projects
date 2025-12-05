import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import SimpleButton from '../../../components/SimpleButton';
import { db, auth } from '../../config/Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0
  });

  useEffect(() => { // useEffect para buscar estatísticas ao montar o componente neste caso o componente HomeScreen
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const last7Days = getLast7Days();
      let totalWorkouts = 0;
      let totalCaloriesBurned = 0;
      let totalCaloriesConsumed = 0;

      for (const date of last7Days) {
        // Buscar treinos
        const workoutsRef = collection(db, 'users', user.uid, 'workouts');
        const workoutsQuery = query(
          workoutsRef,
          where('date', '>=', date.start),
          where('date', '<=', date.end)
        );
        const workoutsSnapshot = await getDocs(workoutsQuery);
        totalWorkouts += workoutsSnapshot.size;

        // Somar calorias gastas nos treinos
        workoutsSnapshot.forEach((doc) => { // forEach para iterar sobre cada documento retornado na consulta
          totalCaloriesBurned += doc.data().calories || 0; // doc.data() representa cada treino
        });

        // Buscar alimentos consumidos
        const foodsRef = collection(db, 'users', user.uid, 'days', date.key, 'consumedFoods');  // cria a referência à coleção de alimentos consumidos para o dia específico
        const foodsSnapshot = await getDocs(foodsRef);
        
        foodsSnapshot.forEach((doc) => { // foodSnapshot representa os alimentos consumidos naquele dia
          totalCaloriesConsumed += doc.data().calories || 0;
        });
      }

      setStats({
        totalWorkouts,
        caloriesBurned: totalCaloriesBurned,
        caloriesConsumed: totalCaloriesConsumed
      });

      console.log('Stats carregadas:', { totalWorkouts, totalCaloriesBurned, totalCaloriesConsumed });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      days.push({
        key: dateKey,
        start: start.toISOString(),
        end: end.toISOString()
      });
    }
    return days;
  };

  const tips = [
    'Mantenha-se hidratado durante os treinos!',
    'Durma pelo menos 7-8 horas por noite.',
    'Consuma proteínas após o treino.',
    'Faça alongamentos antes e depois do exercício.',
    'Estabeleça metas realistas e celebre conquistas!'
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}> // ScrollView para permitir rolagem na tela inicial
      <Text style={styles.title}>Bem-vindo ao MyFit Journal</Text>

      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/logoCool.png')} style={styles.logo} />
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo da Semana</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Treinos:</Text>
          <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Calorias gastas:</Text>
          <Text style={styles.statValue}>{stats.caloriesBurned} kcal</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Calorias consumidas:</Text>
          <Text style={styles.statValue}>{stats.caloriesConsumed} kcal</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dica do Dia</Text>
        <Text style={styles.tipText}>{randomTip}</Text>
      </View>

      <SimpleButton 
        title="Ver Estatísticas" 
        onPress={() => navigation.navigate('Statistics')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  statLabel: {
    fontSize: 16,
    color: '#666'
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22
  }
});