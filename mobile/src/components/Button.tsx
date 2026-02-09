import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...shadows.sm,
    };

    // Size
    if (size === 'small') {
      baseStyle.paddingVertical = spacing.xs;
      baseStyle.paddingHorizontal = spacing.md;
    } else if (size === 'large') {
      baseStyle.paddingVertical = spacing.md;
      baseStyle.paddingHorizontal = spacing.xl;
    } else {
      baseStyle.paddingVertical = spacing.sm;
      baseStyle.paddingHorizontal = spacing.lg;
    }

    // Width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Variant
    if (disabled) {
      baseStyle.backgroundColor = colors.disabled;
    } else {
      switch (variant) {
        case 'primary':
          baseStyle.backgroundColor = colors.primary;
          break;
        case 'secondary':
          baseStyle.backgroundColor = colors.secondary;
          break;
        case 'outline':
          baseStyle.backgroundColor = 'transparent';
          baseStyle.borderWidth = 1;
          baseStyle.borderColor = colors.primary;
          break;
        case 'danger':
          baseStyle.backgroundColor = colors.error;
          break;
        case 'success':
          baseStyle.backgroundColor = colors.success;
          break;
      }
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: fontWeight.semibold,
    };

    // Size
    if (size === 'small') {
      baseStyle.fontSize = fontSize.sm;
    } else if (size === 'large') {
      baseStyle.fontSize = fontSize.lg;
    } else {
      baseStyle.fontSize = fontSize.md;
    }

    // Variant
    if (variant === 'outline') {
      baseStyle.color = colors.primary;
    } else {
      baseStyle.color = colors.white;
    }

    if (disabled) {
      baseStyle.color = colors.textLight;
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
