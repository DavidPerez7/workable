import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DatePicker from './DatePicker';
import Picker from './Picker';
import Input from './Input';
import Button from './Button';
import { colors, spacing, fontSize, fontWeight, shadows } from '../styles/theme';

interface EstudioModalProps {
  visible: boolean;
  estudio?: any;
  isEditing?: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const EstudioModal: React.FC<EstudioModalProps> = ({
  visible,
  estudio,
  isEditing,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(
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
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.institucion?.trim()) {
      Alert.alert('Error', 'La institución es requerida');
      return;
    }
    if (!formData.titulo?.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    if (!formData.enCurso && !formData.fechaFin) {
      Alert.alert('Error', 'Indique fecha de fin o marque como "En curso"');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      setFormData({
        institucion: '',
        titulo: '',
        nivelEducativo: 'LICENCIATURA',
        fechaInicio: new Date().toISOString().split('T')[0],
        enCurso: false,
        fechaFin: '',
        descripcion: '',
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEditing ? 'Editar Estudio' : 'Agregar Estudio'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Input
              label="Institución"
              placeholder="Ej: Universidad Nacional"
              value={formData.institucion || ''}
              onChangeText={(text) => setFormData({ ...formData, institucion: text })}
            />

            <Input
              label="Título"
              placeholder="Ej: Ingeniería de Sistemas"
              value={formData.titulo || ''}
              onChangeText={(text) => setFormData({ ...formData, titulo: text })}
              style={{ marginTop: spacing.md }}
            />

            <View style={{ marginTop: spacing.md }}>
              <Picker
                label="Nivel de Educación"
                options={[
                  { label: 'Básico', value: 'EDUCACION_BASICA' },
                  { label: 'Medio', value: 'EDUCACION_MEDIA' },
                  { label: 'Técnico', value: 'TECNICO' },
                  { label: 'Tecnólogo', value: 'TECNOLOGO' },
                  { label: 'Licenciatura', value: 'LICENCIATURA' },
                  { label: 'Especialización', value: 'ESPECIALIZACION' },
                  { label: 'Maestría', value: 'MAESTRIA' },
                  { label: 'Doctorado', value: 'DOCTORADO' },
                ]}
                selectedValue={formData.nivelEducativo}
                onValueChange={(value) => setFormData({ ...formData, nivelEducativo: value })}
              />
            </View>

            <DatePicker
              label="Fecha de Inicio"
              value={formData.fechaInicio}
              onDateChange={(date) => setFormData({ ...formData, fechaInicio: date })}
              style={{ marginTop: spacing.md }}
            />

            <View style={styles.switchContainer}>
              <Switch
                value={formData.enCurso || false}
                onValueChange={(value) =>
                  setFormData({ ...formData, enCurso: value, fechaFin: value ? '' : formData.fechaFin })
                }
              />
              <Text style={styles.switchLabel}>Actualmente estudiando</Text>
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
              placeholder="Detalles adicionales"
              value={formData.descripcion || ''}
              onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
              multiline
              numberOfLines={3}
              style={{ marginTop: spacing.md }}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button title="Cancelar" variant="outline" onPress={onClose} style={{ flex: 1 }} />
            <Button
              title="Guardar"
              onPress={handleSave}
              loading={loading}
              style={{ flex: 1, marginLeft: spacing.sm }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: fontWeight.semibold,
  },
});

// Similar components for Experiencia and Habilidad can be created following the same pattern
