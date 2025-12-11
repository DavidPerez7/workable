import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [fechaLimite, setFechaLimite] = useState('');
  const [nivelExperiencia, setNivelExperiencia] = useState('');
  const [modalidad, setModalidad] = useState('PRESENCIAL');
  const [tipoContrato, setTipoContrato] = useState('TIEMPO_COMPLETO');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCrear = async () => {
    if (!titulo || !descripcion || !fechaLimite || !nivelExperiencia || !salario) {
      Alert.alert('Error', 'Completa los campos requeridos');
      return;
    }

    if (!user?.empresaId || !user?.reclutadorId) {
      Alert.alert('Error', 'Debes tener una empresa asociada para crear ofertas. Por favor, completa tu perfil primero.');
      return;
    }

    setLoading(true);
    try {
      // Convertir requisitos de string a array (separado por comas o saltos de línea)
      const requisitosArray = requisitos
        .split(/[,\n]+/)
        .map(r => r.trim())
        .filter(r => r.length > 0);

      await createOferta({
        titulo,
        descripcion,
        requisitos: requisitosArray.length > 0 ? requisitosArray : undefined,
        salario: parseFloat(salario),
        vacantes: vacantes ? parseInt(vacantes) : 1,
        fechaLimite,
        nivelExperiencia,
        tipoContrato,
        modalidad,
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
        <Input label="Requisitos" value={requisitos} onChangeText={setRequisitos} placeholder="Separa con comas o saltos de línea" multiline numberOfLines={3} />
        <Input label="Salario *" value={salario} onChangeText={setSalario} placeholder="Ej: 3000000" keyboardType="numeric" />
        <Input label="Vacantes" value={vacantes} onChangeText={setVacantes} placeholder="Número de vacantes (por defecto 1)" keyboardType="numeric" />
        
        <Text style={{ marginTop: 16, marginBottom: 4, fontWeight: 'bold' }}>Modalidad *</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 }}>
          <Picker
            selectedValue={modalidad}
            onValueChange={(itemValue) => setModalidad(itemValue)}
          >
            <Picker.Item label="Presencial" value="PRESENCIAL" />
            <Picker.Item label="Remoto" value="REMOTO" />
            <Picker.Item label="Híbrido" value="HIBRIDO" />
          </Picker>
        </View>
        
        <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: 'bold' }}>Tipo de contrato *</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 }}>
          <Picker
            selectedValue={tipoContrato}
            onValueChange={(itemValue) => setTipoContrato(itemValue)}
          >
            <Picker.Item label="Tiempo completo" value="TIEMPO_COMPLETO" />
            <Picker.Item label="Medio tiempo" value="MEDIO_TIEMPO" />
            <Picker.Item label="Temporal" value="TEMPORAL" />
            <Picker.Item label="Prestación de servicios" value="PRESTACION_SERVICIOS" />
            <Picker.Item label="Prácticas" value="PRACTICAS" />
          </Picker>
        </View>
        
        <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: 'bold' }}>Nivel de experiencia *</Text>
        <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 }}>
          <Picker
            selectedValue={nivelExperiencia}
            onValueChange={(itemValue) => setNivelExperiencia(itemValue)}
          >
            <Picker.Item label="Selecciona el nivel" value="" />
            <Picker.Item label="Sin experiencia" value="SIN_EXPERIENCIA" />
            <Picker.Item label="Básico" value="BASICO" />
            <Picker.Item label="Intermedio" value="INTERMEDIO" />
            <Picker.Item label="Avanzado" value="AVANZADO" />
            <Picker.Item label="Experto" value="EXPERTO" />
          </Picker>
        </View>
        
        <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: 'bold' }}>Fecha límite *</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: fechaLimite ? '#000' : '#888' }}>
            {fechaLimite ? fechaLimite : 'Selecciona la fecha límite'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fechaLimite ? new Date(fechaLimite) : new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const iso = selectedDate.toISOString().split('T')[0];
                setFechaLimite(iso);
              }
            }}
          />
        )}
        
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
