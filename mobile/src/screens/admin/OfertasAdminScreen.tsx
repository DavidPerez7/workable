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
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllOfertas, deleteOferta, changeEstadoOferta, createOferta, updateOferta } from '../../api/oferta';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import DatePicker from '../../components/DatePicker';
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

  // Create/Edit Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOferta, setEditingOferta] = useState<Oferta | null>(null);
  const [createForm, setCreateForm] = useState({
    titulo: '',
    descripcion: '',
    requisitos: '',
    salario: '',
    tipoContrato: 'TIEMPO_COMPLETO',
    estado: 'ABIERTA',
    nivelExperiencia: 'BASICO',
    numeroVacantes: '1',
    fechaLimite: '',
  });

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

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setEditingOferta(null);
    setCreateForm({
      titulo: '',
      descripcion: '',
      requisitos: '',
      salario: '',
      tipoContrato: 'TIEMPO_COMPLETO',
      estado: 'ABIERTA',
      nivelExperiencia: 'BASICO',
      numeroVacantes: '1',
      fechaLimite: '',
    });
  };

  const openCreateModal = (oferta?: Oferta) => {
    if (oferta) {
      setEditingOferta(oferta);
      setCreateForm({
        titulo: oferta.titulo || '',
        descripcion: oferta.descripcion || '',
        requisitos: oferta.requisitos || '',
        salario: oferta.salario ? oferta.salario.toString() : '',
        tipoContrato: oferta.tipoContrato || 'TIEMPO_COMPLETO',
        estado: oferta.estado || 'ABIERTA',
        nivelExperiencia: oferta.nivelExperiencia || 'BASICO',
        numeroVacantes: oferta.numeroVacantes ? oferta.numeroVacantes.toString() : '1',
        fechaLimite: oferta.fechaLimite || '',
      });
    } else {
      setEditingOferta(null);
      setCreateForm({
        titulo: '',
        descripcion: '',
        requisitos: '',
        salario: '',
        tipoContrato: 'TIEMPO_COMPLETO',
        estado: 'ABIERTA',
        nivelExperiencia: 'BASICO',
        numeroVacantes: '1',
        fechaLimite: '',
      });
    }
    setShowCreateModal(true);
  };

  const handleSaveOferta = async () => {
    if (!createForm.titulo.trim() || !createForm.descripcion.trim() || !createForm.fechaLimite.trim()) {
      Alert.alert('Validación', 'Título, descripción y fecha límite son obligatorios');
      return;
    }

    try {
      if (editingOferta?.id) {
        await updateOferta(editingOferta.id, {
          ...editingOferta,
          ...createForm,
          salario: createForm.salario ? parseFloat(createForm.salario) : 0,
          numeroVacantes: createForm.numeroVacantes ? parseInt(createForm.numeroVacantes) : 1,
        });
        Alert.alert('Éxito', 'Oferta actualizada correctamente');
      } else {
        await createOferta({
          titulo: createForm.titulo,
          descripcion: createForm.descripcion,
          requisitos: createForm.requisitos,
          salario: createForm.salario ? parseFloat(createForm.salario) : 0,
          tipoContrato: createForm.tipoContrato,
          estado: createForm.estado,
          nivelExperiencia: createForm.nivelExperiencia,
          numeroVacantes: createForm.numeroVacantes ? parseInt(createForm.numeroVacantes) : 1,
          fechaLimite: createForm.fechaLimite,
        } as any);
        Alert.alert('Éxito', 'Oferta creada correctamente');
      }
      closeCreateModal();
      loadOfertas();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar oferta');
    }
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
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
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => openCreateModal()}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
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
                  <Text style={styles.dangerTitle}>Acciones</Text>
                  <Button
                    title="Editar Oferta"
                    variant="outline"
                    onPress={() => {
                      openCreateModal(selectedOferta);
                      closeModal();
                    }}
                    fullWidth
                  />
                  <Button
                    title="Eliminar Oferta"
                    variant="danger"
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

      {/* Create/Edit Oferta Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingOferta ? 'Editar Oferta' : 'Crear Nueva Oferta'}
              </Text>
              <TouchableOpacity onPress={closeCreateModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Título de la oferta *"
                placeholderTextColor={colors.textSecondary}
                value={createForm.titulo}
                onChangeText={(text) => setCreateForm({ ...createForm, titulo: text })}
              />

              <TextInput
                style={[styles.input, { minHeight: 100 }]}
                placeholder="Descripción *"
                placeholderTextColor={colors.textSecondary}
                value={createForm.descripcion}
                onChangeText={(text) => setCreateForm({ ...createForm, descripcion: text })}
                multiline
              />

              <TextInput
                style={[styles.input, { minHeight: 80 }]}
                placeholder="Requisitos"
                placeholderTextColor={colors.textSecondary}
                value={createForm.requisitos}
                onChangeText={(text) => setCreateForm({ ...createForm, requisitos: text })}
                multiline
              />

              <TextInput
                style={styles.input}
                placeholder="Salario"
                placeholderTextColor={colors.textSecondary}
                value={createForm.salario}
                onChangeText={(text) => setCreateForm({ ...createForm, salario: text })}
                keyboardType="decimal-pad"
              />

              <Picker
                label="Tipo de Contrato *"
                value={createForm.tipoContrato}
                options={[
                  { label: 'Tiempo Completo', value: 'TIEMPO_COMPLETO' },
                  { label: 'Medio Tiempo', value: 'MEDIO_TIEMPO' },
                  { label: 'Temporal', value: 'TEMPORAL' },
                  { label: 'Prestación de Servicios', value: 'PRESTACION_SERVICIOS' },
                  { label: 'Prácticas', value: 'PRACTICAS' },
                ]}
                onValueChange={(value) => setCreateForm({ ...createForm, tipoContrato: value })}
              />

              <DatePicker
                label="Fecha Límite *"
                value={createForm.fechaLimite}
                onDateChange={(date) => setCreateForm({ ...createForm, fechaLimite: date })}
              />

              <TextInput
                style={styles.input}
                placeholder="Número de Vacantes"
                placeholderTextColor={colors.textSecondary}
                value={createForm.numeroVacantes}
                onChangeText={(text) => setCreateForm({ ...createForm, numeroVacantes: text })}
                keyboardType="number-pad"
              />

              <Picker
                label="Nivel de Experiencia Requerido *"
                value={createForm.nivelExperiencia}
                options={[
                  { label: 'Sin Experiencia', value: 'SIN_EXPERIENCIA' },
                  { label: 'Básico', value: 'BASICO' },
                  { label: 'Intermedio', value: 'INTERMEDIO' },
                  { label: 'Avanzado', value: 'AVANZADO' },
                  { label: 'Experto', value: 'EXPERTO' },
                ]}
                onValueChange={(value) => setCreateForm({ ...createForm, nivelExperiencia: value })}
              />

              <Picker
                label="Estado"
                value={createForm.estado}
                options={[
                  { label: 'Abierta', value: 'ABIERTA' },
                  { label: 'Pausada', value: 'PAUSADA' },
                  { label: 'Cerrada', value: 'CERRADA' },
                ]}
                onValueChange={(value) => setCreateForm({ ...createForm, estado: value })}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title={editingOferta ? 'Actualizar' : 'Crear'}
                variant="primary"
                onPress={handleSaveOferta}
                fullWidth
              />
              <Button
                title="Cancelar"
                variant="outline"
                onPress={closeCreateModal}
                fullWidth
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    marginLeft: spacing.xs,
  },
  filterTextActive: {
    color: colors.white,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
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
