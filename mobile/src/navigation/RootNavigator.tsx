import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AspiranteNavigator from './AspiranteNavigator';
import ReclutadorNavigator from './ReclutadorNavigator';
import AdminNavigator from './AdminNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e6ff1" />
      </View>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  // Route based on user role
  switch (user.rol) {
    case 'ASPIRANTE':
      return <AspiranteNavigator />;
    case 'RECLUTADOR':
      return <ReclutadorNavigator />;
    case 'ADMIN':
      return <AdminNavigator />;
    default:
      return <AuthNavigator />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default RootNavigator;
