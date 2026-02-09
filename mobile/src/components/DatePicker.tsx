import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, fontSize, fontWeight, shadows } from '../styles/theme';

interface DatePickerProps {
  label: string;
  value: string;
  onDateChange: (date: string) => void;
  style?: any;
  placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onDateChange,
  style,
  placeholder = 'Selecciona una fecha',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateChange(formattedDate);
    }
  };

  const displayDate = value
    ? new Date(value).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : placeholder;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="calendar" size={20} color={colors.primary} />
        <Text style={styles.buttonText}>{displayDate}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          onTouchCancel={() => setShowPicker(false)}
        />
      )}
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    ...shadows.sm,
    gap: spacing.md,
  },
  buttonText: {
    fontSize: fontSize.md,
    color: colors.text,
    flex: 1,
  },
});

export default DatePicker;
