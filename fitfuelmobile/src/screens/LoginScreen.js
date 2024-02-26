import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      navigation.navigate('HomeScreen'); // Si existe un token, navegar directamente a HomeScreen
    } else {
      setIsLoading(false); // Si no hay token, mostrar la pantalla de inicio de sesión
    }
  };

  checkToken();

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/user/frontlogin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Falló el inicio de sesión');
      }
  
      const data = await response.json();
      if (data.token && data.userId !== undefined) { // Verifica que ambos, token y userId, existen
        await AsyncStorage.setItem('authToken', data.token); // Guardar el token
        await AsyncStorage.setItem('userId', data.userId.toString()); // Guardar el ID del usuario como string
        navigation.navigate('HomeScreen'); // Navegar a HomeScreen
      } else {
        throw new Error('La respuesta del servidor no contiene el token o el userId');
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleSubmit} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default Login;
