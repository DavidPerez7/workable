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
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors, spacing, fontSize, fontWeight } from '../../styles/theme';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!correo) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);
    try {
      // Aquí iría la lógica de recuperación de contraseña
      // Por ahora solo simulamos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Correo enviado',
        'Si el correo existe en nuestra base de datos, recibirás instrucciones para recuperar tu contraseña.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al enviar correo');
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
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />

          <Button
            title="Enviar instrucciones"
            onPress={handleResetPassword}
            loading={loading}
            fullWidth
            style={styles.resetButton}
          />

          <View style={styles.backSection}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backLink}>Volver al inicio de sesión</Text>
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
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  resetButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backSection: {
    alignItems: 'center',
  },
  backLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});

export default ForgotPasswordScreen;
