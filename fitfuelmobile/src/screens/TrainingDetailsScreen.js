import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { fetchTrainingDetails } from '../api/trainingApi';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function TrainingDetailsScreen({ route }) {
  const { trainingId } = route.params;
  const [trainingDetails, setTrainingDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadTrainingDetails = async () => {
      const details = await fetchTrainingDetails(trainingId);
      console.log('Detalles del training:', details);
      setTrainingDetails(details);
    };
    loadTrainingDetails();
  }, [trainingId]); // trainingId es ahora una constante fija, pero lo mantenemos aquí para mantener la consistencia.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{trainingDetails?.name}</Text>
      <FlatList
        data={trainingDetails?.exercises_details}
        keyExtractor={(item) => item.exercise.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>{item.exercise.name}</Text>
            {item.exercise.image && (
              <Image source={{ uri: item.exercise.image }} style={styles.image} />
            )}
            <Text>Descripción: {item.exercise.description}</Text>
            <Text>Tipo: {item.exercise.type}</Text>
            <Text>Repeticiones: {item.repetitions}</Text>
            <Text>Series: {item.sets}</Text>
            {item.weight ? <Text>Peso: {item.weight}</Text> : null}
            {item.time ? <Text>Tiempo: {item.time}</Text> : null}
          </View>
        )}
      />
      <Button title="Empezar Entrenamiento" onPress={() => navigation.navigate('RestTimeConfigScreen', { trainingDetails })}/>
    </View>
  );
}

const styles = StyleSheet.create({
  
});

export default TrainingDetailsScreen;
