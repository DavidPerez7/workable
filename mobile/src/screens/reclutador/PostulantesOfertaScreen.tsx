import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  getPostulacionesByOferta,
  updatePostulacion,
} from '../../api/postulacion';
import { getOfertaById } from '../../api/oferta';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Postulacion, Oferta, MisOfertasStackParamList } from '../../types';

type RouteParams = RouteProp<MisOfertasStackParamList, 'PostulantesOferta'>;

const PostulantesOfertaScreen = () => {
  const route = useRoute<RouteParams>();
  const { ofertaId } = route.params;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [filteredPostulaciones, setFilteredPostulaciones] = useState<Postulacion[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [formData, setFormData] = useState<{
    estado: string;
    comentarios: string;
  }>({
    estado: 'POSTULADO',
    comentarios: '',
  });

  const loadData = async () => {
    if (!user?.usuarioId) return;
    if (typeof ofertaId === 'undefined' || ofertaId === null) {
      Alert.alert('Error', 'ID de la oferta inválido');
      setLoading(false);
      setPostulaciones([]);
      setFilteredPostulaciones([]);
      return;
    }
    try {
      const [ofertaData, postulacionesData] = await Promise.all([
        getOfertaById(ofertaId),
        getPostulacionesByOferta(ofertaId),
      ]);
      setOferta(ofertaData);
      const postulacionesList = Array.isArray(postulacionesData) ? postulacionesData : [];
      setPostulaciones(postulacionesList);
      setFilteredPostulaciones(postulacionesList);
    } catch (error: any) {
      console.error('Error cargando postulaciones:', error);
      Alert.alert('Error', error.message || 'Error al cargar postulaciones');
      setPostulaciones([]);
      setFilteredPostulaciones([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [ofertaId, user?.usuarioId])
  );

  useEffect(() => {
    // Filtrar postulaciones según filtro de estado
    if (filtroEstado === 'TODOS') {
      setFilteredPostulaciones(postulaciones);
    } else {
      setFilteredPostulaciones(
        postulaciones.filter((p) => p.estado === filtroEstado)
      );
    }
  }, [filtroEstado, postulaciones]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openModal = (postulacion: Postulacion) => {
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

  const handleSave = async () => {
    if (!selectedPostulacion?.id) return;

    try {
      setModalSaving(true);
      await updatePostulacion(selectedPostulacion.id, formData);
      Alert.alert('Éxito', 'Postulación actualizada correctamente');
      closeModal();
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al actualizar postulación');
    } finally {
      setModalSaving(false);
    }
  };

  const getEstadoBadgeStyle = (estado?: string) => {
    switch (estado) {
      case 'ACEPTADO':
        return { backgroundColor: colors.success, color: colors.white };
      case 'RECHAZADO':
        return { backgroundColor: colors.danger, color: colors.white };
      case 'EN_REVISION':
        return { backgroundColor: colors.warning, color: colors.white };
      case 'ENTREVISTA':
        return { backgroundColor: colors.info, color: colors.white };
      default:
        return { backgroundColor: colors.textSecondary, color: colors.white };
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

  if (typeof ofertaId === 'undefined' || ofertaId === null) {
    return (
      <View style={[globalStyles.container, { padding: spacing.md }]}>
        <Text style={{ color: colors.text, fontSize: fontSize.md }}>ID de oferta inválido.</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Postulantes</Text>
        {oferta && (
          <View style={styles.ofertaInfo}>
            <Text style={styles.ofertaTitulo}>{oferta.titulo}</Text>
            <Text style={styles.ofertaSubtitle}>
              {postulaciones.length} postulación{postulaciones.length !== 1 ? 'es' : ''}
            </Text>
          </View>
        )}
      </View>

      {/* Filtros */}
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
                    styles.filterButtonText,
                    filtroEstado === estado && styles.filterButtonTextActive,
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

      {/* Lista de Postulaciones */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredPostulaciones.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {filtroEstado === 'TODOS'
                ? 'No hay postulaciones aún'
                : `No hay postulaciones en estado "${getEstadoLabel(filtroEstado)}"`}
            </Text>
          </View>
        ) : (
          filteredPostulaciones.map((postulacion) => (
            <TouchableOpacity
              key={postulacion.id}
              style={styles.postulacionCard}
              onPress={() => openModal(postulacion)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.aspiranteInfo}>
                  <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
                  <View style={styles.aspiranteText}>
                    <Text style={styles.aspiranteNombre}>
                      {postulacion.aspirante?.nombre} {postulacion.aspirante?.apellido}
                    </Text>
                    <Text style={styles.aspiranteEmail}>{postulacion.aspirante?.correo}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.estadoBadge,
                    { backgroundColor: getEstadoBadgeStyle(postulacion.estado).backgroundColor },
                  ]}
                >
                  <Text style={styles.estadoBadgeText}>{getEstadoLabel(postulacion.estado)}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    Postulado: {formatDate(postulacion.fechaPostulacion)}
                  </Text>
                </View>

                {postulacion.aspirante?.telefono && (
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{postulacion.aspirante.telefono}</Text>
                  </View>
                )}

                {postulacion.comentarios && (
                  <View style={styles.comentariosPreview}>
                    <Ionicons name="chatbox-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.comentariosText} numberOfLines={2}>
                      {postulacion.comentarios}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openModal(postulacion)}
                >
                  <Ionicons name="create-outline" size={18} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Gestionar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Modal de Gestión */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gestionar Postulación</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedPostulacion && (
                <>
                  <View style={styles.modalAspiranteInfo}>
                    <Ionicons name="person-circle" size={48} color={colors.primary} />
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={styles.modalAspiranteNombre}>
                        {selectedPostulacion.aspirante?.nombre}{' '}
                        {selectedPostulacion.aspirante?.apellido}
                      </Text>
                      <Text style={styles.modalAspiranteEmail}>
                        {selectedPostulacion.aspirante?.correo}
                      </Text>
                      <Text style={styles.modalAspiranteFecha}>
                        Postulado: {formatDate(selectedPostulacion.fechaPostulacion)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Picker
                    label="Estado de la Postulación"
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
                    placeholder="Agrega comentarios para el aspirante..."
                    multiline
                    numberOfLines={5}
                    value={formData.comentarios}
                    onChangeText={(text) => setFormData({ ...formData, comentarios: text })}
                  />

                  <View style={styles.helpText}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.info} />
                    <Text style={styles.helpTextContent}>
                      Los comentarios son visibles para el aspirante en el detalle de su postulación.
                    </Text>
                  </View>
                </>
              )}
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
                loading={modalSaving}
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
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  ofertaInfo: {
    marginTop: spacing.sm,
  },
  ofertaTitulo: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.white,
    marginTop: spacing.xs,
  },
  ofertaSubtitle: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
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
    paddingHorizontal: spacing.md,
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
  filterButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
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
  aspiranteText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  aspiranteNombre: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  aspiranteEmail: {
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
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
    marginTop: spacing.xs,
  },
  comentariosText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginLeft: spacing.xs,
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
  modalAspiranteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  modalAspiranteNombre: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  modalAspiranteEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalAspiranteFecha: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
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

export default PostulantesOfertaScreen;
