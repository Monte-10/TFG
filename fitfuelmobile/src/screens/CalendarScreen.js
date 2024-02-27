import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const events = {
      '2024-02-26': {marked: true, dotColor: 'blue', activeOpacity: 0},
      '2024-02-27': {marked: true, dotColor: 'red', activeOpacity: 0}
    };

    setMarkedDates(events);
  }, []);

  return (
    <View>
      <Calendar
        // La propiedad markedDates acepta un objeto donde las claves son fechas
        // y los valores son objetos que definen cómo se deben marcar.
        markedDates={markedDates}
        onDayPress={(day) => {
          console.log('selected day', day);
        }}
      />
    </View>
  );
};

export default CalendarScreen;
