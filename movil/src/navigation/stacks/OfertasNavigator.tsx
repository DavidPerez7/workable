import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OfertasListScreen from '../../screens/aspirante/OfertasListScreen';
import OfertaDetailScreen from '../../screens/aspirante/OfertaDetailScreen';
import type { OfertasStackParamList } from '../../types';

const Stack = createStackNavigator<OfertasStackParamList>();

const OfertasNavigator = () => {
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
        name="OfertasList"
        component={OfertasListScreen}
        options={{ title: 'Ofertas Disponibles' }}
      />
      <Stack.Screen
        name="OfertaDetail"
        component={OfertaDetailScreen}
        options={{ title: 'Detalle de Oferta' }}
      />
    </Stack.Navigator>
  );
};

export default OfertasNavigator;
