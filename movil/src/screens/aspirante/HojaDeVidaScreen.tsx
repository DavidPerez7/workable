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

  // Modales de Estudios
  const [showEstudioModal, setShowEstudioModal] = useState(false);
  const [editingEstudio, setEditingEstudio] = useState<Estudio | undefined>();
  const [estudioFormData, setEstudioFormData] = useState<Partial<Estudio>>({
    institucion: '',
    titulo: '',
    nivelEducativo: 'LICENCIATURA',
    fechaInicio: new Date().toISOString().split('T')[0],
    enCurso: false,
    fechaFin: '',
    descripcion: '',
  });

  // Modales de Experiencias
  const [showExperienciaModal, setShowExperienciaModal] = useState(false);
  const [editingExperiencia, setEditingExperiencia] = useState<Experiencia | undefined>();
  const [experienciaFormData, setExperienciaFormData] = useState<Partial<Experiencia>>({
    puesto: '',
    empresa: '',
    descripcion: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
  });

  // Modales de Habilidades
  const [showHabilidadModal, setShowHabilidadModal] = useState(false);
  const [editingHabilidad, setEditingHabilidad] = useState<Habilidad | undefined>();
  const [habilidadFormData, setHabilidadFormData] = useState<Partial<Habilidad>>({
    nombre: '',
    nivel: 'INTERMEDIO',
  });

  const [savingModal, setSavingModal] = useState(false);

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
            onPress={() => Alert.alert('Próximamente', 'Pantalla de crear estudio')}
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
              onPress={() => setExpandedEstudios({ ...expandedEstudios, [estudio.id!]: !expandedEstudios[estudio.id!] })}
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
                    <DetailRow label="Finalización" value={formatDate(estudio.fechaFin)} />
                  )}
                  {estudio.descripcion && <DetailRow label="Descripción" value={estudio.descripcion} />}
                  <View style={styles.actionButtons}>
                    <Button
                      title="Editar"
                      variant="outline"
                      onPress={() => Alert.alert('Próximamente', 'Pantalla de editar estudio')}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                    <Button
                      title="Eliminar"
                      variant="danger"
                      onPress={() => Alert.alert('Próximamente', 'Confirmación de eliminar')}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <Button
            title="+ Agregar Estudio"
            onPress={() => Alert.alert('Próximamente', 'Pantalla de crear estudio')}
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
          <Text style={styles.emptyText}>No tienes experiencias laborales registradas</Text>
          <Button
            title="+ Agregar Experiencia"
            onPress={() => Alert.alert('Próximamente', 'Pantalla de crear experiencia')}
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
                  <Text style={styles.itemTitle}>{experiencia.puesto}</Text>
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
                      onPress={() => Alert.alert('Próximamente', 'Pantalla de editar experiencia')}
                      style={{ flex: 1, marginRight: spacing.sm }}
                    />
                    <Button
                      title="Eliminar"
                      variant="danger"
                      onPress={() => Alert.alert('Próximamente', 'Confirmación de eliminar')}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
          <Button
            title="+ Agregar Experiencia"
            onPress={() => Alert.alert('Próximamente', 'Pantalla de crear experiencia')}
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
            onPress={() => Alert.alert('Próximamente', 'Pantalla de crear habilidad')}
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
                {habilidad.nivel && (
                  <View style={styles.levelIndicator}>
                    <Text style={styles.levelText}>{habilidad.nivel}</Text>
                  </View>
                )}
              </View>
              <View style={styles.habilidadActions}>
                <TouchableOpacity
                  onPress={() => Alert.alert('Próximamente', 'Editar habilidad')}
                  style={styles.iconButton}
                >
                  <Ionicons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Alert.alert('Próximamente', 'Eliminar habilidad')}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <Button
            title="+ Agregar Habilidad"
            onPress={() => Alert.alert('Próximamente', 'Pantalla de crear habilidad')}
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
    </View>
  );
};

// Componentes auxiliares

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

// Funciones auxiliares

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateString;
  }
};

// Estilos

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
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  itemsContainer: {
    paddingVertical: spacing.md,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  itemTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  itemDetails: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
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
    paddingTopMargin: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
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
  },
  iconButton: {
    padding: spacing.sm,
  },
});

export default HojaDeVidaScreen;
