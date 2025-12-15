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
import { getAllOfertas, deleteOferta, changeEstadoOferta } from '../../api/oferta';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Oferta } from '../../types';

const OfertasAdminScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<Oferta[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
  const [changingEstado, setChangingEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<string>('ABIERTA');

  const loadOfertas = async () => {
    try {
      const data = await getAllOfertas();
      setOfertas(data || []);
      setFilteredOfertas(data || []);
    } catch (error: any) {
      console.error('Error cargando ofertas:', error);
      Alert.alert('Error', error.message || 'Error al cargar ofertas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOfertas();
    }, [])
  );

  React.useEffect(() => {
    if (filtroEstado === 'TODOS') {
      setFilteredOfertas(ofertas);
    } else {
      setFilteredOfertas(ofertas.filter((o) => o.estado === filtroEstado));
    }
  }, [filtroEstado, ofertas]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOfertas();
  };

  const openOfertaModal = (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setNuevoEstado(oferta.estado || 'ABIERTA');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOferta(null);
  };

  const handleChangeEstado = async () => {
    if (!selectedOferta?.id) return;

    try {
      setChangingEstado(true);
      await changeEstadoOferta(selectedOferta.id, nuevoEstado);
      Alert.alert('Éxito', 'Estado de oferta actualizado correctamente');
      closeModal();
      loadOfertas();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cambiar estado');
    } finally {
      setChangingEstado(false);
    }
  };

  const handleDeleteOferta = (oferta: Oferta) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar la oferta "${oferta.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!oferta.id) return;
              await deleteOferta(oferta.id);
              Alert.alert('Éxito', 'Oferta eliminada correctamente');
              closeModal();
              loadOfertas();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar oferta');
            }
          },
        },
      ]
    );
  };

  const getEstadoBadgeStyle = (estado?: string) => {
    switch (estado) {
      case 'ABIERTA':
        return { backgroundColor: colors.success };
      case 'CERRADA':
        return { backgroundColor: colors.danger };
      case 'PAUSADA':
        return { backgroundColor: colors.warning };
      default:
        return { backgroundColor: colors.textSecondary };
    }
  };

  const getEstadoLabel = (estado?: string) => {
    switch (estado) {
      case 'ABIERTA':
        return 'Abierta';
      case 'CERRADA':
        return 'Cerrada';
      case 'PAUSADA':
        return 'Pausada';
      default:
        return estado || 'Desconocido';
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

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'No especificado';
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    });
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return formatter.format(min || max || 0);
  };

  if (loading) return <Loading />;

  return (
    <View style={globalStyles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{ofertas.length}</Text>
            <Text style={styles.statLabel}>Total Ofertas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {ofertas.filter((o) => o.estado === 'ABIERTA').length}
            </Text>
            <Text style={styles.statLabel}>Abiertas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {ofertas.filter((o) => o.estado === 'CERRADA').length}
            </Text>
            <Text style={styles.statLabel}>Cerradas</Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['TODOS', 'ABIERTA', 'PAUSADA', 'CERRADA'].map((estado) => (
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
                    {ofertas.filter((o) => o.estado === estado).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ofertas List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredOfertas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              {filtroEstado === 'TODOS'
                ? 'No hay ofertas registradas'
                : `No hay ofertas en estado "${getEstadoLabel(filtroEstado)}"`}
            </Text>
          </View>
        ) : (
          filteredOfertas.map((oferta) => (
            <TouchableOpacity
              key={oferta.id}
              style={styles.ofertaCard}
              onPress={() => openOfertaModal(oferta)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.ofertaTitulo} numberOfLines={2}>
                  {oferta.titulo}
                </Text>
                <View style={[styles.estadoBadge, getEstadoBadgeStyle(oferta.estado)]}>
                  <Text style={styles.estadoBadgeText}>{getEstadoLabel(oferta.estado)}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                {oferta.empresa && (
                  <View style={styles.infoRow}>
                    <Ionicons name="business-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{oferta.empresa.nombre}</Text>
                  </View>
                )}

                {oferta.reclutador && (
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>
                      {oferta.reclutador.nombre} {oferta.reclutador.apellido}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {oferta.municipio?.nombre || 'Sin ubicación'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    {formatSalary(oferta.salarioMin, oferta.salarioMax)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>
                    Publicada: {formatDate(oferta.fechaPublicacion)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Oferta Detail Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de Oferta</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedOferta && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalOfertaHeader}>
                  <Text style={styles.modalOfertaTitulo}>{selectedOferta.titulo}</Text>
                  <View style={[styles.estadoBadge, getEstadoBadgeStyle(selectedOferta.estado)]}>
                    <Text style={styles.estadoBadgeText}>
                      {getEstadoLabel(selectedOferta.estado)}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Información General</Text>

                  {selectedOferta.descripcion && (
                    <View style={styles.modalInfoBlock}>
                      <Text style={styles.modalInfoLabel}>Descripción</Text>
                      <Text style={styles.modalInfoText}>{selectedOferta.descripcion}</Text>
                    </View>
                  )}

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Empresa</Text>
                      <Text style={styles.modalInfoText}>
                        {selectedOferta.empresa?.nombre || '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Reclutador</Text>
                      <Text style={styles.modalInfoText}>
                        {selectedOferta.reclutador
                          ? `${selectedOferta.reclutador.nombre} ${selectedOferta.reclutador.apellido}`
                          : '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Ubicación</Text>
                      <Text style={styles.modalInfoText}>
                        {selectedOferta.municipio?.nombre || '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="cash-outline" size={20} color={colors.textSecondary} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Salario</Text>
                      <Text style={styles.modalInfoText}>
                        {formatSalary(selectedOferta.salarioMin, selectedOferta.salarioMax)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Fecha de Publicación</Text>
                      <Text style={styles.modalInfoText}>
                        {formatDate(selectedOferta.fechaPublicacion)}
                      </Text>
                    </View>
                  </View>

                  {selectedOferta.fechaCierre && (
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Fecha de Cierre</Text>
                        <Text style={styles.modalInfoText}>
                          {formatDate(selectedOferta.fechaCierre)}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Cambiar Estado</Text>
                  <Picker
                    label="Estado de la Oferta"
                    value={nuevoEstado}
                    options={[
                      { label: 'Abierta', value: 'ABIERTA' },
                      { label: 'Pausada', value: 'PAUSADA' },
                      { label: 'Cerrada', value: 'CERRADA' },
                    ]}
                    onValueChange={setNuevoEstado}
                  />
                  <Button
                    title="Actualizar Estado"
                    onPress={handleChangeEstado}
                    loading={changingEstado}
                    disabled={nuevoEstado === selectedOferta.estado}
                    fullWidth
                    style={{ marginTop: spacing.md }}
                  />
                </View>

                <View style={styles.dangerZone}>
                  <Text style={styles.dangerTitle}>Zona de Peligro</Text>
                  <Button
                    title="Eliminar Oferta"
                    variant="danger"
                    icon={<Ionicons name="trash-outline" size={20} color={colors.white} />}
                    onPress={() => handleDeleteOferta(selectedOferta)}
                    fullWidth
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Button title="Cerrar" variant="outline" onPress={closeModal} fullWidth />
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
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: fontSize.xxl,
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
  filterText: {
    fontSize: fontSize.sm,
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
  ofertaCard: {
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
  ofertaTitulo: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginRight: spacing.sm,
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
  modalOfertaHeader: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  modalOfertaTitulo: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
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
  modalInfoBlock: {
    marginBottom: spacing.md,
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
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default OfertasAdminScreen;
