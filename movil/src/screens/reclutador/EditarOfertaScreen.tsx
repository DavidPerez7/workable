import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles } from '../../styles/theme';
import { getOfertaById, updateOferta } from '../../api/oferta';
import type { MisOfertasStackParamList, Oferta } from '../../types';
import type { RouteProp } from '@react-navigation/native';

type RouteProps = RouteProp<MisOfertasStackParamList, 'EditarOferta'>;

const EditarOfertaScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const { ofertaId } = route.params || {};

  const [oferta, setOferta] = useState<Partial<Oferta>>({ titulo: '', descripcion: '', requisitos: '', modalidad: 'PRESENCIAL' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ofertaId) return;
    const load = async () => {
      try {
        const data = await getOfertaById(ofertaId);
        setOferta({
          titulo: data.titulo,
          descripcion: data.descripcion,
          requisitos: data.requisitos,
          modalidad: data.modalidad,
          salario: data.salario,
          tipoContrato: data.tipoContrato,
          nivelEducativo: data.nivelEducativo,
          vacantes: data.vacantes,
        });
      } catch (err: any) {
        Alert.alert('Error', err.message || 'No se pudo cargar la oferta');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ofertaId]);

  const handleSave = async () => {
    if (!ofertaId) return;
    setSaving(true);
    try {
      const payload: Oferta = {
        id: ofertaId,
        titulo: oferta.titulo || '',
        descripcion: oferta.descripcion || '',
        requisitos: oferta.requisitos,
        modalidad: oferta.modalidad as Oferta['modalidad'],
        salario: oferta.salario,
        tipoContrato: oferta.tipoContrato,
        nivelEducativo: oferta.nivelEducativo,
        numeroVacantes: oferta.vacantes,
      } as Oferta;

      await updateOferta(ofertaId, payload);
      Alert.alert('Éxito', 'Oferta actualizada', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ScrollView style={globalStyles.container}><View style={styles.container}><Text style={styles.title}>Cargando...</Text></View></ScrollView>;

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>Editar Oferta</Text>

      <Input label="Título" value={oferta.titulo} onChangeText={(t) => setOferta((s) => ({ ...s, titulo: t }))} />
      <Input label="Descripción" multiline numberOfLines={6} value={oferta.descripcion} onChangeText={(t) => setOferta((s) => ({ ...s, descripcion: t }))} />
      <Input label="Requisitos" multiline numberOfLines={4} value={oferta.requisitos} onChangeText={(t) => setOferta((s) => ({ ...s, requisitos: t }))} />

      <Picker
        label="Modalidad"
        value={oferta.modalidad as string}
        options={[
          { label: 'Presencial', value: 'PRESENCIAL' },
          { label: 'Remoto', value: 'REMOTO' },
          { label: 'Híbrido', value: 'HIBRIDO' },
        ]}
        onValueChange={(v) => setOferta((s) => ({ ...s, modalidad: v as any }))}
      />

      <Input label="Nivel educativo" value={oferta.nivelEducativo} onChangeText={(t) => setOferta((s) => ({ ...s, nivelEducativo: t }))} />
      <Input label="Tipo de contrato" value={oferta.tipoContrato} onChangeText={(t) => setOferta((s) => ({ ...s, tipoContrato: t }))} />
      <Input label="Vacantes" value={oferta.vacantes ? String(oferta.vacantes) : ''} keyboardType="numeric" onChangeText={(t) => setOferta((s) => ({ ...s, vacantes: Number(t) }))} />
      <Input label="Salario" value={oferta.salario ? String(oferta.salario) : ''} keyboardType="numeric" onChangeText={(t) => setOferta((s) => ({ ...s, salario: Number(t) }))} />

      <View style={{ marginTop: spacing.lg }}>
        <Button title="Guardar" onPress={handleSave} loading={saving} fullWidth />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({ container: { padding: spacing.md }, title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text } });

export default EditarOfertaScreen;
