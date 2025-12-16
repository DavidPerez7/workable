import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  getHojaVidaByAspirante,
  updateHojaVida,
  addEstudio,
  updateEstudioByIndex,
  deleteEstudioByIndex,
  addExperiencia,
  updateExperienciaByIndex,
  deleteExperienciaByIndex,
} from '../../api/hojaVida';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import DatePicker from '../../components/DatePicker';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { HojaVida, EstudioData, ExperienciaData } from '../../types';

const HojaDeVidaScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'estudios' | 'experiencias'>('estudios');

  const [hojaVida, setHojaVida] = useState<HojaVida | null>(null);
  const [expandedEstudios, setExpandedEstudios] = useState<Record<number, boolean>>({});
  const [expandedExperiencias, setExpandedExperiencias] = useState<Record<number, boolean>>({});

  // ===== MODALES DE ESTUDIOS =====
  const [showEstudioModal, setShowEstudioModal] = useState(false);
  const [editingEstudioIndex, setEditingEstudioIndex] = useState<number | null>(null);
  const [estudioSaving, setEstudioSaving] = useState(false);
  const [estudioFormData, setEstudioFormData] = useState<Partial<EstudioData>>({
    institucion: '',
    titulo: '',
    nivelEducativo: 'UNIVERSITARIO',
    fechaInicio: new Date().toISOString().split('T')[0],
    enCurso: false,
    fechaFin: '',
    descripcion: '',
  });

  // ===== MODALES DE EXPERIENCIAS =====
  const [showExperienciaModal, setShowExperienciaModal] = useState(false);
  const [editingExperienciaIndex, setEditingExperienciaIndex] = useState<number | null>(null);
  const [experienciaSaving, setExperienciaSaving] = useState(false);
  const [experienciaFormData, setExperienciaFormData] = useState<Partial<ExperienciaData>>({
    cargo: '',
    empresa: '',
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
  });

  // ===== CARGAR DATOS =====
  const loadData = async () => {
    if (!user?.usuarioId) return;
    try {
      const hv = await getHojaVidaByAspirante(user.usuarioId);
      setHojaVida(hv);
    } catch (error: any) {
      console.error('Error cargando hoja de vida:', error);
      Alert.alert('Error', error.message || 'Error al cargar hoja de vida');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user?.usuarioId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO');
  };

  // ===== HANDLERS DE ESTUDIOS =====
  const openEstudioModal = (index?: number) => {
    if (index !== undefined && hojaVida?.estudios?.[index]) {
      const estudio = hojaVida.estudios[index];
      setEditingEstudioIndex(index);
      setEstudioFormData({
        institucion: estudio.institucion,
        titulo: estudio.titulo,
        nivelEducativo: estudio.nivelEducativo,
        fechaInicio: estudio.fechaInicio,
        enCurso: estudio.enCurso,
        fechaFin: estudio.fechaFin,
        descripcion: estudio.descripcion,
      });
    } else {
      setEditingEstudioIndex(null);
      setEstudioFormData({
        institucion: '',
        titulo: '',
        nivelEducativo: 'UNIVERSITARIO',
        fechaInicio: new Date().toISOString().split('T')[0],
        enCurso: false,
        fechaFin: '',
        descripcion: '',
      });
    }
    setShowEstudioModal(true);
  };

  const saveEstudio = async () => {
    if (!hojaVida?.id) return;
    try {
      if (!estudioFormData.institucion?.trim() || !estudioFormData.titulo?.trim()) {
        Alert.alert('Validación', 'Completa institución y título');
        return;
      }

      setEstudioSaving(true);
      const data = estudioFormData as EstudioData;

      if (editingEstudioIndex !== null) {
        await updateEstudioByIndex(hojaVida.id, editingEstudioIndex, data);
        Alert.alert('Éxito', 'Estudio actualizado');
      } else {
        await addEstudio(hojaVida.id, data);
        Alert.alert('Éxito', 'Estudio creado');
      }

      setShowEstudioModal(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar estudio');
    } finally {
      setEstudioSaving(false);
    }
  };

  const deleteEstudioHandler = (index: number) => {
    if (!hojaVida?.id) return;
    Alert.alert('Eliminar', '¿Eliminar este estudio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEstudioByIndex(hojaVida.id!, index);
            Alert.alert('Éxito', 'Estudio eliminado');
            loadData();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al eliminar');
          }
        },
      },
    ]);
  };

  // ===== HANDLERS DE EXPERIENCIAS =====
  const openExperienciaModal = (index?: number) => {
    if (index !== undefined && hojaVida?.experiencias?.[index]) {
      const experiencia = hojaVida.experiencias[index];
      setEditingExperienciaIndex(index);
      setExperienciaFormData({
        cargo: experiencia.cargo,
        empresa: experiencia.empresa,
        descripcion: experiencia.descripcion,
        fechaInicio: experiencia.fechaInicio,
        fechaFin: experiencia.fechaFin,
      });
    } else {
      setEditingExperienciaIndex(null);
      setExperienciaFormData({
        cargo: '',
        empresa: '',
        descripcion: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
      });
    }
    setShowExperienciaModal(true);
  };

  const saveExperiencia = async () => {
    if (!hojaVida?.id) return;
    try {
      if (!experienciaFormData.cargo?.trim() || !experienciaFormData.empresa?.trim()) {
        Alert.alert('Validación', 'Completa cargo y empresa');
        return;
      }

      setExperienciaSaving(true);
      const data = experienciaFormData as ExperienciaData;

      if (editingExperienciaIndex !== null) {
        await updateExperienciaByIndex(hojaVida.id, editingExperienciaIndex, data);
        Alert.alert('Éxito', 'Experiencia actualizada');
      } else {
        await addExperiencia(hojaVida.id, data);
        Alert.alert('Éxito', 'Experiencia creada');
      }

      setShowExperienciaModal(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar experiencia');
    } finally {
      setExperienciaSaving(false);
    }
  };

  const deleteExperienciaHandler = (index: number) => {
    if (!hojaVida?.id) return;
    Alert.alert('Eliminar', '¿Eliminar esta experiencia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExperienciaByIndex(hojaVida.id!, index);
            Alert.alert('Éxito', 'Experiencia eliminada');
            loadData();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al eliminar');
          }
        },
      },
    ]);
  };

  // ===== COMPONENT HELPERS =====
  const DetailRow = ({ label, value, badge }: { label: string; value: string; badge?: boolean }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.detailValue}>{value}</Text>
      )}
    </View>
  );

  // ===== RENDERS =====
  if (loading) return <Loading />;

  const estudios = hojaVida?.estudios || [];
  const experiencias = hojaVida?.experiencias || [];

  const renderEstudios = () => (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {estudios.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="school-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tienes estudios registrados</Text>
          <Button
            title="+ Agregar Estudio"
            onPress={() => openEstudioModal()}
            fullWidth
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <View style={styles.itemsContainer}>
          {estudios.map((estudio, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemCard}
              onPress={() => setExpandedEstudios({ ...expandedEstudios, [index]: !expandedEstudios[index] })}
            >
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{estudio.titulo}</Text>
                  <Text style={styles.itemSubtitle}>{estudio.institucion}</Text>
                </View>
                <Ionicons
                  name={expandedEstudios[index] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.primary}
                />
              </View>

              {expandedEstudios[index] && (
                <View style={styles.itemDetails}>
                  <DetailRow label="Nivel" value={estudio.nivelEducativo || 'N/A'} />
                  <DetailRow label="Inicio" value={formatDate(estudio.fechaInicio)} />
                  {estudio.enCurso ? (
                    <DetailRow label="Estado" value="En curso" badge />
                  ) : (
                    <DetailRow label="Fin" value={formatDate(estudio.fechaFin)} />
                  )}
                  {estudio.descripcion && <DetailRow label="Descripción" value={estudio.descripcion} />}
                  <View style={styles.actionButtons}>
                    <Button
                      title="Editar"
                      variant="outline"
                      onPress={() => openEstudioModal(index)}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                    <Button
                      title="Eliminar"
                      variant="danger"
                      onPress={() => deleteEstudioHandler(index)}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <Button
            title="+ Agregar Estudio"
            onPress={() => openEstudioModal()}
            fullWidth
            style={{ marginTop: spacing.md }}
          />
        </View>
      )}
    </ScrollView>
  );

  const renderExperiencias = () => (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {experiencias.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tienes experiencias registradas</Text>
          <Button
            title="+ Agregar Experiencia"
            onPress={() => openExperienciaModal()}
            fullWidth
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <View style={styles.itemsContainer}>
          {experiencias.map((experiencia, index) => (
            <TouchableOpacity
              key={index}
              style={styles.itemCard}
              onPress={() => setExpandedExperiencias({ ...expandedExperiencias, [index]: !expandedExperiencias[index] })}
            >
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{experiencia.cargo}</Text>
                  <Text style={styles.itemSubtitle}>{experiencia.empresa}</Text>
                </View>
                <Ionicons
                  name={expandedExperiencias[index] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.primary}
                />
              </View>

              {expandedExperiencias[index] && (
                <View style={styles.itemDetails}>
                  <DetailRow label="Inicio" value={formatDate(experiencia.fechaInicio)} />
                  <DetailRow label="Fin" value={formatDate(experiencia.fechaFin)} />
                  {experiencia.descripcion && <DetailRow label="Descripción" value={experiencia.descripcion} />}
                  <View style={styles.actionButtons}>
                    <Button
                      title="Editar"
                      variant="outline"
                      onPress={() => openExperienciaModal(index)}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                    <Button
                      title="Eliminar"
                      variant="danger"
                      onPress={() => deleteExperienciaHandler(index)}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <Button
            title="+ Agregar Experiencia"
            onPress={() => openExperienciaModal()}
            fullWidth
            style={{ marginTop: spacing.md }}
          />
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Hoja de Vida</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'estudios' && styles.activeTab]}
          onPress={() => setActiveTab('estudios')}
        >
          <Ionicons name="school" size={20} color={activeTab === 'estudios' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'estudios' && styles.activeTabText]}>
            Estudios ({estudios.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'experiencias' && styles.activeTab]}
          onPress={() => setActiveTab('experiencias')}
        >
          <Ionicons
            name="briefcase"
            size={20}
            color={activeTab === 'experiencias' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'experiencias' && styles.activeTabText]}>
            Experiencias ({experiencias.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
        {activeTab === 'estudios' && renderEstudios()}
        {activeTab === 'experiencias' && renderExperiencias()}
      </View>

      {/* Modal Estudio */}
      <Modal visible={showEstudioModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEstudioIndex !== null ? 'Editar Estudio' : 'Nuevo Estudio'}
              </Text>
              <TouchableOpacity onPress={() => setShowEstudioModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Input
                label="Institución *"
                value={estudioFormData.institucion}
                onChangeText={(text) => setEstudioFormData({ ...estudioFormData, institucion: text })}
                placeholder="Universidad, instituto..."
              />
              <Input
                label="Título *"
                value={estudioFormData.titulo}
                onChangeText={(text) => setEstudioFormData({ ...estudioFormData, titulo: text })}
                placeholder="Nombre del título o carrera"
              />
              <Picker
                label="Nivel Educativo"
                selectedValue={estudioFormData.nivelEducativo}
                onValueChange={(value) => setEstudioFormData({ ...estudioFormData, nivelEducativo: value as any })}
                items={[
                  { label: 'Primaria', value: 'PRIMARIA' },
                  { label: 'Bachillerato', value: 'BACHILLERATO' },
                  { label: 'Técnico', value: 'TECNICO' },
                  { label: 'Tecnólogo', value: 'TECNOLOGO' },
                  { label: 'Universitario', value: 'UNIVERSITARIO' },
                  { label: 'Especialización', value: 'ESPECIALIZACION' },
                  { label: 'Maestría', value: 'MAESTRIA' },
                  { label: 'Doctorado', value: 'DOCTORADO' },
                ]}
              />
              <DatePicker
                label="Fecha de Inicio"
                value={estudioFormData.fechaInicio ? new Date(estudioFormData.fechaInicio) : new Date()}
                onChange={(date) => setEstudioFormData({ ...estudioFormData, fechaInicio: date.toISOString().split('T')[0] })}
              />
              <DatePicker
                label="Fecha de Fin"
                value={estudioFormData.fechaFin ? new Date(estudioFormData.fechaFin) : new Date()}
                onChange={(date) => setEstudioFormData({ ...estudioFormData, fechaFin: date.toISOString().split('T')[0] })}
              />
              <Input
                label="Descripción"
                value={estudioFormData.descripcion}
                onChangeText={(text) => setEstudioFormData({ ...estudioFormData, descripcion: text })}
                placeholder="Descripción adicional"
                multiline
                numberOfLines={3}
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setShowEstudioModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={estudioSaving ? 'Guardando...' : 'Guardar'}
                onPress={saveEstudio}
                disabled={estudioSaving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Experiencia */}
      <Modal visible={showExperienciaModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExperienciaIndex !== null ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </Text>
              <TouchableOpacity onPress={() => setShowExperienciaModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Input
                label="Cargo *"
                value={experienciaFormData.cargo}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, cargo: text })}
                placeholder="Nombre del cargo"
              />
              <Input
                label="Empresa *"
                value={experienciaFormData.empresa}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, empresa: text })}
                placeholder="Nombre de la empresa"
              />
              <DatePicker
                label="Fecha de Inicio"
                value={experienciaFormData.fechaInicio ? new Date(experienciaFormData.fechaInicio) : new Date()}
                onChange={(date) => setExperienciaFormData({ ...experienciaFormData, fechaInicio: date.toISOString().split('T')[0] })}
              />
              <DatePicker
                label="Fecha de Fin"
                value={experienciaFormData.fechaFin ? new Date(experienciaFormData.fechaFin) : new Date()}
                onChange={(date) => setExperienciaFormData({ ...experienciaFormData, fechaFin: date.toISOString().split('T')[0] })}
              />
              <Input
                label="Descripción"
                value={experienciaFormData.descripcion}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, descripcion: text })}
                placeholder="Funciones y logros"
                multiline
                numberOfLines={3}
              />
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setShowExperienciaModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title={experienciaSaving ? 'Guardando...' : 'Guardar'}
                onPress={saveExperiencia}
                disabled={experienciaSaving}
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
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: spacing.xs,
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  itemsContainer: {
    paddingVertical: spacing.md,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
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
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
});

export default HojaDeVidaScreen;
