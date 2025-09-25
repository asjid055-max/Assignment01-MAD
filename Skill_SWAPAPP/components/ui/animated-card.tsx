import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

export interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  hapticFeedback?: boolean;
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  onPress,
  style,
  hapticFeedback = true,
  disabled = false,
}: AnimatedCardProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'cardBorder');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: shadowOpacity.value,
      elevation: shadowOpacity.value * 8,
    };
  });

  const handlePressIn = () => {
    if (!disabled && onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
      shadowOpacity.value = withTiming(0.2, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      shadowOpacity.value = withTiming(0.1, { duration: 150 });
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor,
    borderWidth: 1,
    borderColor,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  };

  if (onPress && !disabled) {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Animated.View style={[cardStyle, shadowAnimatedStyle]}>
          <TouchableOpacity
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.touchable}
            activeOpacity={0.9}
          >
            {children}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[cardStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
});
