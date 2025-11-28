import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleButton from '../../../components/SimpleButton';
import { db, auth } from '../../config/Firebase';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';


export default function AddWorkoutScreen({ navigation, route }) {
    const editWorkout = route?.params?.workout;
    const isEditing = !!editWorkout;

    const [name, setName] = useState(editWorkout?.name || '');
    const [type, setType] = useState(editWorkout?.type || 'Bicicleta');
    const [duration, setDuration] = useState(editWorkout?.duration?.toString() || '');
    const [calories, setCalories] = useState(editWorkout?.calories?.toString() || '');
    const [notes, setNotes] = useState(editWorkout?.notes || '');
    const [date, setDate] = useState(editWorkout?.date ? new Date(editWorkout.date): new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const workoutTypes = ['Cardio', 'Musculação', 'Yoga', 'Pilates', 'Natação', 'Ciclismo', 'Corrida', 'Outro'];

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Erro', 'O nome do treino é obrigatório');
            return;
        }
        if (!duration || Number(duration) <= 0) {
            Alert.alert('Erro', 'A duração deve ser maior que zero');
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Erro', 'Usuário não autenticado');
                return;
            }

            const workoutData = {
                name: name.trim(),
                type,
                duration: Number(duration),
                calories: Number(calories) || 0,
                notes: notes.trim(),
                date: date.toISOString(),
                updatedAt: Timestamp.now()
            };

            if (isEditing) {
                console.log('Atualizando treino:', editWorkout.id);
                const workoutRef = doc(db, 'users', user.uid, 'workouts', editWorkout.id);
                await updateDoc(workoutRef, workoutData);
                Alert.alert('Sucesso', 'Treino atualizado!');
            } else {
                console.log('Criando novo treino');
                workoutData.createdAt = Timestamp.now();
                const workoutsRef = collection(db, 'users', user.uid, 'workouts');
                await addDoc(workoutsRef, workoutData);
                Alert.alert('Sucesso', 'Treino adicionado!');
            }

            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar treino:', error);
            Alert.alert('Erro', 'Não foi possível salvar o treino');
        }
    };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Editar Treino' : 'Adicionar Treino'}</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Corrida matinal"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={setType}
          style={styles.picker}
        >
          {workoutTypes.map(t => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Duração (minutos):</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 30"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Calorias Gastas:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 300"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data:</Text>
      <SimpleButton
        title={date.toLocaleDateString('pt-PT')}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Notas:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Adicione observações..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
      />

      <SimpleButton title={isEditing ? 'Atualizar' : 'Guardar'} onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  picker: {
    height: 50
  }
});
