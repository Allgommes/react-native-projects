import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import SimpleButton from '../../../components/SimpleButton';
import { db, auth } from '../../config/Firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function WorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    console.log('👂 Ouvindo treinos do Firebase');
    const workoutsRef = collection(db, 'users', user.uid, 'workouts');
    const q = query(workoutsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutsList = [];
      snapshot.forEach((doc) => {
        workoutsList.push({ id: doc.id, ...doc.data() });
      });
      console.log(`📋 ${workoutsList.length} treinos carregados`);
      setWorkouts(workoutsList);
      setLoading(false);
    }, (error) => {
      console.error('❌ Erro ao carregar treinos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddWorkout = () => {
    navigation.navigate('AddWorkout');
  };

  const handleWorkoutPress = (workout) => {
    navigation.navigate('WorkoutDetails', { workout });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando treinos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treinos</Text>
      
      <SimpleButton title="Adicionar Treino" onPress={handleAddWorkout} />

      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum treino registado</Text>
          <Text style={styles.emptySubtext}>Clique em "Adicionar Treino" para começar</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.workoutCard}
              onPress={() => handleWorkoutPress(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.workoutName}>{item.name}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>⏱️ {item.duration} min</Text>
                <Text style={styles.detailText}>🔥 {item.calories} kcal</Text>
                <Text style={styles.detailText}>📅 {formatDate(item.date)}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  listContent: {
    paddingBottom: 20
  },
  workoutCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  typeBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailText: {
    fontSize: 14,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999'
  }
});
