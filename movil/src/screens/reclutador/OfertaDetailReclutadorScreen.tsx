import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { colors, spacing, fontSize, fontWeight, globalStyles } from '../../styles/theme';

const OfertaDetailReclutadorScreen = () => {
  return <ScrollView style={globalStyles.container}><View style={styles.container}><Text style={styles.title}>Detalle de Oferta</Text><Button title="Ver Postulantes" onPress={() => {}} /></View></ScrollView>;
};

const styles = StyleSheet.create({ container: { padding: spacing.md }, title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text } });

export default OfertaDetailReclutadorScreen;
