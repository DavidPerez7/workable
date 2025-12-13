import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardReclutadorScreen from '../screens/reclutador/DashboardReclutadorScreen';
import MisOfertasNavigator from './stacks/MisOfertasNavigator';
import CrearOfertaScreen from '../screens/reclutador/CrearOfertaScreen';
import PerfilReclutadorScreen from '../screens/reclutador/PerfilReclutadorScreen';
import type { ReclutadorTabParamList } from '../types';

const Tab = createBottomTabNavigator<ReclutadorTabParamList>();

const ReclutadorNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e6ff1',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardReclutadorScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MisOfertasTab"
        component={MisOfertasNavigator}
        options={{
          title: 'Mis Ofertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CrearOfertaTab"
        component={CrearOfertaScreen}
        options={{
          title: 'Crear Oferta',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilReclutadorTab"
        component={PerfilReclutadorScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ReclutadorNavigator;
