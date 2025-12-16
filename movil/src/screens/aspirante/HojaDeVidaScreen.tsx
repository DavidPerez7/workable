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
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import {
  getEstudiosByAspirante,
  getExperienciasByAspirante,
  getHabilidadesByAspirante,
  createEstudio,
  updateEstudio,
  deleteEstudio,
  createExperiencia,
  updateExperiencia,
  deleteExperiencia,
  createHabilidad,
  updateHabilidad,
  deleteHabilidad,
} from '../../api/hojaVida';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import DatePicker from '../../components/DatePicker';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Estudio, Experiencia, Habilidad } from '../../types';

const HojaDeVidaScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'estudios' | 'experiencias' | 'habilidades'>('estudios');

  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);

  const [expandedEstudios, setExpandedEstudios] = useState<Record<number, boolean>>({});
  const [expandedExperiencias, setExpandedExperiencias] = useState<Record<number, boolean>>({});

  // ===== MODALES DE ESTUDIOS =====
  const [showEstudioModal, setShowEstudioModal] = useState(false);
  const [editingEstudio, setEditingEstudio] = useState<Estudio | undefined>();
  const [estudioSaving, setEstudioSaving] = useState(false);
  const [estudioFormData, setEstudioFormData] = useState<Partial<Estudio>>({
    institucion: '',
    titulo: '',
    nivelEducativo: 'LICENCIATURA',
    fechaInicio: new Date().toISOString().split('T')[0],
    enCurso: false,
    fechaFin: '',
    descripcion: '',
    estadoEstudio: 'ACTIVO',
  });

  // ===== MODALES DE EXPERIENCIAS =====
  const [showExperienciaModal, setShowExperienciaModal] = useState(false);
  const [editingExperiencia, setEditingExperiencia] = useState<Experiencia | undefined>();
  const [experienciaSaving, setExperienciaSaving] = useState(false);
  const [experienciaFormData, setExperienciaFormData] = useState<Partial<Experiencia>>({
    cargo: '',
    empresa: '',
    descripcion: '',
    certificadoUrl: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
  });

  // ===== MODALES DE HABILIDADES =====
  const [showHabilidadModal, setShowHabilidadModal] = useState(false);
  const [editingHabilidad, setEditingHabilidad] = useState<Habilidad | undefined>();
  const [habilidadSaving, setHabilidadSaving] = useState(false);
  const [habilidadFormData, setHabilidadFormData] = useState<Partial<Habilidad>>({
    nombre: '',
    tipo: 'TECNICA',
    isActive: true,
  });

  // ===== CARGAR DATOS =====
  const loadData = async () => {
    if (!user?.usuarioId) return;
    try {
      const [estudiosList, experienciasList, habilidadesList] = await Promise.all([
        getEstudiosByAspirante(),
        getExperienciasByAspirante(),
        getHabilidadesByAspirante(),
      ]);
      setEstudios(estudiosList || []);
      setExperiencias(experienciasList || []);
      setHabilidades(habilidadesList || []);
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

  // ===== HANDLERS DE ESTUDIOS =====
  const openEstudioModal = (estudio?: Estudio) => {
    if (estudio) {
      setEditingEstudio(estudio);
      setEstudioFormData({
        institucion: estudio.institucion,
        titulo: estudio.titulo,
        nivelEducativo: estudio.nivelEducativo,
        fechaInicio: estudio.fechaInicio,
        enCurso: estudio.enCurso,
        fechaFin: estudio.fechaFin,
        descripcion: estudio.descripcion,
      estadoEstudio: estudio.estadoEstudio || 'ACTIVO',
          });
    } else {
      setEditingEstudio(undefined);
      setEstudioFormData({
        institucion: '',
        titulo: '',
        nivelEducativo: 'LICENCIATURA',
        fechaInicio: new Date().toISOString().split('T')[0],
        enCurso: false,
        fechaFin: '',
        descripcion: '',
      estadoEstudio: 'ACTIVO',
          });
    }
    setShowEstudioModal(true);
  };

  const saveEstudio = async () => {
    try {
      if (!estudioFormData.institucion?.trim() || !estudioFormData.titulo?.trim()) {
        Alert.alert('Validación', 'Completa institución y título');
        return;
      }

      setEstudioSaving(true);
      const data = {
        ...estudioFormData,
        aspirante: { id: user!.usuarioId },
      } as Estudio;

      if (editingEstudio?.id) {
        await updateEstudio(editingEstudio.id, data);
        Alert.alert('Éxito', 'Estudio actualizado');
      } else {
        await createEstudio(data);
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

  const deleteEstudioHandler = (id: number) => {
    Alert.alert('Eliminar', '¿Eliminar este estudio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEstudio(id);
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
  const openExperienciaModal = (experiencia?: Experiencia) => {
    if (experiencia) {
      setEditingExperiencia(experiencia);
      setExperienciaFormData({
        cargo: experiencia.cargo,
        empresa: experiencia.empresa,
        descripcion: experiencia.descripcion,
        certificadoUrl: experiencia.certificadoUrl,
        fechaInicio: experiencia.fechaInicio,
        fechaFin: experiencia.fechaFin,
      });
    } else {
      setEditingExperiencia(undefined);
      setExperienciaFormData({
        cargo: '',
        empresa: '',
        descripcion: '',
        certificadoUrl: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: new Date().toISOString().split('T')[0],
      });
    }
    setShowExperienciaModal(true);
  };

  const saveExperiencia = async () => {
    try {
      if (!experienciaFormData.cargo?.trim() || !experienciaFormData.empresa?.trim()) {
        Alert.alert('Validación', 'Completa cargo y empresa');
        return;
      }

      setExperienciaSaving(true);
      const data = {
        ...experienciaFormData,
        aspirante: { id: user!.usuarioId },
      } as Experiencia;

      if (editingExperiencia?.id) {
        await updateExperiencia(editingExperiencia.id, data);
        Alert.alert('Éxito', 'Experiencia actualizada');
      } else {
        await createExperiencia(data);
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

  const deleteExperienciaHandler = (id: number) => {
    Alert.alert('Eliminar', '¿Eliminar esta experiencia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExperiencia(id);
            Alert.alert('Éxito', 'Experiencia eliminada');
            loadData();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al eliminar');
          }
        },
      },
    ]);
  };

  // ===== HANDLERS DE HABILIDADES =====
  const openHabilidadModal = (habilidad?: Habilidad) => {
    if (habilidad) {
      setEditingHabilidad(habilidad);
      setHabilidadFormData({
        nombre: habilidad.nombre,
        tipo: habilidad.tipo,
        isActive: habilidad.isActive,
      });
    } else {
      setEditingHabilidad(undefined);
      setHabilidadFormData({
        nombre: '',
        tipo: 'TECNICA',
        isActive: true,
      });
    }
    setShowHabilidadModal(true);
  };

  const saveHabilidad = async () => {
    try {
      if (!habilidadFormData.nombre?.trim()) {
        Alert.alert('Validación', 'Escribe el nombre de la habilidad');
        return;
      }

      setHabilidadSaving(true);
      const data = {
        ...habilidadFormData,
        aspirante: { id: user!.usuarioId },
      } as Habilidad;

      if (editingHabilidad?.id) {
        await updateHabilidad(editingHabilidad.id, data);
        Alert.alert('Éxito', 'Habilidad actualizada');
      } else {
        await createHabilidad(data);
        Alert.alert('Éxito', 'Habilidad creada');
      }

      setShowHabilidadModal(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar habilidad');
    } finally {
      setHabilidadSaving(false);
    }
  };

  const deleteHabilidadHandler = (id: number) => {
    Alert.alert('Eliminar', '¿Eliminar esta habilidad?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHabilidad(id);
            Alert.alert('Éxito', 'Habilidad eliminada');
            loadData();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Error al eliminar');
          }
        },
      },
    ]);
  };

  // ===== RENDERS =====
  if (loading) return <Loading />;

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
          {estudios.map((estudio) => (
            <TouchableOpacity
              key={estudio.id}
              style={styles.itemCard}
              onPress={() =>
                setExpandedEstudios({
                  ...expandedEstudios,
                  [estudio.id!]: !expandedEstudios[estudio.id!],
                })
              }
            >
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{estudio.titulo}</Text>
                  <Text style={styles.itemSubtitle}>{estudio.institucion}</Text>
                </View>
                <Ionicons
                  name={expandedEstudios[estudio.id!] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.primary}
                />
              </View>

              {expandedEstudios[estudio.id!] && (
                <View style={styles.itemDetails}>
                  <DetailRow label="Nivel" value={estudio.nivelEducativo} />
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
                      onPress={() => openEstudioModal(estudio)}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                    <Button
                      title="Eliminar"
                      variant="danger"
                      onPress={() => deleteEstudioHandler(estudio.id!)}
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
          {experiencias.map((experiencia) => (
            <TouchableOpacity
              key={experiencia.id}
              style={styles.itemCard}
              onPress={() =>
                setExpandedExperiencias({
                  ...expandedExperiencias,
                  [experiencia.id!]: !expandedExperiencias[experiencia.id!],
                })
              }
            >
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{experiencia.cargo}</Text>
                  <Text style={styles.itemSubtitle}>{experiencia.empresa}</Text>
                </View>
                <Ionicons
                  name={expandedExperiencias[experiencia.id!] ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.primary}
                />
              </View>

              {expandedExperiencias[experiencia.id!] && (
                <View style={styles.itemDetails}>
                  <DetailRow label="Inicio" value={formatDate(experiencia.fechaInicio)} />
                  <DetailRow label="Fin" value={formatDate(experiencia.fechaFin)} />
                  {experiencia.descripcion && <DetailRow label="Descripción" value={experiencia.descripcion} />}
                  <View style={styles.actionButtons}>
                    <Button
                      title="Editar"
                      variant="outline"
                      onPress={() => openExperienciaModal(experiencia)}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                    <Button
                      title="Eliminar"
                      variant="danger"
                      onPress={() => deleteExperienciaHandler(experiencia.id!)}
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

  const renderHabilidades = () => (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {habilidades.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="star-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tienes habilidades registradas</Text>
          <Button
            title="+ Agregar Habilidad"
            onPress={() => openHabilidadModal()}
            fullWidth
            style={{ marginTop: spacing.md }}
          />
        </View>
      ) : (
        <View style={styles.itemsContainer}>
          {habilidades.map((habilidad) => (
            <View key={habilidad.id} style={styles.habilidadCard}>
              <View style={styles.habilidadContent}>
                <Text style={styles.habilidadNombre}>{habilidad.nombre}</Text>
                <View style={styles.levelIndicator}>
                  <Text style={styles.levelText}>{habilidad.tipo}</Text>
                </View>
              </View>
              <View style={styles.habilidadActions}>
                <TouchableOpacity
                  onPress={() => openHabilidadModal(habilidad)}
                  style={styles.iconButton}
                >
                  <Ionicons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteHabilidadHandler(habilidad.id!)}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Button
            title="+ Agregar Habilidad"
            onPress={() => openHabilidadModal()}
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
          <Text style={[styles.tabText, activeTab === 'estudios' && styles.activeTabText]}>Estudios ({estudios.length})</Text>
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

        <TouchableOpacity
          style={[styles.tab, activeTab === 'habilidades' && styles.activeTab]}
          onPress={() => setActiveTab('habilidades')}
        >
          <Ionicons name="star" size={20} color={activeTab === 'habilidades' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'habilidades' && styles.activeTabText]}>
            Habilidades ({habilidades.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
        {activeTab === 'estudios' && renderEstudios()}
        {activeTab === 'experiencias' && renderExperiencias()}
        {activeTab === 'habilidades' && renderHabilidades()}
      </View>

      {/* ===== MODAL DE ESTUDIO ===== */}
      <Modal
        visible={showEstudioModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingEstudio ? 'Editar' : 'Crear'} Estudio</Text>
              <TouchableOpacity onPress={() => setShowEstudioModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Institución"
                placeholder="Ej: Universidad Nacional"
                value={estudioFormData.institucion}
                onChangeText={(text) => setEstudioFormData({ ...estudioFormData, institucion: text })}
              />

              <Input
                label="Título"
                placeholder="Ej: Ingeniería de Sistemas"
                value={estudioFormData.titulo}
                onChangeText={(text) => setEstudioFormData({ ...estudioFormData, titulo: text })}
              />

              <Picker
                label="Nivel Educativo"
                selectedValue={estudioFormData.nivelEducativo}
                options={[
                  { label: 'Primaria', value: 'PRIMARIA' },
                  { label: 'Secundaria', value: 'SECUNDARIA' },
                  { label: 'Técnico', value: 'TECNICO' },
                  { label: 'Tecnólogo', value: 'TECNOLOGO' },
                  { label: 'Licenciatura', value: 'LICENCIATURA' },
                  { label: 'Profesional', value: 'PROFESIONAL' },
                  { label: 'Especialización', value: 'ESPECIALIZACION' },
                  { label: 'Maestría', value: 'MAESTRIA' },
                  { label: 'Doctorado', value: 'DOCTORADO' },
                ]}
                onValueChange={(value) => setEstudioFormData({ ...estudioFormData, nivelEducativo: value })}
              />

              <Picker
                label="Estado"
                selectedValue={estudioFormData.estadoEstudio || 'ACTIVO'}
                options={[
                  { label: 'Activo', value: 'ACTIVO' },
                  { label: 'Inactivo', value: 'INACTIVO' },
                ]}
                onValueChange={(value) => setEstudioFormData({ ...estudioFormData, estadoEstudio: value })}
              />

              <DatePicker
                label="Fecha de Inicio"
                value={estudioFormData.fechaInicio}
                onDateChange={(date) => setEstudioFormData({ ...estudioFormData, fechaInicio: date })}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>En Curso</Text>
                <Switch
                  value={estudioFormData.enCurso}
                  onValueChange={(value) =>
                    setEstudioFormData({
                      ...estudioFormData,
                      enCurso: value,
                      fechaFin: value ? '' : estudioFormData.fechaFin,
                    })
                  }
                />
              </View>

              {!estudioFormData.enCurso && (
                <DatePicker
                  label="Fecha de Fin"
                  value={estudioFormData.fechaFin}
                  onDateChange={(date) => setEstudioFormData({ ...estudioFormData, fechaFin: date })}
                />
              )}

              <Input
                label="Descripción"
                placeholder="Opcional"
                multiline
                numberOfLines={3}
                value={estudioFormData.descripcion}
                onChangeText={(text) => setEstudioFormData({ ...estudioFormData, descripcion: text })}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setShowEstudioModal(false)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <Button
                title="Guardar"
                onPress={saveEstudio}
                loading={estudioSaving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== MODAL DE EXPERIENCIA ===== */}
      <Modal
        visible={showExperienciaModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingExperiencia ? 'Editar' : 'Crear'} Experiencia</Text>
              <TouchableOpacity onPress={() => setShowExperienciaModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Cargo"
                placeholder="Ej: Desarrollador Junior"
                value={experienciaFormData.cargo}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, cargo: text })}
              />

              <Input
                label="Empresa"
                placeholder="Ej: TechCorp"
                value={experienciaFormData.empresa}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, empresa: text })}
              />

              <DatePicker
                label="Fecha de Inicio"
                value={experienciaFormData.fechaInicio}
                onDateChange={(date) => setExperienciaFormData({ ...experienciaFormData, fechaInicio: date })}
              />

              <DatePicker
                label="Fecha de Fin"
                value={experienciaFormData.fechaFin}
                onDateChange={(date) => setExperienciaFormData({ ...experienciaFormData, fechaFin: date })}
              />

              <Input
                label="Descripción"
                placeholder="Opcional"
                multiline
                numberOfLines={3}
                value={experienciaFormData.descripcion}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, descripcion: text })}
              />

              <Input
                label="URL del Certificado"
                placeholder="Ej: https://ejemplo.com/certificado"
                value={experienciaFormData.certificadoUrl}
                onChangeText={(text) => setExperienciaFormData({ ...experienciaFormData, certificadoUrl: text })}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setShowExperienciaModal(false)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <Button
                title="Guardar"
                onPress={saveExperiencia}
                loading={experienciaSaving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== MODAL DE HABILIDAD ===== */}
      <Modal
        visible={showHabilidadModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingHabilidad ? 'Editar' : 'Crear'} Habilidad</Text>
              <TouchableOpacity onPress={() => setShowHabilidadModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Input
                label="Habilidad"
                placeholder="Ej: JavaScript, Liderazgo, etc."
                value={habilidadFormData.nombre}
                onChangeText={(text) => setHabilidadFormData({ ...habilidadFormData, nombre: text })}
              />

              <Picker
                label="Tipo de Habilidad"
                 selectedValue={habilidadFormData.tipo || 'TECNICA'}
                options={[
                  { label: 'Técnica', value: 'TECNICA' },
                  { label: 'Blanda', value: 'BLANDA' },
                  { label: 'Idioma', value: 'IDIOMA' },
                ]}
                onValueChange={(value) =>
                  setHabilidadFormData({
                    ...habilidadFormData,
                    tipo: value as 'TECNICA' | 'BLANDA' | 'IDIOMA',
                  })
                }
                             // tipo values: TECNICA | BLANDA | IDIOMA
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => setShowHabilidadModal(false)}
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <Button
                title="Guardar"
                onPress={saveHabilidad}
                loading={habilidadSaving}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ===== COMPONENTES AUXILIARES =====
interface DetailRowProps {
  label: string;
  value: string | undefined;
  badge?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, badge }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    {badge ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{value}</Text>
      </View>
    ) : (
      <Text style={styles.detailValue}>{value || '-'}</Text>
    )}
  </View>
);

// ===== FUNCIONES AUXILIARES =====
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateString;
  }
};

// ===== ESTILOS =====
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
  // Modal Styles
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  habilidadCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  habilidadContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  habilidadNombre: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    flex: 1,
  },
  levelIndicator: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  levelText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  habilidadActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  iconButton: {
    padding: spacing.sm,
  },
});

export default HojaDeVidaScreen;
