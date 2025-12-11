import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { createOferta } from '../../api/oferta';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight, globalStyles } from '../../styles/theme';

const CrearOfertaScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [salario, setSalario] = useState('');
  const [vacantes, setVacantes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrear = async () => {
    if (!titulo || !descripcion) {
      Alert.alert('Error', 'Completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      await createOferta({
        titulo,
        descripcion,
        requisitos,
        salario: salario ? parseFloat(salario) : undefined,
        vacantes: vacantes ? parseInt(vacantes) : 1,
        tipoContrato: 'TIEMPO_COMPLETO',
        modalidad: 'PRESENCIAL',
        estado: 'ABIERTA',
        empresa: { id: user?.empresaId },
        reclutador: { id: user?.reclutadorId },
      });

      Alert.alert('Éxito', 'Oferta creada exitosamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Crear Nueva Oferta</Text>
        <Input label="Título *" value={titulo} onChangeText={setTitulo} placeholder="Ej: Desarrollador Full Stack" />
        <Input label="Descripción *" value={descripcion} onChangeText={setDescripcion} placeholder="Describe la oferta" multiline numberOfLines={4} />
        <Input label="Requisitos" value={requisitos} onChangeText={setRequisitos} placeholder="Requisitos del cargo" multiline numberOfLines={3} />
        <Input label="Salario" value={salario} onChangeText={setSalario} placeholder="Opcional" keyboardType="numeric" />
        <Input label="Vacantes" value={vacantes} onChangeText={setVacantes} placeholder="Número de vacantes" keyboardType="numeric" />
        <Button title="Crear Oferta" onPress={handleCrear} loading={loading} fullWidth />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.md },
  form: { backgroundColor: colors.white, padding: spacing.lg, borderRadius: 12 },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.lg },
});

export default CrearOfertaScreen;
