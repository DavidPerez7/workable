import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getHojaVidaByAspirante } from '../../api/hojaVida';
import Loading from '../../components/Loading';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { HojaVida, EstudioData, ExperienciaData, AdminDrawerParamList } from '../../types';

type AspiranteHojaVidaScreenRouteProp = RouteProp<AdminDrawerParamList, 'AspiranteHojaVida'>;

const AspiranteHojaVidaScreen = () => {
  const route = useRoute<AspiranteHojaVidaScreenRouteProp>();
  const navigation = useNavigation();
  const { aspiranteId, aspiranteNombre } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hojaVida, setHojaVida] = useState<HojaVida | null>(null);
  const [activeTab, setActiveTab] = useState<'estudios' | 'experiencias'>('estudios');
  const [expandedEstudios, setExpandedEstudios] = useState<Record<number, boolean>>({});
  const [expandedExperiencias, setExpandedExperiencias] = useState<Record<number, boolean>>({});

  const loadData = async () => {
    try {
      const hv = await getHojaVidaByAspirante(aspiranteId);
      setHojaVida(hv);
    } catch (error: any) {
      console.error('Error cargando hoja de vida:', error);
      Alert.alert('Error', error.message || 'Error al cargar hoja de vida');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [aspiranteId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CO');
  };

  if (loading) return <Loading />;

  const estudios = hojaVida?.estudios || [];
  const experiencias = hojaVida?.experiencias || [];

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  const renderEstudios = () => (
    <View style={styles.itemsContainer}>
      {estudios.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="school-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tiene estudios registrados</Text>
        </View>
      ) : (
        estudios.map((estudio, index) => (
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
                <DetailRow label="Fin" value={estudio.enCurso ? 'En curso' : formatDate(estudio.fechaFin)} />
                {estudio.descripcion && <DetailRow label="Descripción" value={estudio.descripcion} />}
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  const renderExperiencias = () => (
    <View style={styles.itemsContainer}>
      {experiencias.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="briefcase-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No tiene experiencias registradas</Text>
        </View>
      ) : (
        experiencias.map((experiencia, index) => (
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
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoja de Vida</Text>
        <Text style={styles.subtitle}>{aspiranteNombre}</Text>
      </View>

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
          <Ionicons name="briefcase" size={20} color={activeTab === 'experiencias' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'experiencias' && styles.activeTabText]}>
            Experiencias ({experiencias.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'estudios' && renderEstudios()}
        {activeTab === 'experiencias' && renderExperiencias()}
      </ScrollView>
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
  subtitle: {
    fontSize: fontSize.md,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
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
    marginBottom: spacing.sm,
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
});

export default AspiranteHojaVidaScreen;
