import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../api/reclutador';
import { getEmpresaById } from '../../api/empresa';
import * as SecureStore from 'expo-secure-store';
import Loading from '../../components/Loading';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Reclutador, Empresa } from '../../types';

/**
 * Pantalla principal del dashboard del reclutador
 * Muestra información del reclutador y su empresa asociada
 * Replica el comportamiento de la versión web
 */
const DashboardReclutadorScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [perfil, setPerfil] = useState<Reclutador | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar perfil del reclutador
      const perfilData = await getMyProfile();
      setPerfil(perfilData);

      // Si tiene empresa asociada, cargarla
      if (perfilData.empresa?.id) {
        try {
          const empresaData = await getEmpresaById(perfilData.empresa.id);
          setEmpresa(empresaData);
          
          // Actualizar contexto con datos completos de empresa
          updateUser({
            empresaId: empresaData.id,
            empresa: { id: empresaData.id, nombre: empresaData.nombre },
          });
        } catch (empresaError: any) {
          console.warn('No se pudo cargar empresa:', empresaError);
        }
      } else if (user?.correo) {
        // Fallback a empresa cacheada localmente si el perfil no trae empresa
        try {
          const cached = await SecureStore.getItemAsync(`workable_empresa_${user.correo.toLowerCase()}`);
          if (cached) {
            const parsed = JSON.parse(cached);
            setEmpresa(parsed);
            updateUser({ empresaId: parsed.id, empresa: parsed });
          }
        } catch (cacheErr) {
          console.warn('No se pudo cargar empresa cacheada en dashboard:', cacheErr);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) return <Loading />;

  const hasEmpresa = empresa || perfil?.empresa;

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header con info del reclutador */}
      <View style={styles.welcomeCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={colors.primary} />
        </View>
        <Text style={styles.welcomeTitle}>Bienvenido, {perfil?.nombre}</Text>
        <Text style={styles.welcomeSubtitle}>{perfil?.correo}</Text>
        {perfil?.cargo && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{perfil.cargo}</Text>
          </View>
        )}
      </View>

      {/* Información de la empresa */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="business" size={24} color={colors.primary} />
          <Text style={styles.cardTitle}>Mi Empresa</Text>
        </View>
        
        {hasEmpresa ? (
          <View style={styles.cardContent}>
            <InfoRow icon="briefcase" label="Nombre" value={empresa?.nombre || perfil?.empresa?.nombre || 'N/A'} />
            {empresa?.nit && <InfoRow icon="document-text" label="NIT" value={empresa.nit} />}
            {empresa?.descripcion && (
              <View style={styles.infoRow}>
                <Ionicons name="information-circle" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Descripción</Text>
                  <Text style={styles.infoValue}>{empresa.descripcion}</Text>
                </View>
              </View>
            )}
            {empresa?.numeroTrabajadores && (
              <InfoRow icon="people" label="Empleados" value={`${empresa.numeroTrabajadores} personas`} />
            )}
            {empresa?.telefonoContacto && (
              <InfoRow icon="call" label="Teléfono" value={empresa.telefonoContacto} />
            )}
            {empresa?.emailContacto && (
              <InfoRow icon="mail" label="Email" value={empresa.emailContacto} />
            )}
            {empresa?.direcciones && empresa.direcciones.length > 0 && (
              <InfoRow icon="location" label="Dirección" value={empresa.direcciones[0]} />
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No tienes una empresa asociada</Text>
            <Text style={styles.emptySubtext}>
              Contacta al administrador para asociar tu cuenta a una empresa
            </Text>
          </View>
        )}
      </View>

      {/* Accesos rápidos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash" size={24} color={colors.primary} />
          <Text style={styles.cardTitle}>Accesos Rápidos</Text>
        </View>
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="add-circle"
            label="Crear Oferta"
            onPress={() => navigation.navigate('CrearOfertaTab' as never)}
            disabled={!hasEmpresa}
          />
          <QuickActionButton
            icon="briefcase"
            label="Mis Ofertas"
            onPress={() => navigation.navigate('MisOfertasTab' as never)}
          />
          <QuickActionButton
            icon="people"
            label="Postulantes"
            onPress={() => navigation.navigate('MisOfertasTab' as never)}
          />
        </View>
      </View>

      {/* Estadísticas rápidas */}
      {hasEmpresa && (
        <View style={styles.statsContainer}>
          <StatCard icon="briefcase" label="Ofertas Activas" value="0" color={colors.primary} />
          <StatCard icon="people" label="Postulantes" value="0" color={colors.success} />
          <StatCard icon="checkmark-circle" label="Contratados" value="0" color={colors.info} />
        </View>
      )}
    </ScrollView>
  );
};

// Componente de fila de información
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={20} color={colors.textSecondary} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// Componente de botón de acción rápida
const QuickActionButton = ({
  icon,
  label,
  onPress,
  disabled = false,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.quickActionBtn, disabled && styles.quickActionBtnDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Ionicons name={icon as any} size={32} color={disabled ? colors.textSecondary : colors.primary} />
    <Text style={[styles.quickActionLabel, disabled && styles.quickActionLabelDisabled]}>{label}</Text>
  </TouchableOpacity>
);

// Componente de tarjeta de estadística
const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Ionicons name={icon as any} size={24} color={color} />
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: 16,
    marginBottom: spacing.md,
    ...shadows.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  cardContent: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.sm,
  },
  quickActionBtn: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    minWidth: 100,
  },
  quickActionBtnDisabled: {
    opacity: 0.5,
  },
  quickActionLabel: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  quickActionLabelDisabled: {
    color: colors.textSecondary,
  },
  statsContainer: {
    gap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default DashboardReclutadorScreen;
