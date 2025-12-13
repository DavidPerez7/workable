import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getMyPostulaciones } from '../../api/postulacion';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows, borderRadius } from '../../styles/theme';
import type { Postulacion, PostulacionesStackParamList } from '../../types';

type NavigationProp = StackNavigationProp<PostulacionesStackParamList, 'PostulacionesList'>;

const PostulacionesListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPostulaciones = async () => {
    try {
      const data = await getMyPostulaciones();
      setPostulaciones(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadPostulaciones();
  }, []));

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACEPTADO': return colors.success;
      case 'RECHAZADO': return colors.error;
      case 'ENTREVISTA': return colors.warning;
      case 'EN_REVISION': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const renderPostulacion = ({ item }: { item: Postulacion }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PostulacionDetail', { postulacionId: item.id! })}
    >
      <Text style={styles.ofertaTitle}>{item.oferta?.titulo}</Text>
      <Text style={styles.empresa}>{item.oferta?.empresa?.nombre}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: getEstadoColor(item.estado || '') + '20' }]}>
          <Text style={[styles.statusText, { color: getEstadoColor(item.estado || '') }]}>
            {item.estado}
          </Text>
        </View>
      </View>
      <Text style={styles.date}>
        Postulado: {new Date(item.fechaPostulacion || '').toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <Loading />;

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={postulaciones}
        renderItem={renderPostulacion}
        keyExtractor={(item) => item.id!.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="document-text-outline" title="No tienes postulaciones" message="Postúlate a ofertas para verlas aquí" />
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadPostulaciones(); }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: spacing.md, flexGrow: 1 },
  card: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, ...shadows.md },
  ofertaTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  empresa: { fontSize: fontSize.md, color: colors.primary, marginBottom: spacing.sm },
  statusRow: { marginBottom: spacing.xs },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  statusText: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  date: { fontSize: fontSize.sm, color: colors.textSecondary },
});

export default PostulacionesListScreen;
