import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayScreen from './TodayScreen';
import CalendarScreen from './CalendarScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Hoy" component={TodayScreen} />
      <Tab.Screen name="Calendario" component={CalendarScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default HomeScreen;
