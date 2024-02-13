import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('TU_ENDPOINT_DE_API/events');
        const fetchedEvents = res.data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default Calendario;
