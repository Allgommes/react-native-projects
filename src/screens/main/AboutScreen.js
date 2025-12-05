import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SOBRE</Text>
      
      <View style={styles.logoContainer}>
        { <Image source={require('../../../assets/logoCool.png')} style={styles.logo} /> }
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.appName}>MyFit Journal</Text>
        <Text style={styles.version}>UFCD 11027 - React Native</Text>
        <Text style={styles.description}>
          Formador: João Monge Aluno: Alvaro Faria</Text>
      </View>

      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>Funcionalidades:</Text>
        <Text style={styles.featureItem}>• Gestão de Treinos</Text>
        <Text style={styles.featureItem}>• Registo de Nutrição</Text>
        <Text style={styles.featureItem}>• Scanner de Código de Barras</Text>
        <Text style={styles.featureItem}>• Estatísticas e Gráficos</Text>
        <Text style={styles.featureItem}>• Sincronização com Firebase</Text>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>© 2025 MyFit Journal</Text>
        <Text style={styles.footerSubtext}>Disponível no GitHub</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,   
    backgroundColor: '#f5f2f2'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 5
  },
  version: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24
  },
  featuresCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  featureItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22
  },
  footerCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999'
  }
});