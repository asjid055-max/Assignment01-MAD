import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';
import { BorderRadius, Spacing } from '@/constants/theme';

export interface AnimatedSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function AnimatedSkeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}: AnimatedSkeletonProps) {
  const shimmerOpacity = useSharedValue(0.3);
  const backgroundColor = useThemeColor({}, 'backgroundSecondary');

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerOpacity.value, [0.3, 1, 0.3], [0.3, 1, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const borderColor = useThemeColor({}, 'cardBorder');

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <AnimatedSkeleton width="60%" height={16} style={styles.title} />
      <AnimatedSkeleton width="40%" height={12} style={styles.subtitle} />
      <AnimatedSkeleton width="100%" height={14} style={styles.line} />
      <AnimatedSkeleton width="80%" height={14} style={styles.line} />
      <AnimatedSkeleton width="30%" height={20} borderRadius={10} style={styles.tag} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.md,
  },
  line: {
    marginBottom: Spacing.sm,
  },
  tag: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
});
