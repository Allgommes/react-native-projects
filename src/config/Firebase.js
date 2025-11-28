import React, { createContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import { 
  initializeApp 
} from 'firebase/app';

import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

import { 
  getFirestore 
} from 'firebase/firestore';


// CONFIG DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBmqTsKf2nZfsjjSptfJ66afPMIZ0zDsYo",
  authDomain: "myfitjournal-ee966.firebaseapp.com",
  projectId: "myfitjournal-ee966",
  storageBucket: "myfitjournal-ee966.firebasestorage.app",
  messagingSenderId: "263236508368",
  appId: "1:263236508368:web:d80ae321a80b0dacd49cd5"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar auth e firestore
export const auth = getAuth(app);
export const db = getFirestore(app);


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);


  // Detectar mudanças no estado do utilizador
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "Nenhum utilizador");
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  // LOGIN
  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Erro no login:", error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };


  // REGISTO
  const register = async (email, password) => {
    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Erro no registo:", error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };


  // LOGOUT
  const logout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Erro no logout:", error.message);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        login,
        register,
        logout,
        loading: authLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


const styles = StyleSheet.create({
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
  }
});
