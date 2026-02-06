import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles } from '../../styles/theme';
import { getOfertaById } from '../../api/oferta';
import type { MisOfertasStackParamList, Oferta } from '../../types';
import type { RouteProp } from '@react-navigation/native';

type RouteProps = RouteProp<MisOfertasStackParamList, 'OfertaDetailReclutador'>;

const OfertaDetailReclutadorScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { ofertaId } = route.params || {};

  const [oferta, setOferta] = useState<Oferta | null>(null);

  useEffect(() => {
    if (!ofertaId) return;
    const load = async () => {
      try {
        const data = await getOfertaById(ofertaId);
        setOferta(data);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'No se pudo cargar la oferta');
      }
    };
    load();
  }, [ofertaId]);

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>{oferta?.titulo || 'Detalle de Oferta'}</Text>
        <Text style={styles.sub}>{oferta?.empresa?.nombre}</Text>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Ver Postulantes"
            onPress={() => navigation.navigate('PostulantesOferta' as never, { ofertaId } as never)}
            fullWidth
          />
        </View>

        <View style={{ marginTop: spacing.md }}>
          <Button
            title="Editar Oferta"
            onPress={() => navigation.navigate('EditarOferta' as never, { ofertaId } as never)}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
  sub: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
});

export default OfertaDetailReclutadorScreen;
