import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OfertasNavigator from './stacks/OfertasNavigator';
import PostulacionesNavigator from './stacks/PostulacionesNavigator';
import PerfilAspiranteScreen from '../screens/aspirante/PerfilAspiranteScreen';
import type { AspiranteTabParamList } from '../types';

const Tab = createBottomTabNavigator<AspiranteTabParamList>();

const AspiranteNavigator = () => {
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
        name="OfertasTab"
        component={OfertasNavigator}
        options={{
          title: 'Ofertas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PostulacionesTab"
        component={PostulacionesNavigator}
        options={{
          title: 'Mis Postulaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilAspiranteScreen}
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

export default AspiranteNavigator;
