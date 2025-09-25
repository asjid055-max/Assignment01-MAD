import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AnimatedFloatingCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  floatingIntensity?: number;
  floatingDuration?: number;
  delay?: number;
}

export function AnimatedFloatingCard({
  children,
  style,
  floatingIntensity = 8,
  floatingDuration = 3000,
  delay = 0,
}: AnimatedFloatingCardProps) {
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.1);

  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'cardBorder');

  useEffect(() => {
    // Floating animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-floatingIntensity, { duration: floatingDuration / 2 }),
          withTiming(floatingIntensity, { duration: floatingDuration / 2 })
        ),
        -1,
        true
      )
    );

    // Shadow pulsing animation
    shadowOpacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.2, { duration: floatingDuration / 2 }),
          withTiming(0.1, { duration: floatingDuration / 2 })
        ),
        -1,
        true
      )
    );
  }, [delay, floatingIntensity, floatingDuration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    shadowOpacity: shadowOpacity.value,
    elevation: interpolate(shadowOpacity.value, [0.1, 0.2], [2, 8]),
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    ...Shadows.md,
  },
});
