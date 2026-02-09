import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
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
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerReclutador, login as loginApi } from '../../api/auth';
import { createEmpresa } from '../../api/empresa';
import { updateReclutadorWithActual } from '../../api/reclutador';
import { getAllMunicipios } from '../../api/municipio';
import { setAuthToken } from '../../api/config';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight } from '../../styles/theme';
import type { AuthStackParamList, Municipio } from '../../types';

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
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Datos de la empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [descripcionEmpresa, setDescripcionEmpresa] = useState('');
  const [nitEmpresa, setNitEmpresa] = useState('');
  const [direccionEmpresa, setDireccionEmpresa] = useState('');
  const [telefonoEmpresa, setTelefonoEmpresa] = useState('');
  const [correoEmpresa, setCorreoEmpresa] = useState('');
  const [numeroTrabajadores, setNumeroTrabajadores] = useState('');
  const [municipioId, setMunicipioId] = useState<number>(1);

  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar municipios al montar el componente
  useEffect(() => {
    const loadMunicipios = async () => {
      try {
        const data = await getAllMunicipios();
        setMunicipios(data);
      } catch (error) {
        console.error('Error al cargar municipios:', error);
      }
    };
    loadMunicipios();
  }, []);

  const handleRegister = async () => {
    if (!nombre || !apellido || !correo || !password || !nombreEmpresa || !descripcionEmpresa || !fechaNacimiento) {
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
      // Paso 1: Registrar el reclutador
      console.log('Registrando reclutador...');
      await registerReclutador({
        nombre,
        apellido,
        correo,
        password,
        telefono,
        cargo,
        fechaNacimiento,
        empresa: {
          nombre: nombreEmpresa,
          nit: nitEmpresa,
          direccion: direccionEmpresa,
          telefono: telefonoEmpresa,
          correo: correoEmpresa,
        },
      });

      // Paso 2: Iniciar sesión automáticamente para obtener token
      console.log('Iniciando sesión automática...');
      const loginResponse = await loginApi({ correo, password });
      console.log('Login response:', loginResponse);
      setAuthToken(loginResponse.token);
      
      // Paso 3: Crear la empresa con autenticación y asociar al reclutador
      console.log('Creando empresa...');
      const reclutadorId = loginResponse.usuarioId;
      const empresaData = {
        nombre: nombreEmpresa,
        descripcion: descripcionEmpresa,
        nit: nitEmpresa || undefined,
        direcciones: direccionEmpresa ? [direccionEmpresa] : [],
        telefonoContacto: telefonoEmpresa || undefined,
        emailContacto: correoEmpresa || undefined,
        numeroTrabajadores: numeroTrabajadores ? parseInt(numeroTrabajadores) : 1,
        isActive: true,
        reclutadorOwner: { id: reclutadorId },
        municipio: { id: municipioId },
      };
      const empresaCreada = await createEmpresa(empresaData);

      // Guardar empresa localmente para hidratar en el próximo login si el backend no la devuelve
      try {
        await SecureStore.setItemAsync(
          `workable_empresa_${correo.toLowerCase()}`,
          JSON.stringify({ id: empresaCreada.id, nombre: empresaCreada.nombre })
        );
      } catch (storeErr) {
        console.warn('No se pudo guardar empresa localmente:', storeErr);
      }

      // Paso 4: Asociar el reclutador a la empresa usando el endpoint con reclutadorIdActual
      console.log('Asociando empresa al reclutador...');
      try {
        await updateReclutadorWithActual(
          reclutadorId,
          {
            nombre,
            apellido,
            correo,
            telefono,
            cargo,
            fechaNacimiento,
            empresa: { id: empresaCreada.id },
            // Enviamos también el identificador plano por si el backend lo espera como empresaId
            // Esto evita que la empresa quede sin asociar al reclutador
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            empresaId: empresaCreada.id,
          } as any,
          reclutadorId
        );
        console.log('Empresa asociada exitosamente');
      } catch (updateError) {
        console.error('Error al asociar empresa, pero continuando:', updateError);
        // Continuar de todas formas ya que la empresa fue creada
      }

      // Limpiar el token temporal
      setAuthToken(null);

      Alert.alert(
        'Éxito', 
        'Registro exitoso. Tu empresa "' + nombreEmpresa + '" ha sido creada.\n\nPor favor inicia sesión para continuar.', 
        [{ text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.error('Error en registro:', error);
      Alert.alert('Error', error.message || 'Error al registrar. Intenta iniciar sesión si ya te registraste.');
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
            label="Descripción de la empresa *"
            placeholder="Breve descripción de la empresa"
            value={descripcionEmpresa}
            onChangeText={setDescripcionEmpresa}
            multiline
            icon="document-text"
          />

          <Input
            label="NIT"
            placeholder="Opcional"
            value={nitEmpresa}
            onChangeText={setNitEmpresa}
            icon="document-text"
          />

          <Input
            label="Número de trabajadores"
            placeholder="Ej: 50"
            value={numeroTrabajadores}
            onChangeText={setNumeroTrabajadores}
            keyboardType="numeric"
            icon="people"
          />

          <Input
            label="Dirección"
            placeholder="Dirección de la empresa"
            value={direccionEmpresa}
            onChangeText={setDireccionEmpresa}
            icon="location"
          />

          <Text style={styles.label}>Municipio *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={municipioId}
              onValueChange={(itemValue) => setMunicipioId(itemValue as number)}
              style={styles.picker}
            >
              {municipios.map((municipio) => (
                <Picker.Item
                  key={municipio.id}
                  label={`${municipio.nombre} - ${municipio.departamento}`}
                  value={municipio.id}
                />
              ))}
            </Picker>
          </View>

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
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
});

export default RegisterReclutadorScreen;
