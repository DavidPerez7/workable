import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllAspirantes, deleteAspirante, createAspirante, updateAspirante } from '../../api/aspirante';
import { getAllReclutadores, deleteReclutador, createReclutador, updateReclutador } from '../../api/reclutador';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import DatePicker from '../../components/DatePicker';
import Picker from '../../components/Picker';
import { colors, spacing, fontSize, fontWeight, globalStyles, shadows } from '../../styles/theme';
import type { Aspirante, Reclutador } from '../../types';

type UserType = 'ASPIRANTE' | 'RECLUTADOR';

const UsuariosAdminScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<UserType>('ASPIRANTE');
  const [aspirantes, setAspirantes] = useState<Aspirante[]>([]);
  const [reclutadores, setReclutadores] = useState<Reclutador[]>([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Aspirante | Reclutador | null>(null);

  // Create/Edit User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Aspirante | Reclutador | null>(null);
  const [createForm, setCreateForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    cargo: '', // for reclutador
    genero: '', // for aspirante - REQUIRED
    fechaNacimiento: '', // REQUIRED
  });

  const loadData = async () => {
    try {
      const [aspirantesData, reclutadoresData] = await Promise.all([
        getAllAspirantes(),
        getAllReclutadores(),
      ]);
      const aspirantesList = Array.isArray(aspirantesData) ? aspirantesData : [];
      const reclutadoresList = Array.isArray(reclutadoresData) ? reclutadoresData : [];
      setAspirantes(aspirantesList);
      setReclutadores(reclutadoresList);
    } catch (error: any) {
      console.error('Error cargando usuarios:', error);
      Alert.alert('Error', error.message || 'Error al cargar usuarios');
      setAspirantes([]);
      setReclutadores([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openUserModal = (user: Aspirante | Reclutador) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setEditingUser(null);
    setCreateForm({
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      telefono: '',
      cargo: '',
      genero: '',
      fechaNacimiento: '',
    });
  };

  const openEditModal = (user: Aspirante | Reclutador) => {
    setEditingUser(user);
    const isAspirante = selectedType === 'ASPIRANTE';
    setCreateForm({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      correo: user.correo || '',
      password: '', // No pre-fill password
      telefono: user.telefono || '',
      cargo: isAspirante ? '' : (user as Reclutador).cargo || '',
      genero: isAspirante ? (user as Aspirante).genero || '' : '',
      fechaNacimiento: (user as any).fechaNacimiento || '',
    });
    setShowCreateModal(true);
  };

  const handleCreateUser = async () => {
    // Validación básica
    if (!createForm.nombre.trim() || !createForm.apellido.trim() || !createForm.correo.trim()) {
      Alert.alert('Validación', 'Por favor completa nombre, apellido y correo');
      return;
    }

    // Validar password solo al crear (no al editar)
    if (!editingUser && !createForm.password.trim()) {
      Alert.alert('Validación', 'La contraseña es obligatoria al crear un usuario');
      return;
    }

    if (selectedType === 'ASPIRANTE') {
      if (!createForm.genero.trim() || !createForm.fechaNacimiento.trim()) {
        Alert.alert('Validación', 'Género y fecha de nacimiento son obligatorios para aspirantes');
        return;
      }
    }

    if (selectedType === 'RECLUTADOR' && !createForm.cargo.trim()) {
      Alert.alert('Validación', 'El cargo es obligatorio para reclutadores');
      return;
    }

    try {
      if (editingUser) {
        // EDITAR usuario existente
        const updateData: any = {
          nombre: createForm.nombre,
          apellido: createForm.apellido,
          correo: createForm.correo,
          telefono: createForm.telefono,
        };

        // Solo incluir password si se proporcionó uno nuevo
        if (createForm.password.trim()) {
          updateData.password = createForm.password;
        }

        if (selectedType === 'ASPIRANTE') {
          updateData.genero = createForm.genero;
          updateData.fechaNacimiento = createForm.fechaNacimiento;
          await updateAspirante(editingUser.id!, updateData);
        } else {
          updateData.cargo = createForm.cargo;
          if (createForm.fechaNacimiento) {
            updateData.fechaNacimiento = createForm.fechaNacimiento;
          }
          await updateReclutador(editingUser.id!, updateData);
        }
        Alert.alert('Éxito', `${selectedType === 'ASPIRANTE' ? 'Aspirante' : 'Reclutador'} actualizado correctamente`);
      } else {
        // CREAR nuevo usuario
        if (selectedType === 'ASPIRANTE') {
          await createAspirante({
            nombre: createForm.nombre,
            apellido: createForm.apellido,
            correo: createForm.correo,
            password: createForm.password,
            telefono: createForm.telefono,
            genero: createForm.genero,
            fechaNacimiento: createForm.fechaNacimiento,
          });
        } else {
          await createReclutador({
            nombre: createForm.nombre,
            apellido: createForm.apellido,
            correo: createForm.correo,
            password: createForm.password,
            telefono: createForm.telefono,
            cargo: createForm.cargo,
            fechaNacimiento: createForm.fechaNacimiento || new Date().toISOString().split('T')[0],
          });
        }
        Alert.alert('Éxito', `${selectedType === 'ASPIRANTE' ? 'Aspirante' : 'Reclutador'} creado correctamente`);
      }
      closeCreateModal();
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || `Error al ${editingUser ? 'actualizar' : 'crear'} usuario`);
    }
  };

  const handleDeleteUser = (user: Aspirante | Reclutador) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Estás seguro de eliminar a ${user.nombre} ${user.apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user.id) return;
              
              if (selectedType === 'ASPIRANTE') {
                await deleteAspirante(user.id);
              } else {
                await deleteReclutador(user.id);
              }
              
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
              closeModal();
              loadData();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar usuario');
            }
          },
        },
      ]
    );
  };

  const renderUserCard = (user: Aspirante | Reclutador, index: number) => {
    const isReclutador = 'cargo' in user;
    return (
      <TouchableOpacity
        key={user.id || index}
        style={styles.userCard}
        onPress={() => openUserModal(user)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userIcon}>
            <Ionicons
              name={isReclutador ? 'briefcase' : 'person'}
              size={32}
              color={colors.primary}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.nombre} {user.apellido}
            </Text>
            <Text style={styles.userEmail}>{user.correo}</Text>
            {isReclutador && (user as Reclutador).cargo && (
              <Text style={styles.userCargo}>{(user as Reclutador).cargo}</Text>
            )}
            {isReclutador && (user as Reclutador).empresa && (
              <Text style={styles.userEmpresa}>
                {(user as Reclutador).empresa?.nombre}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </View>

        <View style={styles.cardFooter}>
          {user.telefono && (
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.telefono}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <Loading />;

  const currentUsers = (selectedType === 'ASPIRANTE' ? aspirantes : reclutadores) || [];

  return (
    <View style={globalStyles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{aspirantes.length}</Text>
            <Text style={styles.statLabel}>Aspirantes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{reclutadores.length}</Text>
            <Text style={styles.statLabel}>Reclutadores</Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'ASPIRANTE' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedType('ASPIRANTE')}
        >
          <Ionicons
            name="person"
            size={20}
            color={selectedType === 'ASPIRANTE' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterText,
              selectedType === 'ASPIRANTE' && styles.filterTextActive,
            ]}
          >
            Aspirantes ({aspirantes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'RECLUTADOR' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedType('RECLUTADOR')}
        >
          <Ionicons
            name="briefcase"
            size={20}
            color={selectedType === 'RECLUTADOR' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.filterText,
              selectedType === 'RECLUTADOR' && styles.filterTextActive,
            ]}
          >
            Reclutadores ({reclutadores.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* User List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {currentUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>
              No hay {selectedType === 'ASPIRANTE' ? 'aspirantes' : 'reclutadores'} registrados
            </Text>
          </View>
        ) : (
          currentUsers.map((user, index) => renderUserCard(user, index))
        )}
      </ScrollView>

      {/* User Detail Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Usuario</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalUserHeader}>
                  <View style={styles.modalUserIcon}>
                    <Ionicons
                      name={selectedType === 'RECLUTADOR' ? 'briefcase' : 'person'}
                      size={48}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.modalUserName}>
                    {selectedUser.nombre} {selectedUser.apellido}
                  </Text>
                  <Text style={styles.modalUserEmail}>{selectedUser.correo}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Información Personal</Text>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Correo</Text>
                      <Text style={styles.modalInfoText}>{selectedUser.correo}</Text>
                    </View>
                  </View>

                  {selectedUser.telefono && (
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Teléfono</Text>
                        <Text style={styles.modalInfoText}>{selectedUser.telefono}</Text>
                      </View>
                    </View>
                  )}

                  {selectedType === 'ASPIRANTE' && (selectedUser as Aspirante).direccion && (
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Dirección</Text>
                        <Text style={styles.modalInfoText}>
                          {(selectedUser as Aspirante).direccion}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedType === 'RECLUTADOR' && (selectedUser as Reclutador).cargo && (
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="briefcase-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Cargo</Text>
                        <Text style={styles.modalInfoText}>
                          {(selectedUser as Reclutador).cargo}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedType === 'RECLUTADOR' && (selectedUser as Reclutador).empresa && (
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="business-outline" size={20} color={colors.textSecondary} />
                      <View style={styles.modalInfoContent}>
                        <Text style={styles.modalInfoLabel}>Empresa</Text>
                        <Text style={styles.modalInfoText}>
                          {(selectedUser as Reclutador).empresa?.nombre}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.dangerZone}>
                  {selectedType === 'ASPIRANTE' && (
                    <Button
                      title="Gestionar Hoja de Vida"
                      variant="primary"
                      icon={<Ionicons name="document-text-outline" size={20} color={colors.white} />}
                      onPress={() => {
                        closeModal();
                        navigation.navigate('AspiranteHojaVida' as never, {
                          aspiranteId: selectedUser.id,
                          aspiranteNombre: `${selectedUser.nombre} ${selectedUser.apellido}`,
                        } as never);
                      }}
                      fullWidth
                      style={{ marginBottom: spacing.md }}
                    />
                  )}
                  <Button
                    title="Editar Usuario"
                    variant="outline"
                    icon={<Ionicons name="pencil-outline" size={20} color={colors.primary} />}
                    onPress={() => {
                      closeModal();
                      openEditModal(selectedUser);
                    }}
                    fullWidth
                    style={{ marginBottom: spacing.md }}
                  />
                  <Text style={styles.dangerTitle}>Zona de Peligro</Text>
                  <Button
                    title="Eliminar Usuario"
                    variant="danger"
                    icon={<Ionicons name="trash-outline" size={20} color={colors.white} />}
                    onPress={() => handleDeleteUser(selectedUser)}
                    fullWidth
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Button title="Cerrar" variant="outline" onPress={closeModal} fullWidth />
            </View>
          </View>
        </View>
      </Modal>

      {/* Create User Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Editar' : 'Crear'} {selectedType === 'ASPIRANTE' ? 'Aspirante' : 'Reclutador'}
              </Text>
              <TouchableOpacity onPress={closeCreateModal}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Nombre *"
                placeholderTextColor={colors.textSecondary}
                value={createForm.nombre}
                onChangeText={(text) => setCreateForm({ ...createForm, nombre: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Apellido *"
                placeholderTextColor={colors.textSecondary}
                value={createForm.apellido}
                onChangeText={(text) => setCreateForm({ ...createForm, apellido: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Correo *"
                placeholderTextColor={colors.textSecondary}
                value={createForm.correo}
                onChangeText={(text) => setCreateForm({ ...createForm, correo: text })}
                keyboardType="email-address"
              />

              <TextInput
                style={styles.input}
                placeholder={editingUser ? "Contrase\u00f1a (dejar vac\u00edo para no cambiar)" : "Contrase\u00f1a *"}
                placeholderTextColor={colors.textSecondary}
                value={createForm.password}
                onChangeText={(text) => setCreateForm({ ...createForm, password: text })}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor={colors.textSecondary}
                value={createForm.telefono}
                onChangeText={(text) => setCreateForm({ ...createForm, telefono: text })}
                keyboardType="phone-pad"
              />

              {selectedType === 'ASPIRANTE' && (
                <>
                  <DatePicker
                    label="Fecha de Nacimiento *"
                    value={createForm.fechaNacimiento}
                    onDateChange={(date) => setCreateForm({ ...createForm, fechaNacimiento: date })}
                  />

                  <Picker
                    label="Género *"
                    selectedValue={createForm.genero || 'MASCULINO'}
                    options={[
                      { label: 'Masculino', value: 'MASCULINO' },
                      { label: 'Femenino', value: 'FEMENINO' },
                      { label: 'Otro', value: 'OTRO' },
                    ]}
                    onValueChange={(value) => setCreateForm({ ...createForm, genero: value })}
                  />
                </>
              )}

              {selectedType === 'RECLUTADOR' && (
                <TextInput
                  style={styles.input}
                  placeholder="Cargo *"
                  placeholderTextColor={colors.textSecondary}
                  value={createForm.cargo}
                  onChangeText={(text) => setCreateForm({ ...createForm, cargo: text })}
                />
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title={editingUser ? "Actualizar" : "Crear"}
                variant="primary"
                onPress={handleCreateUser}
                fullWidth
              />
              <Button
                title="Cancelar"
                variant="outline"
                onPress={closeCreateModal}
                fullWidth
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  filterTextActive: {
    color: colors.white,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  userCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  userCargo: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xs,
  },
  userEmpresa: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  // Modal styles
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
    paddingTop: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  modalUserHeader: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  modalUserIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  modalUserName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  modalUserEmail: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  modalInfoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  modalInfoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  modalInfoText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  dangerZone: {
    backgroundColor: '#fef2f2',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  dangerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.danger,
    marginBottom: spacing.md,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default UsuariosAdminScreen;
