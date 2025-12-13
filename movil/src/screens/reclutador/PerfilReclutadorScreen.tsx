import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../api/reclutador';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Reclutador } from '../../types';

const PerfilReclutadorScreen = () => {
  const { logout } = useAuth();
  const [perfil, setPerfil] = useState<Reclutador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerfil();
  }, []);

  const loadPerfil = async () => {
    try {
      const data = await getMyProfile();
      setPerfil(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', onPress: logout, style: 'destructive' },
    ]);
  };

  if (loading || !perfil) return <Loading />;

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{perfil.nombre} {perfil.apellido}</Text>
        <Text style={styles.subtitle}>{perfil.correo}</Text>
        <Text style={styles.subtitle}>{perfil.cargo}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empresa</Text>
        <Text style={styles.text}>{perfil.empresa?.nombre}</Text>
        <Button title="Cerrar Sesión" onPress={handleLogout} variant="danger" fullWidth style={{ marginTop: spacing.lg }} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  header: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, ...shadows.md, alignItems: 'center' },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  section: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, ...shadows.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  text: { fontSize: fontSize.md, color: colors.text },
});

export default PerfilReclutadorScreen;
