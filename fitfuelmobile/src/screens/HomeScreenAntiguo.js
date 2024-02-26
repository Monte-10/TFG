import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen ({ navigation }) {
  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Eliminar el token de AsyncStorage
    navigation.navigate('Login'); // Redirigir al usuario a la pantalla de Login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Diet y Training</Text>
      {/* Aquí iría la lógica para mostrar el DailyDiet y el Training del día */}

      <Button
        title="Ver Detalles del Training"
        onPress={() => navigation.navigate('TrainingDetailsScreen', { trainingId: 10 })} // Ejemplo de cómo pasar el ID del training
      />
      <Button
        title="Ver Calendario"
        onPress={() => navigation.navigate('Calendar')}
      />
      <Button
        title="Ver Historial de Entrenamientos"
        onPress={() => navigation.navigate('TrainingHistoryScreen')}
      />
      <Button
        title="Cerrar Sesión"
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
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;