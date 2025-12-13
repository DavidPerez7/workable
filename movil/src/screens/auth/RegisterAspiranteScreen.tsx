import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerAspirante } from '../../api/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight } from '../../styles/theme';
import type { AuthStackParamList } from '../../types';

type RegisterAspiranteNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterAspirante'
>;

const RegisterAspiranteScreen = () => {
  const navigation = useNavigation<RegisterAspiranteNavigationProp>();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [genero, setGenero] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async () => {

    if (!nombre || !apellido || !correo || !password || !genero || !fechaNacimiento) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await registerAspirante({
        nombre,
        apellido,
        correo,
        password,
        telefono,
        genero,
        fechaNacimiento,
      });

      Alert.alert('Éxito', 'Registro exitoso. Ahora puedes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Registro de Aspirante</Text>
          <Text style={styles.subtitle}>Crea tu cuenta para postularte a ofertas</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre *"
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
            icon="person"
          />

          <Input
            label="Apellido *"
            placeholder="Tu apellido"
            value={apellido}
            onChangeText={setApellido}
            icon="person"
          />

          <Input
            label="Correo electrónico *"
            placeholder="tu@email.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />


          <Input
            label="Teléfono"
            placeholder="Opcional"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
            icon="call"
          />

          <Text style={{ marginTop: 16, marginBottom: 4, fontWeight: 'bold' }}>Género *</Text>
          <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12 }}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue)}
            >
              <Picker.Item label="Selecciona tu género" value="" />
              <Picker.Item label="Masculino" value="MASCULINO" />
              <Picker.Item label="Femenino" value="FEMENINO" />
              <Picker.Item label="Otro" value="OTRO" />
            </Picker>
          </View>

          <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: 'bold' }}>Fecha de nacimiento *</Text>
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
            <Text style={{ color: fechaNacimiento ? '#000' : '#888' }}>
              {fechaNacimiento ? fechaNacimiento : 'Selecciona tu fecha de nacimiento'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={fechaNacimiento ? new Date(fechaNacimiento) : new Date('2000-01-01')}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  // Formato YYYY-MM-DD
                  const iso = selectedDate.toISOString().split('T')[0];
                  setFechaNacimiento(iso);
                }
              }}
            />
          )}

          <Input
            label="Contraseña *"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            isPassword
            icon="lock-closed"
          />

          <Input
            label="Confirmar contraseña *"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            icon="lock-closed"
          />

          <Button
            title="Registrarse"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={styles.registerButton}
          />

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  loginSection: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  loginLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});

export default RegisterAspiranteScreen;
