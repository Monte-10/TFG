import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../providers/AuthProvider'; // Asegúrate de tener este hook implementado si lo usas

function ProfileScreen({ navigation }) {

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Eliminar el token de AsyncStorage
    navigation.navigate('Login'); // Redirigir al usuario a la pantalla de Login
  };

  // Función para manejar la navegación al historial de entrenamientos
  const handleNavigateToTrainingHistory = () => {
    navigation.navigate('TrainingHistoryScreen'); // Asegúrate de que este nombre coincida con cómo lo has definido en tu stack de navegación
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla de Perfil</Text>
        <Button
          title="Historial de Entrenamientos"
          buttonStyle={styles.button}
          onPress={handleNavigateToTrainingHistory}
        />
        <Button
          title="Cerrar Sesión"
          buttonStyle={styles.button}
          onPress={handleLogout}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    width: 200,
    marginVertical: 10, // Añade un poco de espacio vertical entre los botones
  },
});

export default ProfileScreen;
