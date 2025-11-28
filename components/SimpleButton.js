import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SimpleButton({ title, onPress, type = 'primary' }) {
  return (
    <TouchableOpacity style={[styles.button, type === 'primary' ? styles.primary : styles.secondary]} onPress={onPress}>
      <Text style={[styles.text,type === 'primary' ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  }
});
