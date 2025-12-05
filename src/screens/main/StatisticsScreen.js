import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { db, auth } from '../../config/Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// StatisticsScreen.js
// This screen displays user statistics for workouts and calories over the last 7 days.
// It fetches data from Firebase and renders charts using react-native-chart-kit.
const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const [loading, setLoading] = useState(true);
  const [workoutsData, setWorkoutsData] = useState({ labels: [], datasets: [{ data: [0] }] });
  const [caloriesData, setCaloriesData] = useState({ labels: [], datasets: [{ data: [0] }] });
  const [stats, setStats] = useState({ 
    totalWorkouts: 0, 
    totalCalories: 0,
    avgCalories: 0
  });

  useEffect(() => { 
    fetchStatistics(); 
  }, []);

  const fetchStatistics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const last7Days = getLast7Days();
      const workoutsCounts = [];
      const caloriesSums = [];

      for (const date of last7Days) {
        const workoutsRef = collection(db, 'users', user.uid, 'workouts');
        const workoutsQuery = query(
          workoutsRef,
          where('date', '>=', date.start),
          where('date', '<=', date.end)
        );
        const workoutsSnapshot = await getDocs(workoutsQuery);
        workoutsCounts.push(workoutsSnapshot.size);

        const foodsRef = collection(db, 'users', user.uid, 'days', date.key, 'consumedFoods');
        const foodsSnapshot = await getDocs(foodsRef);

        let dailyCalories = 0;
        foodsSnapshot.forEach((doc) => {
          dailyCalories += doc.data().calories || 0;
        });
        caloriesSums.push(dailyCalories);
      }

      const labels = last7Days.map(d => d.label);

      setWorkoutsData({
        labels,
        datasets: [{ data: workoutsCounts.length > 0 ? workoutsCounts : [0] }]
      });

      setCaloriesData({
        labels,
        datasets: [{ data: caloriesSums.length > 0 ? caloriesSums : [0] }]
      });

      const totalWorkouts = workoutsCounts.reduce((a, b) => a + b, 0);
      const totalCalories = caloriesSums.reduce((a, b) => a + b, 0);
      const avgCalories = totalCalories / caloriesSums.filter(c => c > 0).length || 0;

      setStats({
        totalWorkouts,
        totalCalories,
        avgCalories: Math.round(avgCalories)
      });

      console.log(' Estatísticas carregadas:', { totalWorkouts, totalCalories, avgCalories });

    } catch (error) {
      console.error(' Erro ao buscar estatísticas:', error);
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
        label: `${date.getDate()}/${date.getMonth() + 1}`,
        start: start.toISOString(),
        end: end.toISOString()
      });
    }
    return days;
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Estatísticas</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Treinos (7 dias)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalCalories}</Text>
          <Text style={styles.statLabel}>Total Calorias (7 dias)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.avgCalories}</Text>
          <Text style={styles.statLabel}>Média Calorias/Dia</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}> Evolução de Treinos (Últimos 7 dias)</Text>
        <BarChart
          data={workoutsData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}> Calorias Consumidas (Últimos 7 dias)</Text>
        <LineChart
          data={caloriesData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`
          }}
          style={styles.chart}
          bezier
          yAxisLabel=""
          yAxisSuffix=" kcal"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    color: '#333'
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10
  }
});
