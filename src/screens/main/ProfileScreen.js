import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../../config/Firebase';
import SimpleButton from '../../../components/SimpleButton';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const backgroundColor = '#964545ff';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../../assets/avatar.jpg')} style={styles.avatar} />
        <Text style={styles.title}>Seu Perfil</Text>
      </View>
      
      <View style={styles.card}>
        <Text>Email: {user?.email}</Text>
      </View>

      
      <SimpleButton 
        title="Estatísticas" 
        onPress={() => navigation.navigate('Statistics')}
      />
      <SimpleButton 
        title="Definições" 
        onPress={() => navigation.navigate('Settings')}
      />
      <SimpleButton 
        title="Sobre" 
        onPress={() => navigation.navigate('About')}
      />
      <SimpleButton 
        title="Logout" 
        onPress={handleLogout}
        type="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
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
  }
});