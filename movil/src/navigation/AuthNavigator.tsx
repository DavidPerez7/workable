import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterAspiranteScreen from '../screens/auth/RegisterAspiranteScreen';
import RegisterReclutadorScreen from '../screens/auth/RegisterReclutadorScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import type { AuthStackParamList } from '../types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterAspirante" component={RegisterAspiranteScreen} />
      <Stack.Screen name="RegisterReclutador" component={RegisterReclutadorScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
