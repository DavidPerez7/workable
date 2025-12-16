import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateReclutadorWithActual } from '../../api/reclutador';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Reclutador } from '../../types';

const PerfilReclutadorScreen = () => {
  const { logout, user } = useAuth();
  const [perfil, setPerfil] = useState<Reclutador | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    cargo: '',
  });

  useEffect(() => {
    loadPerfil();
  }, []);

  const loadPerfil = async () => {
    if (!user?.usuarioId) {
      Alert.alert('Error', 'No se pudo obtener el ID de usuario');
      setLoading(false);
      return;
    }
    try {
      const data = await getMyProfile(user.usuarioId);
      setPerfil(data);
      setFormData({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        telefono: data.telefono || '',
        cargo: data.cargo || '',
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (!perfil) return;
    setFormData({
      nombre: perfil.nombre || '',
      apellido: perfil.apellido || '',
      telefono: perfil.telefono || '',
      cargo: perfil.cargo || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!perfil?.id || !user?.usuarioId) return;

    // Validaciones
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!formData.apellido.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio');
      return;
    }

    try {
      setSaving(true);
      const updatedData: Partial<Reclutador> = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim() || null,
        cargo: formData.cargo.trim() || null,
      };

      await updateReclutadorWithActual(perfil.id, updatedData, user.usuarioId);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      closeModal();
      loadPerfil();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar perfil');
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
    <>
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle" size={80} color={colors.primary} />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={openModal}>
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>
            {perfil.nombre} {perfil.apellido}
          </Text>
          <Text style={styles.subtitle}>{perfil.correo}</Text>
          {perfil.cargo && <Text style={styles.cargo}>{perfil.cargo}</Text>}
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo</Text>
              <Text style={styles.infoText}>{perfil.correo}</Text>
            </View>
          </View>

          {perfil.telefono && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoText}>{perfil.telefono}</Text>
              </View>
            </View>
          )}

          {perfil.cargo && (
            <View style={styles.infoRow}>
              <Ionicons name="briefcase-outline" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Cargo</Text>
                <Text style={styles.infoText}>{perfil.cargo}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Información de Empresa */}
        {perfil.empresa && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Empresa</Text>

            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoText}>{perfil.empresa.nombre}</Text>
              </View>
            </View>

            {perfil.empresa.nit && (
              <View style={styles.infoRow}>
                <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>NIT</Text>
                  <Text style={styles.infoText}>{perfil.empresa.nit}</Text>
                </View>
              </View>
            )}

            {perfil.empresa.sector && (
              <View style={styles.infoRow}>
                <Ionicons name="albums-outline" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Sector</Text>
                  <Text style={styles.infoText}>{perfil.empresa.sector}</Text>
                </View>
              </View>
            )}

            {perfil.empresa.descripcion && (
              <View style={styles.infoRow}>
                <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Descripción</Text>
                  <Text style={styles.infoText}>{perfil.empresa.descripcion}</Text>
                </View>
              </View>
            )}

            {perfil.empresa.sitioWeb && (
              <View style={styles.infoRow}>
                <Ionicons name="globe-outline" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Sitio Web</Text>
                  <Text style={[styles.infoText, { color: colors.primary }]}>
                    {perfil.empresa.sitioWeb}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Acciones */}
        <View style={styles.section}>
          <Button
            title="Editar Perfil"
            onPress={openModal}
            icon={<Ionicons name="create-outline" size={20} color={colors.white} />}
            fullWidth
            style={{ marginBottom: spacing.md }}
          />
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            icon={<Ionicons name="log-out-outline" size={20} color={colors.white} />}
            fullWidth
          />
        </View>
      </ScrollView>

      {/* Modal de Edición */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Nombre *"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                autoCapitalize="words"
              />

              <Input
                label="Apellido *"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                autoCapitalize="words"
              />

              <Input
                label="Teléfono"
                placeholder="Ingresa tu teléfono"
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                keyboardType="phone-pad"
              />

              <Input
                label="Cargo"
                placeholder="Ej: Gerente de Recursos Humanos"
                value={formData.cargo}
                onChangeText={(text) => setFormData({ ...formData, cargo: text })}
                autoCapitalize="words"
              />

              <View style={styles.helpText}>
                <Ionicons name="information-circle-outline" size={16} color={colors.info} />
                <Text style={styles.helpTextContent}>
                  No puedes cambiar tu correo electrónico ni empresa.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={closeModal}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <Button
                title="Guardar Cambios"
                onPress={handleSave}
                loading={saving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.md,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    marginBottom: spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.sm,
    ...shadows.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  cargo: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    ...shadows.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  helpText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e0f2fe',
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  helpTextContent: {
    fontSize: fontSize.sm,
    color: colors.info,
    marginLeft: spacing.sm,
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
});

export default PerfilReclutadorScreen;
