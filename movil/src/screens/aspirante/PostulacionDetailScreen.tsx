import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPostulacionById } from '../../api/postulacion';
import Loading from '../../components/Loading';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Postulacion, PostulacionesStackParamList } from '../../types';

type PostulacionDetailRouteProp = RouteProp<PostulacionesStackParamList, 'PostulacionDetail'>;

const PostulacionDetailScreen = () => {
  const route = useRoute<PostulacionDetailRouteProp>();
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading || !postulacion) return <Loading />;

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{postulacion.oferta?.titulo}</Text>
        <Text style={styles.empresa}>{postulacion.oferta?.empresa?.nombre}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <Text style={styles.text}>{postulacion.estado}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fecha de Postulación</Text>
        <Text style={styles.text}>{new Date(postulacion.fechaPostulacion || '').toLocaleDateString()}</Text>
      </View>
      {postulacion.comentarios && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentarios</Text>
          <Text style={styles.text}>{postulacion.comentarios}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  header: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, ...shadows.md },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
  empresa: { fontSize: fontSize.lg, color: colors.primary, marginTop: spacing.xs },
  section: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md, ...shadows.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  text: { fontSize: fontSize.md, color: colors.textSecondary },
});

export default PostulacionDetailScreen;
