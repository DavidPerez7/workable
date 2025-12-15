import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPostulacionById } from '../../api/postulacion';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Postulacion, PostulacionesStackParamList } from '../../types';

type PostulacionDetailRouteProp = RouteProp<PostulacionesStackParamList, 'PostulacionDetail'>;

const PostulacionDetailScreen = () => {
  const route = useRoute<PostulacionDetailRouteProp>();
  const navigation = useNavigation();
  const { postulacionId } = route.params;
  const [postulacion, setPostulacion] = useState<Postulacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostulacion();
  }, []);

  const loadPostulacion = async () => {
    try {
      const data = await getPostulacionById(postulacionId);
      setPostulacion(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar postulación');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeStyle = () => {
    const estado = postulacion?.estado?.toUpperCase();
    switch (estado) {
      case 'ACEPTADO':
        return { backgroundColor: colors.success + '20', borderColor: colors.success, textColor: colors.success };
      case 'RECHAZADO':
        return { backgroundColor: colors.danger + '20', borderColor: colors.danger, textColor: colors.danger };
      case 'EN_ESPERA':
      case 'PENDIENTE':
        return { backgroundColor: colors.warning + '20', borderColor: colors.warning, textColor: colors.warning };
      default:
        return { backgroundColor: colors.info + '20', borderColor: colors.info, textColor: colors.info };
    }
  };

  const getEstadoIcon = () => {
    const estado = postulacion?.estado?.toUpperCase();
    switch (estado) {
      case 'ACEPTADO':
        return 'checkmark-circle';
      case 'RECHAZADO':
        return 'close-circle';
      case 'EN_ESPERA':
      case 'PENDIENTE':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  if (loading || !postulacion) return <Loading />;

  const estadoBadge = getEstadoBadgeStyle();

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{postulacion.oferta?.titulo}</Text>
        <Text style={styles.empresa}>{postulacion.oferta?.empresa?.nombre}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: estadoBadge.backgroundColor, borderColor: estadoBadge.borderColor, borderWidth: 1 }]}>
          <Iconicons name={getEstadoIcon()} size={16} color={estadoBadge.textColor} />
          <Text style={[styles.estadoText, { color: estadoBadge.textColor }]}>
            {postulacion.estado ? postulacion.estado.replace(/_/g, ' ') : 'DESCONOCIDO'}
          </Text>
        </View>
      </View>

      {/* Info General */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información de Postulación</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.infoLabel}>Fecha de Postulación</Text>
          </View>
          <Text style={styles.infoValue}>
            {new Date(postulacion.fechaPostulacion || '').toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {postulacion.fechaRespuesta && (
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="checkmark-done" size={20} color={colors.success} />
              <Text style={styles.infoLabel}>Fecha de Respuesta</Text>
            </View>
            <Text style={styles.infoValue}>
              {new Date(postulacion.fechaRespuesta).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Detalle de Oferta */}
      {postulacion.oferta && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Oferta</Text>

          {postulacion.oferta.descripcion && (
            <View style={styles.detailBlock}>
              <Text style={styles.blockTitle}>Descripción</Text>
              <Text style={styles.blockText}>{postulacion.oferta.descripcion}</Text>
            </View>
          )}

          {postulacion.oferta.requisitos && (
            <View style={styles.detailBlock}>
              <Text style={styles.blockTitle}>Requisitos</Text>
              <Text style={styles.blockText}>{postulacion.oferta.requisitos}</Text>
            </View>
          )}

          <View style={styles.infoGrid}>
            {postulacion.oferta.tipoContrato && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Tipo de Contrato</Text>
                <Text style={styles.gridValue}>{postulacion.oferta.tipoContrato}</Text>
              </View>
            )}
            {postulacion.oferta.modalidad && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Modalidad</Text>
                <Text style={styles.gridValue}>{postulacion.oferta.modalidad}</Text>
              </View>
            )}
            {postulacion.oferta.salario && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Salario</Text>
                <Text style={[styles.gridValue, { color: colors.success }]}>${postulacion.oferta.salario.toLocaleString()}</Text>
              </View>
            )}
            {postulacion.oferta.experienciaRequerida !== undefined && (
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Experiencia</Text>
                <Text style={styles.gridValue}>{postulacion.oferta.experienciaRequerida} años</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Comentarios/Feedback */}
      {postulacion.comentarios && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentarios del Reclutador</Text>
          <View style={styles.commentBox}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
            <Text style={styles.commentText}>{postulacion.comentarios}</Text>
          </View>
        </View>
      )}

      {/* Sin comentarios */}
      {!postulacion.comentarios && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentarios</Text>
          <Text style={styles.emptyText}>No hay comentarios aún</Text>
        </View>
      )}

      {/* Estado Info */}
      <View style={[styles.section, styles.statusInfoSection]}>
        <View style={styles.statusIndicator}>
          <Ionicons name={getEstadoIcon()} size={32} color={estadoBadge.textColor} />
          <Text style={[styles.statusTitle, { color: estadoBadge.textColor }]}>
            {postulacion.estado === 'ACEPTADO'
              ? '¡Felicitaciones! Fuiste aceptado'
              : postulacion.estado === 'RECHAZADO'
              ? 'Tu postulación fue rechazada'
              : postulacion.estado === 'EN_ESPERA' || postulacion.estado === 'PENDIENTE'
              ? 'Tu postulación está en revisión'
              : 'Tu postulación está en proceso'}
          </Text>
        </View>
      </View>

      {/* Botones de Acción */}
      <View style={styles.actions}>
        <Button title="Atrás" variant="outline" onPress={() => navigation.goBack()} fullWidth />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  empresa: {
    fontSize: fontSize.lg,
    color: colors.primary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.semibold,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  estadoText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  detailBlock: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  blockText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  gridValue: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  commentBox: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    gap: spacing.md,
  },
  commentText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  statusInfoSection: {
    alignItems: 'center',
  },
  statusIndicator: {
    alignItems: 'center',
    gap: spacing.md,
  },
  statusTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});

export default PostulacionDetailScreen;

