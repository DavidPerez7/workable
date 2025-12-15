import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getAllPostulaciones,
  updatePostulacion,
  deletePostulacion,
} from '../../api/postulacion';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Postulacion } from '../../types';

const PostulacionesAdminScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [filteredPostulaciones, setFilteredPostulaciones] = useState<Postulacion[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    estado: 'POSTULADO',
    comentarios: '',
  });

  const loadPostulaciones = async () => {
    try {
      const data = await getAllPostulaciones();
      setPostulaciones(data || []);
      setFilteredPostulaciones(data || []);
    } catch (error: any) {
      console.error('Error cargando postulaciones:', error);
      Alert.alert('Error', error.message || 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPostulaciones();
    }, [])
  );

  React.useEffect(() => {
    if (filtroEstado === 'TODOS') {
      setFilteredPostulaciones(postulaciones);
    } else {
      setFilteredPostulaciones(postulaciones.filter((p) => p.estado === filtroEstado));
    }
  }, [filtroEstado, postulaciones]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPostulaciones();
  };

  const openPostulacionModal = (postulacion: Postulacion) => {
    setSelectedPostulacion(postulacion);
    setFormData({
      estado: postulacion.estado || 'POSTULADO',
      comentarios: postulacion.comentarios || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPostulacion(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedPostulacion?.id) return;

    try {
      setSaving(true);
      await updatePostulacion(selectedPostulacion.id, formData);
      Alert.alert('Éxito', 'Postulación actualizada correctamente');
      closeModal();
      loadPostulaciones();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar postulación');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePostulacion = (postulacion: Postulacion) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar esta postulación?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!postulacion.id) return;
              await deletePostulacion(postulacion.id);
              Alert.alert('Éxito', 'Postulación eliminada correctamente');
              closeModal();
              loadPostulaciones();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar postulación');
            }
          },
        },
      ]
    );
  };

  const getEstadoBadgeStyle = (estado?: string) => {
    switch (estado) {
      case 'ACEPTADO':
        return { backgroundColor: colors.success };
      case 'RECHAZADO':
        return { backgroundColor: colors.danger };
      case 'EN_REVISION':
        return { backgroundColor: colors.warning };
      case 'ENTREVISTA':
        return { backgroundColor: colors.info };
      default:
        return { backgroundColor: colors.textSecondary };
    }
  };

  const getEstadoLabel = (estado?: string) => {
    switch (estado) {
      case 'POSTULADO':
        return 'Postulado';
      case 'EN_REVISION':
        return 'En Revisión';
      case 'ENTREVISTA':
        return 'Entrevista';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'ACEPTADO':
        return 'Aceptado';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) return <Loading />;

  return (
    <View style={globalStyles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{postulaciones.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {postulaciones.filter((p) => p.estado === 'POSTULADO').length}
            </Text>
            <Text style={styles.statLabel}>Postulados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {postulaciones.filter((p) => p.estado === 'ACEPTADO').length}
            </Text>
            <Text style={styles.statLabel}>Aceptados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {postulaciones.filter((p) => p.estado === 'RECHAZADO').length}
            </Text>
            <Text style={styles.statLabel}>Rechazados</Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['TODOS', 'POSTULADO', 'EN_REVISION', 'ENTREVISTA', 'ACEPTADO', 'RECHAZADO'].map(
            (estado) => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.filterButton,
                  filtroEstado === estado && styles.filterButtonActive,
                ]}
                onPress={() => setFiltroEstado(estado)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filtroEstado === estado && styles.filterTextActive,
                  ]}
                >
                  {estado === 'TODOS' ? 'Todos' : getEstadoLabel(estado)}
                </Text>
                {estado !== 'TODOS' && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {postulaciones.filter((p) => p.estado === estado).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      {/* Postulaciones List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredPostulaciones.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {filtroEstado === 'TODOS'
                ? 'No hay postulaciones registradas'
                : `No hay postulaciones en estado "${getEstadoLabel(filtroEstado)}"`}
            </Text>
          </View>
        ) : (
          filteredPostulaciones.map((postulacion) => (
            <TouchableOpacity
              key={postulacion.id}
              style={styles.postulacionCard}
              onPress={() => openPostulacionModal(postulacion)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.aspiranteInfo}>
                  <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
                  <View style={styles.textInfo}>
                    <Text style={styles.aspiranteNombre}>
                      {postulacion.aspirante?.nombre} {postulacion.aspirante?.apellido}
                    </Text>
                    <Text style={styles.ofertaTitulo} numberOfLines={1}>
                      {postulacion.oferta?.titulo}
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.estadoBadge, getEstadoBadgeStyle(postulacion.estado)]}
                >
                  <Text style={styles.estadoBadgeText}>{getEstadoLabel(postulacion.estado)}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {postulacion.oferta?.empresa && (
                  <View style={styles.infoRow}>
                    <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{postulacion.oferta.empresa.nombre}</Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {formatDate(postulacion.fechaPostulacion)}
                  </Text>
                </View>

                {postulacion.comentarios && (
                  <View style={styles.comentariosPreview}>
                    <Ionicons name="chatbox-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.comentariosText} numberOfLines={2}>
                      {postulacion.comentarios}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Postulacion Detail Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de Postulación</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedPostulacion && (
              <ScrollView style={styles.modalBody}>
                {/* Aspirante Info */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Aspirante</Text>
                  <View style={styles.modalInfoCard}>
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Nombre</Text>
                        <Text style={styles.modalInfoText}>
                          {selectedPostulacion.aspirante?.nombre}{' '}
                          {selectedPostulacion.aspirante?.apellido}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Correo</Text>
                        <Text style={styles.modalInfoText}>
                          {selectedPostulacion.aspirante?.correo}
                        </Text>
                      </View>
                    </View>

                    {selectedPostulacion.aspirante?.telefono && (
                      <View style={styles.modalInfoRow}>
                        <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                        <View style={styles.modalInfoContent}>
                          <Text style={styles.modalInfoLabel}>Teléfono</Text>
                          <Text style={styles.modalInfoText}>
                            {selectedPostulacion.aspirante.telefono}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                {/* Oferta Info */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Oferta</Text>
                  <View style={styles.modalInfoCard}>
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="briefcase-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Título</Text>
                        <Text style={styles.modalInfoText}>
                          {selectedPostulacion.oferta?.titulo}
                        </Text>
                      </View>
                    </View>

                    {selectedPostulacion.oferta?.empresa && (
                      <View style={styles.modalInfoRow}>
                        <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
                        <View style={styles.modalInfoContent}>
                          <Text style={styles.modalInfoLabel}>Empresa</Text>
                          <Text style={styles.modalInfoText}>
                            {selectedPostulacion.oferta.empresa.nombre}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                {/* Postulacion Info */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Estado de la Postulación</Text>

                  <Picker
                    label="Estado"
                    value={formData.estado}
                    options={[
                      { label: 'Postulado', value: 'POSTULADO' },
                      { label: 'En Revisión', value: 'EN_REVISION' },
                      { label: 'Entrevista', value: 'ENTREVISTA' },
                      { label: 'Aceptado', value: 'ACEPTADO' },
                      { label: 'Rechazado', value: 'RECHAZADO' },
                    ]}
                    onValueChange={(value) => setFormData({ ...formData, estado: value })}
                  />

                  <Input
                    label="Comentarios / Feedback"
                    placeholder="Agrega comentarios..."
                    multiline
                    numberOfLines={5}
                    value={formData.comentarios}
                    onChangeText={(text) => setFormData({ ...formData, comentarios: text })}
                  />

                  <View style={styles.infoBlock}>
                    <Text style={styles.infoBlockLabel}>Fecha de Postulación</Text>
                    <Text style={styles.infoBlockText}>
                      {formatDate(selectedPostulacion.fechaPostulacion)}
                    </Text>
                  </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.dangerZone}>
                  <Text style={styles.dangerTitle}>Zona de Peligro</Text>
                  <Button
                    title="Eliminar Postulación"
                    variant="danger"
                    icon={<Ionicons name="trash-outline" size={20} color={colors.white} />}
                    onPress={() => handleDeletePostulacion(selectedPostulacion)}
                    fullWidth
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={closeModal}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <Button
                title="Guardar Cambios"
                onPress={handleSaveChanges}
                loading={saving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  filterBadge: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },
  filterBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  listContainer: {
    flex: 1,
    padding: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  postulacionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  aspiranteInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  textInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  aspiranteNombre: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  ofertaTitulo: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  estadoBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  estadoBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  cardBody: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  comentariosPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
  },
  comentariosText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
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
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalInfoCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalInfoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  modalInfoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  modalInfoText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  infoBlock: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  infoBlockLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  infoBlockText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  dangerZone: {
    backgroundColor: '#fef2f2',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  dangerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
});

export default PostulacionesAdminScreen;
