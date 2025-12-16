import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAllAspirantes } from '../../api/aspirante';
import { getAllReclutadores } from '../../api/reclutador';
import { getAllOfertas } from '../../api/oferta';
import { getAllPostulaciones } from '../../api/postulacion';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';

const DashboardAdminScreen = () => {
  const { logout, user } = useAuth();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    aspirantes: 0,
    reclutadores: 0,
    ofertas: 0,
    ofertasAbiertas: 0,
    postulaciones: 0,
    postulacionesActivas: 0,
  });

  const loadDashboardData = async () => {
    try {
      const [aspirantes, reclutadores, ofertas, postulaciones] = await Promise.all([
        getAllAspirantes(),
        getAllReclutadores(),
        getAllOfertas(),
        getAllPostulaciones(),
      ]);

      setStats({
        aspirantes: aspirantes.length,
        reclutadores: reclutadores.length,
        ofertas: ofertas.length,
        ofertasAbiertas: ofertas.filter((o) => o.estado === 'ABIERTA').length,
        postulaciones: postulaciones.length,
        postulacionesActivas: postulaciones.filter(
          (p) => p.estado === 'POSTULADO' || p.estado === 'EN_REVISION'
        ).length,
      });
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) return <Loading />;

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Bienvenido, {user?.nombre}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#e0f2fe' }]}>
            <Ionicons name="people" size={28} color={colors.info} />
          </View>
          <Text style={styles.statNumber}>{stats.aspirantes}</Text>
          <Text style={styles.statLabel}>Aspirantes</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f0e7ff' }]}>
            <Ionicons name="briefcase" size={28} color="#8b5cf6" />
          </View>
          <Text style={styles.statNumber}>{stats.reclutadores}</Text>
          <Text style={styles.statLabel}>Reclutadores</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="document-text" size={28} color={colors.success} />
          </View>
          <Text style={styles.statNumber}>{stats.ofertas}</Text>
          <Text style={styles.statLabel}>Ofertas Totales</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fee2e2' }]}>
            <Ionicons name="checkbox" size={28} color={colors.danger} />
          </View>
          <Text style={styles.statNumber}>{stats.ofertasAbiertas}</Text>
          <Text style={styles.statLabel}>Ofertas Abiertas</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#fff7ed' }]}>
            <Ionicons name="send" size={28} color={colors.warning} />
          </View>
          <Text style={styles.statNumber}>{stats.postulaciones}</Text>
          <Text style={styles.statLabel}>Postulaciones</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#f0fdf4' }]}>
            <Ionicons name="time" size={28} color="#22c55e" />
          </View>
          <Text style={styles.statNumber}>{stats.postulacionesActivas}</Text>
          <Text style={styles.statLabel}>En Revisión</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('UsuariosAdmin' as never)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Gestionar Usuarios</Text>
            <Text style={styles.actionSubtitle}>
              Administrar aspirantes y reclutadores
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('OfertasAdmin' as never)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="briefcase-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Gestionar Ofertas</Text>
            <Text style={styles.actionSubtitle}>Administrar ofertas de empleo</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('PostulacionesAdmin' as never)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Gestionar Postulaciones</Text>
            <Text style={styles.actionSubtitle}>Administrar postulaciones</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('HojasDeVidaAdmin' as never)}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="document-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Hojas de Vida</Text>
            <Text style={styles.actionSubtitle}>Ver y gestionar hojas de vida</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={32} color={colors.info} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Acceso Total</Text>
          <Text style={styles.infoText}>
            Como administrador, tienes acceso completo a todas las funcionalidades del
            sistema. Puedes gestionar usuarios, ofertas y postulaciones.
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <Button
        title="Cerrar Sesión"
        onPress={() => logout()}
        variant="danger"
        icon={<Ionicons name="log-out-outline" size={20} color={colors.white} />}
        fullWidth
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.md,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    width: '48%',
    ...shadows.sm,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  actionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.info,
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.info,
    lineHeight: 20,
  },
});

export default DashboardAdminScreen;
