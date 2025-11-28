import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleButton from '../../../components/SimpleButton';
import { db, auth } from '../../config/Firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export default function WorkoutDetailsScreen({ navigation, route }) {
  const { workout } = route.params;

  const handleEdit = () => {
    navigation.navigate('AddWorkout', { workout });
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja eliminar este treino?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              console.log('Eliminando treino:', workout.id);
              const workoutRef = doc(db, 'users', user.uid, 'workouts', workout.id);
              await deleteDoc(workoutRef);
              
              Alert.alert('Sucesso', 'Treino eliminado!');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao eliminar treino:', error);
              Alert.alert('Erro', 'Não foi possível eliminar o treino');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{workout.type}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <DetailRow icon="⏱" label="Duração" value={`${workout.duration} minutos`} />
        <DetailRow icon="🔥" label="Calorias" value={`${workout.calories} kcal`} />
        <DetailRow icon="📅" label="Data" value={formatDate(workout.date)} />
      </View>

      {workout.notes ? (
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>📝 Notas</Text>
          <Text style={styles.notesText}>{workout.notes}</Text>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <SimpleButton title="Editar" onPress={handleEdit} />
        <View style={{ height: 10 }} />
        <SimpleButton 
          title="Eliminar" 
          onPress={handleDelete}
          style={{ backgroundColor: '#FF3B30' }}
        />
      </View>
    </ScrollView>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 30
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10
  },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start'
  },
  typeText: {
    color: 'white',
    fontWeight: '600'
  },
  detailsCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 15
  },
  detailContent: {
    flex: 1
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  notesCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  notesText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  buttonContainer: {
    padding: 20
  }
});