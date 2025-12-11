import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardAdminScreen from '../screens/admin/DashboardAdminScreen';
import UsuariosAdminScreen from '../screens/admin/UsuariosAdminScreen';
import OfertasAdminScreen from '../screens/admin/OfertasAdminScreen';
import PostulacionesAdminScreen from '../screens/admin/PostulacionesAdminScreen';
import AspiranteViewScreen from '../screens/admin/AspiranteViewScreen';
import ReclutadorViewScreen from '../screens/admin/ReclutadorViewScreen';
import type { AdminDrawerParamList } from '../types';

const Stack = createNativeStackNavigator<AdminDrawerParamList>();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1e6ff1',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DashboardAdmin"
        component={DashboardAdminScreen}
        options={{
          title: 'Dashboard Admin',
        }}
      />
      <Stack.Screen
        name="UsuariosAdmin"
        component={UsuariosAdminScreen}
        options={{
          title: 'Gestión de Usuarios',
        }}
      />
      <Stack.Screen
        name="OfertasAdmin"
        component={OfertasAdminScreen}
        options={{
          title: 'Gestión de Ofertas',
        }}
      />
      <Stack.Screen
        name="PostulacionesAdmin"
        component={PostulacionesAdminScreen}
        options={{
          title: 'Gestión de Postulaciones',
        }}
      />
      <Stack.Screen
        name="AspiranteView"
        component={AspiranteViewScreen}
        options={{
          title: 'Vista Aspirante',
        }}
      />
      <Stack.Screen
        name="ReclutadorView"
        component={ReclutadorViewScreen}
        options={{
          title: 'Vista Reclutador',
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
