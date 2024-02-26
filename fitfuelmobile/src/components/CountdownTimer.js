import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CountdownTimer = ({ initialTime, onEnd, prepareTime = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPreparing, setIsPreparing] = useState(prepareTime > 0);

  useEffect(() => {
    let timer;
    if (isPreparing) {
      // Iniciar periodo de preparación
      timer = setTimeout(() => {
        setIsPreparing(false);
        setTimeLeft(initialTime); // Resetear al tiempo inicial para el ejercicio
      }, prepareTime * 1000); // prepareTime en segundos
    } else if (timeLeft > 0) {
      // Iniciar contador regresivo
      timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t - 1 === 0) {
            clearInterval(timer);
            if (onEnd) onEnd(); // Llamar a onEnd cuando el tiempo llegue a 0
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isPreparing, initialTime, prepareTime, onEnd]);

  return (
    <View style={styles.container}>
      {isPreparing ? (
        <Text style={styles.text}>Preparándote... {prepareTime}</Text>
      ) : (
        <Text style={styles.text}>Tiempo restante: {timeLeft}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Estilos para tu contador
  },
  text: {
    fontSize: 20,
    // Otros estilos para el texto
  },
});

export default CountdownTimer;
