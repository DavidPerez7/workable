import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../../api/aspirante';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Aspirante } from '../../types';

const PerfilAspiranteScreen = () => {
  const { logout, user } = useAuth();
  const [perfil, setPerfil] = useState<Aspirante | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    if (!perfil) return;
    setSaving(true);
    try {
      await updateMyProfile(perfil);
      Alert.alert('Éxito', 'Perfil actualizado');
      setEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
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
      </View>

      {editing ? (
        <View style={styles.form}>
          <Input label="Nombre" value={perfil.nombre} onChangeText={(text) => setPerfil({ ...perfil, nombre: text })} />
          <Input label="Apellido" value={perfil.apellido} onChangeText={(text) => setPerfil({ ...perfil, apellido: text })} />
          <Input label="Teléfono" value={perfil.telefono || ''} onChangeText={(text) => setPerfil({ ...perfil, telefono: text })} keyboardType="phone-pad" />
          <Input label="Dirección" value={perfil.direccion || ''} onChangeText={(text) => setPerfil({ ...perfil, direccion: text })} />
          <Button title="Guardar" onPress={handleSave} loading={saving} fullWidth />
          <Button title="Cancelar" onPress={() => setEditing(false)} variant="outline" fullWidth style={{ marginTop: spacing.sm }} />
        </View>
      ) : (
        <View style={styles.section}>
          {perfil.telefono && <Text style={styles.text}>Teléfono: {perfil.telefono}</Text>}
          {perfil.direccion && <Text style={styles.text}>Dirección: {perfil.direccion}</Text>}
          <Button title="Editar Perfil" onPress={() => setEditing(true)} fullWidth style={{ marginTop: spacing.md }} />
          <Button title="Cerrar Sesión" onPress={handleLogout} variant="danger" fullWidth style={{ marginTop: spacing.sm }} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  header: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, ...shadows.md, alignItems: 'center' },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  section: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, ...shadows.md },
  form: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, ...shadows.md },
  text: { fontSize: fontSize.md, color: colors.text, marginBottom: spacing.sm },
});

export default PerfilAspiranteScreen;
