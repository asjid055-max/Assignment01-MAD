import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing, Shadows, Gradients } from '@/constants/theme';

export interface AnimatedGradientButtonProps {
  title: string;
  onPress: () => void;
  gradient?: keyof typeof Gradients;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  hapticFeedback?: boolean;
}

export function AnimatedGradientButton({
  title,
  onPress,
  gradient = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  hapticFeedback = true,
}: AnimatedGradientButtonProps) {
  const scale = useSharedValue(1);
  const textColor = useThemeColor({}, 'textInverse');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

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
      overflow: 'hidden',
      ...Shadows.md,
    };

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

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={styles.touchable}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Gradients[gradient] as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[getButtonStyle(), { opacity: disabled ? 0.6 : 1 }]}
        >
          {loading ? (
            <ThemedText type="button" color="textInverse">
              Loading...
            </ThemedText>
          ) : (
            <>
              {icon && <>{icon}</>}
              <ThemedText
                type="button"
                color="textInverse"
                style={[
                  styles.text,
                  icon ? { marginLeft: Spacing.sm } : undefined,
                ]}
              >
                {title}
              </ThemedText>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  text: {
    textAlign: 'center',
  },
});
