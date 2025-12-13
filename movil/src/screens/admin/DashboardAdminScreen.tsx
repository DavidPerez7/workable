import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';

const DashboardAdminScreen = () => {
  const { logout, user } = useAuth();

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Bienvenido, {user?.nombre}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acceso Total</Text>
        <Text style={styles.cardText}>Como administrador, tienes acceso completo a todas las funcionalidades de aspirantes y reclutadores.</Text>
      </View>
      <Button title="Cerrar Sesión" onPress={() => logout()} variant="danger" fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  header: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, ...shadows.md },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, ...shadows.md },
  cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm },
  cardText: { fontSize: fontSize.md, color: colors.textSecondary },
});

export default DashboardAdminScreen;
