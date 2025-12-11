import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DashboardAdminScreen from '../screens/admin/DashboardAdminScreen';
import UsuariosAdminScreen from '../screens/admin/UsuariosAdminScreen';
import OfertasAdminScreen from '../screens/admin/OfertasAdminScreen';
import PostulacionesAdminScreen from '../screens/admin/PostulacionesAdminScreen';
import AspiranteViewScreen from '../screens/admin/AspiranteViewScreen';
import ReclutadorViewScreen from '../screens/admin/ReclutadorViewScreen';
import type { AdminDrawerParamList } from '../types';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

const AdminNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1e6ff1',
        },
        headerTintColor: '#ffffff',
        drawerActiveTintColor: '#1e6ff1',
        drawerInactiveTintColor: '#64748b',
        drawerStyle: {
          backgroundColor: '#f8f9fa',
        },
      }}
    >
      <Drawer.Screen
        name="DashboardAdmin"
        component={DashboardAdminScreen}
        options={{
          title: 'Dashboard Admin',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UsuariosAdmin"
        component={UsuariosAdminScreen}
        options={{
          title: 'Gestión de Usuarios',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="OfertasAdmin"
        component={OfertasAdminScreen}
        options={{
          title: 'Gestión de Ofertas',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PostulacionesAdmin"
        component={PostulacionesAdminScreen}
        options={{
          title: 'Gestión de Postulaciones',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AspiranteView"
        component={AspiranteViewScreen}
        options={{
          title: 'Vista Aspirante',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ReclutadorView"
        component={ReclutadorViewScreen}
        options={{
          title: 'Vista Reclutador',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminNavigator;
