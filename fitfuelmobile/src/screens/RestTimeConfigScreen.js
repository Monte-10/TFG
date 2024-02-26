import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

function RestTimeConfigScreen({ route, navigation }) {
  const { trainingDetails } = route.params;
  const [restTimeBetweenSets, setRestTimeBetweenSets] = useState('60');
  const [restTimeBetweenExercises, setRestTimeBetweenExercises] = useState('90');

  const handleStartTraining = () => {
    navigation.navigate('ActiveTrainingScreen', {
      trainingDetails,
      restTimeBetweenSets: parseInt(restTimeBetweenSets, 10),
      restTimeBetweenExercises: parseInt(restTimeBetweenExercises, 10)
    });
  };

  return (
    <View style={styles.container}>
      <Text>Configura tu tiempo de descanso</Text>
      <TextInput
        style={styles.input}
        onChangeText={setRestTimeBetweenSets}
        value={restTimeBetweenSets}
        keyboardType="numeric"
        placeholder="Tiempo de descanso entre series (segundos)"
      />
      <TextInput
        style={styles.input}
        onChangeText={setRestTimeBetweenExercises}
        value={restTimeBetweenExercises}
        keyboardType="numeric"
        placeholder="Tiempo de descanso entre ejercicios (segundos)"
      />
      <Button title="Empezar Entrenamiento" onPress={handleStartTraining} />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
});

export default RestTimeConfigScreen;
