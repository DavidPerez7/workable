import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostulacionesListScreen from '../../screens/aspirante/PostulacionesListScreen';
import PostulacionDetailScreen from '../../screens/aspirante/PostulacionDetailScreen';
import type { PostulacionesStackParamList } from '../../types';

const Stack = createStackNavigator<PostulacionesStackParamList>();

const PostulacionesNavigator = () => {
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
        name="PostulacionesList"
        component={PostulacionesListScreen}
        options={{ title: 'Mis Postulaciones' }}
      />
      <Stack.Screen
        name="PostulacionDetail"
        component={PostulacionDetailScreen}
        options={{ title: 'Detalle de Postulación' }}
      />
    </Stack.Navigator>
  );
};

export default PostulacionesNavigator;
