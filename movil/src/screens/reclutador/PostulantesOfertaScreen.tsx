import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, globalStyles } from '../../styles/theme';

const PostulantesOfertaScreen = () => {
  return <ScrollView style={globalStyles.container}><View style={styles.container}><Text style={styles.title}>Postulantes</Text></View></ScrollView>;
};

const styles = StyleSheet.create({ container: { padding: spacing.md }, title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text } });

export default PostulantesOfertaScreen;
