import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../config/Firebase';
import SimpleButton from '../../../components/SimpleButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Erro de Login', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyFit Journal</Text>
      <Text style={styles.subtitle}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <SimpleButton title="Entrar" onPress={handleLogin} />
      
      <SimpleButton title="Criar Conta" onPress={() => navigation.navigate('Register')} type="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007AFF'
  },
  subtitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333'
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  }
});