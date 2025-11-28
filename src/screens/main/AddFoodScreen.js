import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import SimpleButton from '../../../components/SimpleButton';
import { db } from '../../config/Firebase';



export default function AddFoodScreen({ navigation, route }) {
  const prefill = route?.params?.prefill || {}; // esta linha de codigo foi adicionada com a finalidade de preencher os campos automaticamente ao navegar a partir do scanner de codigo de barras
  const [name, setName] = useState(prefill.name || '');
  const [calories, setCalories] = useState(prefill.calories?.toString?.() || '');
  const [protein, setProtein] = useState(prefill.protein?.toString?.() || '');
  const [carbs, setCarbs] = useState(prefill.carbs?.toString?.() || '');
  const [fat, setFat] = useState(prefill.fat?.toString?.() || '');
  const [barcode, setBarcode] = useState(prefill.barcode?.toString?.() || '');
  const totalCalories = Math.round((Number(protein)||0)*4 + (Number(carbs)||0)*4 + (Number(fat)||0)*9); // Calorias totais calculadas com base nos macronutrientes
// const totalCalories = Math.round((Number(protein)||0)*4 + (Number(carbs)||0)*4 + (Number(fat)||0)*9);
  const handleSave = () => {  // Função chamada ao pressionar o botão "Guardar"
    if (!name || !calories) { // Validação simples para garantir que nome e calorias não estão vazios
      Alert.alert('Erro', 'Nome e calorias são obrigatórios');
      return;
    }

    const food = { // Cria o objeto alimento com os dados inseridos
      id: Date.now().toString(),
      name,
      calories: Number(calories) || totalCalories || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      totalCalories: totalCalories || Number(calories) || 0,
      barcode: barcode || null
    };

    navigation.navigate('MainTabs', { screen: 'Nutrition', params: { newFood: food } }); // Navega de volta para a tela de Nutrição com o novo alimento
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registar Alimento</Text>

      <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Calorias (kcal)" value={calories} onChangeText={setCalories} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Proteínas (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Carboidratos (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Gorduras (g)" value={fat} onChangeText={setFat} keyboardType="numeric" />
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Calorias (calculado): {totalCalories} kcal</Text>
      </View>

      <SimpleButton title="Guardar" onPress={handleSave} />
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
    marginBottom: 20
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  totalBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16
  },
  totalLabel: {
    fontWeight: '600',
    color: '#333'
  }
});
