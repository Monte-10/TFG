import React from 'react';

import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Localizer
const localizer = momentLocalizer(moment);

// Datos de ejemplo para eventos del calendario
const myEventsList = [
  {
    title: 'Entrenamiento de Fuerza',
    start: new Date(), // Fecha de inicio
    end: new Date(moment().add(1, "hours")), // Fecha de fin, 1 hora después
  },
  // Agrega más eventos según sea necesario
];

const Calendario = () => (
  <div style={{ height: 700 }}>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
);

export default Calendario;
