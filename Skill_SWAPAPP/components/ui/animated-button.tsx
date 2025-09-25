import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

export interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  hapticFeedback = true,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const backgroundColor = useThemeColor({}, 'buttonPrimary');
  const textColor = useThemeColor({}, 'textInverse');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const colors = {
      primary: [Colors.light.primary, Colors.light.primaryDark],
      secondary: [Colors.light.secondary, Colors.light.secondaryDark],
      danger: [Colors.light.error, '#DC2626'],
      success: [Colors.light.success, '#059669'],
      ghost: [Colors.light.background, Colors.light.background],
    };

    const backgroundColor = interpolateColor(
      scale.value,
      [0.95, 1],
      colors[variant]
    );

    return { backgroundColor };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
      ...Shadows.md,
    };

    // Add border for ghost variant
    if (variant === 'ghost') {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = Colors.light.border;
    }

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        minHeight: 56,
      },
    };

    return { ...baseStyle, ...sizeStyles[size] };
  };

  // Note: do not call hooks inside non-hook functions.
  // Keep color selection inline where used to avoid invalid hook usage.

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Animated.View style={[backgroundAnimatedStyle, getButtonStyle()]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={styles.touchable}
          activeOpacity={0.8}
        >
          {loading ? (
            <ThemedText type="button" color="textInverse" style={textStyle}>
              Loading...
            </ThemedText>
          ) : (
            <>
              {icon && <>{icon}</>}
              <ThemedText
                type="button"
                color={variant === 'ghost' ? 'text' : 'textInverse'}
                style={[
                  textStyle,
                  icon ? { marginLeft: Spacing.sm } : undefined,
                ]}
              >
                {title}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
