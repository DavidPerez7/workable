import React, { useState } from 'react';
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
import { registerReclutador } from '../../api/auth';
import { createEmpresa } from '../../api/empresa';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight } from '../../styles/theme';
import type { AuthStackParamList } from '../../types';

type RegisterReclutadorNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterReclutador'
>;

const RegisterReclutadorScreen = () => {
  const navigation = useNavigation<RegisterReclutadorNavigationProp>();

  // Datos del reclutador
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargo, setCargo] = useState('');

  // Datos de la empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [nitEmpresa, setNitEmpresa] = useState('');
  const [direccionEmpresa, setDireccionEmpresa] = useState('');
  const [telefonoEmpresa, setTelefonoEmpresa] = useState('');
  const [correoEmpresa, setCorreoEmpresa] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !apellido || !correo || !password || !nombreEmpresa) {
      Alert.alert('Error', 'Por favor completa los campos requeridos');
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
      // Primero crear la empresa
      const empresa = await createEmpresa({
        nombre: nombreEmpresa,
        nit: nitEmpresa,
        direccion: direccionEmpresa,
        telefono: telefonoEmpresa,
        correo: correoEmpresa,
      });

      // Luego crear el reclutador asociado a la empresa
      await registerReclutador({
        nombre,
        apellido,
        correo,
        password,
        telefono,
        cargo,
        empresa: { id: empresa.id },
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
          <Text style={styles.title}>Registro de Reclutador</Text>
          <Text style={styles.subtitle}>Crea tu cuenta y registra tu empresa</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Datos del Reclutador</Text>

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

          <Input
            label="Cargo"
            placeholder="Ej: Gerente de RRHH"
            value={cargo}
            onChangeText={setCargo}
            icon="briefcase"
          />

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

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Datos de la Empresa</Text>

          <Input
            label="Nombre de la empresa *"
            placeholder="Ej: Acme Corp"
            value={nombreEmpresa}
            onChangeText={setNombreEmpresa}
            icon="business"
          />

          <Input
            label="NIT"
            placeholder="Opcional"
            value={nitEmpresa}
            onChangeText={setNitEmpresa}
            icon="document-text"
          />

          <Input
            label="Dirección"
            placeholder="Dirección de la empresa"
            value={direccionEmpresa}
            onChangeText={setDireccionEmpresa}
            icon="location"
          />

          <Input
            label="Teléfono de la empresa"
            placeholder="Opcional"
            value={telefonoEmpresa}
            onChangeText={setTelefonoEmpresa}
            keyboardType="phone-pad"
            icon="call"
          />

          <Input
            label="Correo de la empresa"
            placeholder="contacto@empresa.com"
            value={correoEmpresa}
            onChangeText={setCorreoEmpresa}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  loginSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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

export default RegisterReclutadorScreen;
