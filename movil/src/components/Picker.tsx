import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { colors, spacing, fontSize, fontWeight, shadows } from '../styles/theme';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label: string;
  options: PickerOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
  placeholder?: string;
}

const Picker: React.FC<PickerProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  style,
  placeholder,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <RNPicker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {placeholder && (
            <RNPicker.Item label={placeholder} value="" />
          )}
          {options.map((option) => (
            <RNPicker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RNPicker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...shadows.sm,
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: fontSize.md,
    color: colors.text,
  },
});

export default Picker;
