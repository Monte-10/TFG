import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

function ActiveTrainingScreen({ route, navigation }) {
  const { trainingDetails, restTimeBetweenSets, restTimeBetweenExercises } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timer, setTimer] = useState(null);
  const [isResting, setIsResting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isExerciseTime, setIsExerciseTime] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if ((isResting || isPreparing || isExerciseTime) && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(intervalId); // Limpia el intervalo cuando el contador llega a 0
      if (isPreparing) {
        setIsPreparing(false);
        setIsExerciseTime(true); // Inicia el contador del tiempo de ejercicio
        setTimer(trainingDetails.exercises_details[currentExerciseIndex].time); // Configura el tiempo del ejercicio actual
        setIsTimerRunning(true);
      } else if (isExerciseTime) {
        setIsExerciseTime(false); // Finaliza el tiempo del ejercicio
        // Avanza al siguiente set o al siguiente ejercicio si se han completado todos los sets
        nextExerciseOrSet();
      } else if (isResting) {
        setIsResting(false); // Finaliza el descanso
      }
    }
    return () => clearInterval(intervalId);
  }, [timer, isResting, isPreparing, isExerciseTime]);

  const cancelTimer = () => {
    setTimer(null);
    setIsTimerRunning(false);
    setIsPreparing(false);
    setIsExerciseTime(false)
  };

  const nextExerciseOrSet = () => {
    // Solo avanza al siguiente set o ejercicio si el tiempo del ejercicio ha finalizado
    setIsExerciseTime(false);
    setIsTimerRunning(false);
    if (!isExerciseTime) {
      if (currentSet < trainingDetails.exercises_details[currentExerciseIndex].sets) {
        setCurrentSet(currentSet + 1);
      } else if (currentExerciseIndex < trainingDetails.exercises_details.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      } else {
        Alert.alert("Entrenamiento completado", "¡Buen trabajo!");
        navigation.navigate('TrainingFeedbackScreen', { trainingDetails });
      }
    }
    if (timer === 0) {
      setTimer(null);
    }

  };

  const handleSkipRest = () => {
    setIsResting(false); // Detiene el descanso inmediatamente
    setTimer(null); // Resetea el temporizador
    // No avanza automáticamente, permite al usuario decidir el próximo paso
  };

  const handleNextSetOrExercise = () => {
    // Determina si se debe iniciar el tiempo de descanso entre sets o entre ejercicios
    const restTime = currentSet < trainingDetails.exercises_details[currentExerciseIndex].sets ? restTimeBetweenSets : restTimeBetweenExercises;
    setIsPreparing(false);
    setIsExerciseTime(false);
    setIsResting(true);
    setTimer(restTime);
    nextExerciseOrSet();
  };

  const startPreparationTime = () => {
    if (!isResting && !isExerciseTime) {
      setIsPreparing(true);
      setTimer(5);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Ejercicio actual: {trainingDetails.exercises_details[currentExerciseIndex].exercise.name}</Text>
      <Text>Set: {currentSet} de {trainingDetails.exercises_details[currentExerciseIndex].sets}</Text>
      {trainingDetails.exercises_details[currentExerciseIndex].weight && <Text>Peso: {trainingDetails.exercises_details[currentExerciseIndex].weight } kg</Text>}
      {trainingDetails.exercises_details[currentExerciseIndex].time && <Text>Tiempo: {trainingDetails.exercises_details[currentExerciseIndex].time} segundos</Text>}
      {isPreparing && <Text>Prepárate: {timer}</Text>}
      {isExerciseTime && <Text>Tiempo de Ejercicio: {timer}</Text>}
      {isResting && <Text>Descanso: {timer} segundos</Text>}
      {trainingDetails.exercises_details[currentExerciseIndex].time && !isResting && !isExerciseTime && !isPreparing && (
        <Button title="Iniciar Contador" onPress={startPreparationTime} />
      )}
      { isTimerRunning && isExerciseTime &&
        <Button title="Cancelar Contador" onPress={cancelTimer} />
      }
      {!isResting && !isExerciseTime && !isPreparing && !isTimerRunning &&
        <Button title="Siguiente Set/Ejercicio" onPress={handleNextSetOrExercise} />
      }
      {isResting && (
        <Button title="Saltar Descanso" onPress={handleSkipRest} />
      )}
      <Button title="Finalizar Entrenamiento" onPress={() => navigation.navigate('TrainingFeedbackScreen', { trainingDetails })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActiveTrainingScreen;
