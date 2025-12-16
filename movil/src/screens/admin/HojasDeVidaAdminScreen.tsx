import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllAspirantes, deleteAspirante } from '../../api/aspirante';
import {
  getHojaVidaByAspirante,
  deleteEstudio,
  deleteExperiencia,
  deleteHabilidad,
} from '../../api/hojaVida';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Aspirante, Estudio, Experiencia, Habilidad } from '../../types';

const HojasDeVidaAdminScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);
  const [filtro, setFiltro] = useState('');
  
  const [selectedAspirante, setSelectedAspirante] = useState<Aspirante | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadAspirantes = async () => {
    try {
      const data = await getAllAspirantes();
      setAspirantes(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error cargando aspirantes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAspirantes();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAspirantes();
  };

  const openDetailModal = async (aspirante: Aspirante) => {
    setSelectedAspirante(aspirante);
    setShowDetailModal(true);
    setDetailLoading(true);
    
    try {
      // Obtener hoja de vida del aspirante específico
      if (!aspirante.id) return;
      const hojaVida = await getHojaVidaByAspirante(aspirante.id);
      
      setEstudios(hojaVida?.estudios || []);
      setExperiencias(hojaVida?.experiencias || []);
      setHabilidades(hojaVida?.habilidades || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error cargando hoja de vida');
    } finally {
      setDetailLoading(false);
    }
  };

  const aspirantesFiltrados = aspirantes.filter((a) =>
    `${a.nombre} ${a.apellido} ${a.correo}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  const handleDeleteEstudio = (id?: number) => {
    if (!id) return;
    Alert.alert(
      'Eliminar Estudio',
      '¿Estás seguro de que quieres eliminar este estudio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEstudio(id);
              if (selectedAspirante?.id) {
                await openDetailModal(selectedAspirante);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar estudio');
            }
          },
        },
      ]
    );
  };

  const handleDeleteExperiencia = (id?: number) => {
    if (!id) return;
    Alert.alert(
      'Eliminar Experiencia',
      '¿Estás seguro de que quieres eliminar esta experiencia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExperiencia(id);
              if (selectedAspirante?.id) {
                await openDetailModal(selectedAspirante);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar experiencia');
            }
          },
        },
      ]
    );
  };

  const handleDeleteHabilidad = (id?: number) => {
    if (!id) return;
    Alert.alert(
      'Eliminar Habilidad',
      '¿Estás seguro de que quieres eliminar esta habilidad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabilidad(id);
              if (selectedAspirante?.id) {
                await openDetailModal(selectedAspirante);
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar habilidad');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAspirante = () => {
    if (!selectedAspirante?.id) return;
    Alert.alert(
      'Eliminar Aspirante',
      `¿Estás seguro de que quieres eliminar a ${selectedAspirante.nombre} ${selectedAspirante.apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAspirante(selectedAspirante.id!);
              Alert.alert('Éxito', 'Aspirante eliminado correctamente');
              setShowDetailModal(false);
              loadAspirantes();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar aspirante');
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loading />;

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hojas de Vida</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <Input
          placeholder="Buscar por nombre o correo..."
          value={filtro}
          onChangeText={setFiltro}
          style={{ flex: 1, borderWidth: 0 }}
        />
      </View>

      {/* List */}
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {aspirantesFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No hay aspirantes</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {aspirantesFiltrados.map((aspirante) => (
              <TouchableOpacity
                key={aspirante.id}
                style={styles.card}
                onPress={() => openDetailModal(aspirante)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>
                      {aspirante.nombre} {aspirante.apellido}
                    </Text>
                    <Text style={styles.cardSubtitle}>{aspirante.correo}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Hoja de Vida - {selectedAspirante?.nombre} {selectedAspirante?.apellido}
              </Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {detailLoading ? (
              <View style={styles.modalLoading}>
                <Loading />
              </View>
            ) : (
              <ScrollView style={styles.modalBody}>
                {/* Estudios */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Estudios ({estudios.length})</Text>
                  {estudios.length === 0 ? (
                    <Text style={styles.emptyText}>Sin estudios registrados</Text>
                  ) : (
                    estudios.map((estudio) => (
                      <View key={estudio.id} style={styles.itemContainer}>
                        <View style={styles.item}>
                          <Text style={styles.itemTitle}>{estudio.titulo}</Text>
                          <Text style={styles.itemSubtitle}>{estudio.institucion}</Text>
                          <Text style={styles.itemDetail}>
                            {estudio.nivelEducativo} - {estudio.fechaInicio}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteEstudio(estudio.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>

                {/* Experiencias */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Experiencias ({experiencias.length})</Text>
                  {experiencias.length === 0 ? (
                    <Text style={styles.emptyText}>Sin experiencias registradas</Text>
                  ) : (
                    experiencias.map((experiencia) => (
                      <View key={experiencia.id} style={styles.itemContainer}>
                        <View style={styles.item}>
                          <Text style={styles.itemTitle}>{experiencia.cargo}</Text>
                          <Text style={styles.itemSubtitle}>{experiencia.empresa}</Text>
                          <Text style={styles.itemDetail}>
                            {experiencia.fechaInicio} - {experiencia.fechaFin}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteExperiencia(experiencia.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>

                {/* Habilidades */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Habilidades ({habilidades.length})</Text>
                  {habilidades.length === 0 ? (
                    <Text style={styles.emptyText}>Sin habilidades registradas</Text>
                  ) : (
                    <View style={styles.habilidadesList}>
                      {habilidades.map((habilidad) => (
                        <View key={habilidad.id} style={styles.habilidadBadgeContainer}>
                          <View style={styles.habilidadBadge}>
                            <Text style={styles.habilidadText}>{habilidad.nombre}</Text>
                            <Text style={styles.habilidadTipo}>{habilidad.tipo}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteHabilidad(habilidad.id)}
                          >
                            <Ionicons name="trash-outline" size={14} color={colors.error} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {selectedAspirante?.descripcion && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sobre Mí</Text>
                    <Text style={styles.descriptionText}>{selectedAspirante.descripcion}</Text>
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Button
                title="Cerrar"
                variant="outline"
                onPress={() => setShowDetailModal(false)}
                fullWidth
              />
              <Button
                title="Eliminar Aspirante"
                variant="danger"
                onPress={handleDeleteAspirante}
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
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
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
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
    flex: 1,
  },
  modalLoading: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  section: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  item: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
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
  itemDetail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  habilidadesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  habilidadBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  habilidadBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    flex: 1,
  },
  habilidadText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  habilidadTipo: {
    fontSize: fontSize.xs,
    color: colors.white,
    marginTop: spacing.xs,
  },
  descriptionText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
});

export default HojasDeVidaAdminScreen;
