import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getOfertaById } from '../../api/oferta';
import { createPostulacion, getMyPostulaciones } from '../../api/postulacion';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows, borderRadius } from '../../styles/theme';
import type { Oferta, OfertasStackParamList } from '../../types';

type OfertaDetailRouteProp = RouteProp<OfertasStackParamList, 'OfertaDetail'>;

const OfertaDetailScreen = () => {
  const route = useRoute<OfertaDetailRouteProp>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { ofertaId } = route.params;

  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  useEffect(() => {
    loadOferta();
  }, [ofertaId]);

  const loadOferta = async () => {
    try {
      const [data, postulaciones] = await Promise.all([
        getOfertaById(ofertaId),
        getMyPostulaciones(),
      ]);
      setOferta(data);
      
      // Verificar si ya está postulado
      const alreadyApplied = postulaciones.some((p) => p.oferta?.id === ofertaId);
      setIsAlreadyApplied(alreadyApplied);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar oferta');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handlePostular = async () => {
    if (!user) return;

    if (isAlreadyApplied) {
      Alert.alert('Ya postulado', 'Ya te has postulado a esta oferta');
      return;
    }

    Alert.alert(
      'Confirmar postulación',
      '¿Estás seguro que deseas postularte a esta oferta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Postular',
          onPress: async () => {
            setApplying(true);
            try {
              await createPostulacion(ofertaId, user.usuarioId);
              Alert.alert('Éxito', 'Te has postulado exitosamente', [
                { text: 'OK', onPress: () => {
                  setIsAlreadyApplied(true);
                } },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al postular');
            } finally {
              setApplying(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !oferta) {
    return <Loading />;
  }

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{oferta.titulo}</Text>
          <Text style={styles.empresa}>{oferta.empresa?.nombre}</Text>
          <View style={[styles.badge, oferta.modalidad === 'REMOTO' ? styles.badgeRemote : styles.badgePresencial]}>
            <Text style={styles.badgeText}>{oferta.modalidad}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{oferta.municipio?.nombre || 'Sin ubicación'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="briefcase" size={20} color={colors.primary} />
            <Text style={styles.infoText}>{oferta.tipoContrato}</Text>
          </View>

          {oferta.salario && (
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color={colors.success} />
              <Text style={styles.salaryText}>${oferta.salario.toLocaleString()}</Text>
            </View>
          )}

          {oferta.experienciaRequerida !== undefined && (
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                {oferta.experienciaRequerida} años de experiencia
              </Text>
            </View>
          )}

          {oferta.vacantes && (
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{oferta.vacantes} vacantes</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.text}>{oferta.descripcion}</Text>
        </View>

        {oferta.requisitos && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requisitos</Text>
            <Text style={styles.text}>{oferta.requisitos}</Text>
          </View>
        )}

        {oferta.nivelEducativo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nivel Educativo</Text>
            <Text style={styles.text}>{oferta.nivelEducativo}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isAlreadyApplied ? '✓ Ya postulado' : 'Postularme'}
          onPress={handlePostular}
          loading={applying}
          fullWidth
          size="large"
          variant={isAlreadyApplied ? 'outline' : 'primary'}
          disabled={isAlreadyApplied}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    ...shadows.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  empresa: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  badgeRemote: {
    backgroundColor: colors.success + '20',
  },
  badgePresencial: {
    backgroundColor: colors.info + '20',
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  salaryText: {
    fontSize: fontSize.md,
    color: colors.success,
    fontWeight: fontWeight.bold,
    marginLeft: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    ...shadows.lg,
  },
});

export default OfertaDetailScreen;
