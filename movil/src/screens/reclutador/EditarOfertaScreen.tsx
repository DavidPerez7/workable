import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, globalStyles } from '../../styles/theme';

const EditarOfertaScreen = () => {
  return <ScrollView style={globalStyles.container}><View style={styles.container}><Text style={styles.title}>Editar Oferta</Text></View></ScrollView>;
};

const styles = StyleSheet.create({ container: { padding: spacing.md }, title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text } });

export default EditarOfertaScreen;
