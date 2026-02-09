import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MisOfertasListScreen from '../../screens/reclutador/MisOfertasListScreen';
import OfertaDetailReclutadorScreen from '../../screens/reclutador/OfertaDetailReclutadorScreen';
import EditarOfertaScreen from '../../screens/reclutador/EditarOfertaScreen';
import PostulantesOfertaScreen from '../../screens/reclutador/PostulantesOfertaScreen';
import PostulanteDetailScreen from '../../screens/reclutador/PostulanteDetailScreen';
import type { MisOfertasStackParamList } from '../../types';

const Stack = createStackNavigator<MisOfertasStackParamList>();

const MisOfertasNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e6ff1',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="MisOfertasList"
        component={MisOfertasListScreen}
        options={{ title: 'Mis Ofertas' }}
      />
      <Stack.Screen
        name="OfertaDetailReclutador"
        component={OfertaDetailReclutadorScreen}
        options={{ title: 'Detalle de Oferta' }}
      />
      <Stack.Screen
        name="EditarOferta"
        component={EditarOfertaScreen}
        options={{ title: 'Editar Oferta' }}
      />
      <Stack.Screen
        name="PostulantesOferta"
        component={PostulantesOfertaScreen}
        options={{ title: 'Postulantes' }}
      />
      <Stack.Screen
        name="PostulanteDetail"
        component={PostulanteDetailScreen}
        options={{ title: 'Detalle del Postulante' }}
      />
    </Stack.Navigator>
  );
};

export default MisOfertasNavigator;
