import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Text,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { createEstudio, updateEstudio } from '../../api/hojaVida';
import Button from '../../components/Button';
import Input from '../../components/Input';
import DatePicker from '../../components/DatePicker';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Estudio } from '../../types';

interface EstudioFormProps {
  estudio?: Estudio;
  isEditing?: boolean;
}

const CrearEditarEstudioScreen = () => {
  const { user } = useAuth();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const isEditing = route.params?.isEditing || false;
  const estudio = route.params?.estudio as Estudio | undefined;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Estudio>>(
    estudio || {
      institucion: '',
      titulo: '',
      nivelEducativo: 'LICENCIATURA',
      fechaInicio: new Date().toISOString().split('T')[0],
      enCurso: false,
      fechaFin: '',
      descripcion: '',
    }
  );

  const handleSave = async () => {
    // Validaciones
    if (!formData.institucion?.trim()) {
      Alert.alert('Error', 'La institución es requerida');
      return;
    }
    if (!formData.titulo?.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    if (!formData.fechaInicio) {
      Alert.alert('Error', 'La fecha de inicio es requerida');
      return;
    }
    if (!formData.enCurso && !formData.fechaFin) {
      Alert.alert('Error', 'Debe indicar fecha de finalización o marcar como "En curso"');
      return;
    }

    setLoading(true);
    try {
      if (isEditing && estudio?.id) {
        await updateEstudio(estudio.id, formData as Estudio);
        Alert.alert('Éxito', 'Estudio actualizado correctamente');
      } else {
        await createEstudio(formData as Estudio);
        Alert.alert('Éxito', 'Estudio creado correctamente');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar el estudio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.container}>
      <Input
        label="Institución"
        placeholder="Ej: Universidad Nacional de Colombia"
        value={formData.institucion || ''}
        onChangeText={(text) => setFormData({ ...formData, institucion: text })}
      />

      <Input
        label="Título/Carrera"
        placeholder="Ej: Ingeniería en Sistemas"
        value={formData.titulo || ''}
        onChangeText={(text) => setFormData({ ...formData, titulo: text })}
        style={{ marginTop: spacing.md }}
      />

      <View style={{ marginTop: spacing.md }}>
        <Picker
          label="Nivel de Educación"
          options={[
            { label: 'Educación Básica', value: 'EDUCACION_BASICA' },
            { label: 'Educación Media', value: 'EDUCACION_MEDIA' },
            { label: 'Técnico', value: 'TECNICO' },
            { label: 'Tecnólogo', value: 'TECNOLOGO' },
            { label: 'Licenciatura', value: 'LICENCIATURA' },
            { label: 'Especialización', value: 'ESPECIALIZACION' },
            { label: 'Maestría', value: 'MAESTRIA' },
            { label: 'Doctorado', value: 'DOCTORADO' },
          ]}
          selectedValue={formData.nivelEducativo || 'LICENCIATURA'}
          onValueChange={(value) => setFormData({ ...formData, nivelEducativo: value })}
        />
      </View>

      <DatePicker
        label="Fecha de Inicio"
        value={formData.fechaInicio || ''}
        onDateChange={(date) => setFormData({ ...formData, fechaInicio: date })}
        style={{ marginTop: spacing.md }}
      />

      <View style={styles.switchContainer}>
        <Switch
          value={formData.enCurso || false}
          onValueChange={(value) => setFormData({ ...formData, enCurso: value, fechaFin: value ? '' : formData.fechaFin })}
        />
        <Text style={styles.switchLabel}>Actualmente estudiando aquí</Text>
      </View>

      {!formData.enCurso && (
        <DatePicker
          label="Fecha de Finalización"
          value={formData.fechaFin || ''}
          onDateChange={(date) => setFormData({ ...formData, fechaFin: date })}
          style={{ marginTop: spacing.md }}
        />
      )}

      <Input
        label="Descripción (opcional)"
        placeholder="Adiciona información relevante sobre tu estudio"
        value={formData.descripcion || ''}
        onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
        multiline
        numberOfLines={4}
        style={{ marginTop: spacing.md }}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Guardar"
          onPress={handleSave}
          loading={loading}
          fullWidth
        />
        <Button
          title="Cancelar"
          variant="outline"
          onPress={() => navigation.goBack()}
          fullWidth
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </ScrollView>
  );
};

interface TextProps {
  style?: any;
  children?: React.ReactNode;
}

const TextComponent: React.FC<TextProps> = ({ style, children }) => (
  <Text style={style}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadows.sm,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: fontWeight.semibold,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});

export default CrearEditarEstudioScreen;
