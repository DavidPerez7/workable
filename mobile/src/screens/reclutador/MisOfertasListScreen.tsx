import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getOfertasByReclutador, getOfertasByEmpresa } from '../../api/oferta';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows, borderRadius } from '../../styles/theme';
import type { Oferta } from '../../types';

const MisOfertasListScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOfertas = async () => {
    try {
      if (!user) {
        setOfertas([]);
        return;
      }

      if (user.empresaId) {
        const data = await getOfertasByEmpresa(user.empresaId);
        setOfertas(Array.isArray(data) ? data : []);
      } else if (user.reclutadorId) {
        const data = await getOfertasByReclutador(user.reclutadorId);
        setOfertas(Array.isArray(data) ? data : []);
      } else {
        setOfertas([]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadOfertas(); }, [user?.empresaId, user?.reclutadorId]));

  const renderOferta = ({ item }: { item: Oferta }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (!item.id) {
          Alert.alert('Error', 'ID de oferta inválido');
          return;
        }
        navigation.navigate('OfertaDetailReclutador' as never, { ofertaId: item.id } as never);
      }}
    >
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <View style={[styles.badge, item.estado === 'ABIERTA' ? styles.badgeOpen : styles.badgeClosed]}>
        <Text style={styles.badgeText}>{item.estado}</Text>
      </View>
      <Text style={styles.text}>Vacantes: {item.vacantes || 0}</Text>
      <Text style={styles.text}>Modalidad: {item.modalidad}</Text>
    </TouchableOpacity>
  );

  if (loading) return <Loading />;

  return (
    <View style={globalStyles.container}>
      <View style={styles.headerActions}>
        <Text style={styles.headerTitle}>Mis Ofertas</Text>
        <Button title="Crear oferta" onPress={() => navigation.navigate('CrearOfertaTab' as never)} />
      </View>

      <FlatList
        data={ofertas}
        renderItem={renderOferta}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-outline"
            title={user ? 'No tienes ofertas publicadas' : 'Usuario no identificado'}
            message={user ? 'Crea una oferta para empezar' : 'Inicia sesión para ver tus ofertas'}
            action={
              <Button title="Crear oferta" onPress={() => navigation.navigate('CrearOfertaTab' as never)} />
            }
          />
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadOfertas(); }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: spacing.md, flexGrow: 1 },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, ...shadows.md },
  cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm, marginBottom: spacing.sm },
  badgeOpen: { backgroundColor: colors.success + '20' },
  badgeClosed: { backgroundColor: colors.error + '20' },
  badgeText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  text: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 },
});

export default MisOfertasListScreen;
