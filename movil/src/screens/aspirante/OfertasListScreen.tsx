import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getOfertasAbiertas } from '../../api/oferta';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows, borderRadius } from '../../styles/theme';
import type { Oferta, OfertasStackParamList } from '../../types';

type NavigationProp = StackNavigationProp<OfertasStackParamList, 'OfertasList'>;

const OfertasListScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [filteredOfertas, setFilteredOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadOfertas = async () => {
    try {
      const data = await getOfertasAbiertas();
      setOfertas(data);
      setFilteredOfertas(data);
    } catch (error: any) {
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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredOfertas(ofertas);
    } else {
      const filtered = ofertas.filter(
        (oferta) =>
          oferta.titulo.toLowerCase().includes(text.toLowerCase()) ||
          oferta.empresa?.nombre.toLowerCase().includes(text.toLowerCase()) ||
          oferta.descripcion?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOfertas(filtered);
    }
  };

  const renderOferta = ({ item }: { item: Oferta }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OfertaDetail', { ofertaId: item.id! })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.titulo}</Text>
        <View style={[styles.badge, item.modalidad === 'REMOTO' ? styles.badgeRemote : styles.badgePresencial]}>
          <Text style={styles.badgeText}>{item.modalidad}</Text>
        </View>
      </View>

      <Text style={styles.empresa}>{item.empresa?.nombre}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="location" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{item.municipio?.nombre || 'Sin ubicación'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="briefcase" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{item.tipoContrato}</Text>
      </View>

      {item.salario && (
        <View style={styles.infoRow}>
          <Ionicons name="cash" size={16} color={colors.success} />
          <Text style={styles.salaryText}>${item.salario.toLocaleString()}</Text>
        </View>
      )}

      <Text style={styles.description} numberOfLines={2}>
        {item.descripcion}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar ofertas..."
          value={searchQuery}
          onChangeText={handleSearch}
          icon="search"
        />
      </View>

      <FlatList
        data={filteredOfertas}
        renderItem={renderOferta}
        keyExtractor={(item) => item.id!.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="briefcase-outline"
            title="No hay ofertas disponibles"
            message="Por el momento no hay ofertas publicadas"
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadOfertas();
          }} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  list: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeRemote: {
    backgroundColor: colors.success + '20',
  },
  badgePresencial: {
    backgroundColor: colors.info + '20',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  empresa: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  salaryText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});

export default OfertasListScreen;
