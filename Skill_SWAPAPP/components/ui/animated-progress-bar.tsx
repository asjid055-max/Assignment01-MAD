import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export interface AnimatedProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  style?: ViewStyle;
  animated?: boolean;
  gradient?: boolean;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}

export function AnimatedProgressBar({
  progress,
  height = 8,
  style,
  animated = true,
  gradient = true,
  color,
  backgroundColor,
  showPercentage = false,
}: AnimatedProgressBarProps) {
  const animatedProgress = useSharedValue(0);
  const themeBackgroundColor = useThemeColor({}, 'backgroundSecondary');
  const themeColor = useThemeColor({}, 'primary');

  const barBackgroundColor = backgroundColor || themeBackgroundColor;
  const barColor = color || themeColor;

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withSpring(progress, {
        damping: 20,
        stiffness: 300,
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    // Clamp progress to [0,1] to avoid interpolation errors
    const clampedProgress = Math.max(0, Math.min(1, animatedProgress.value));
    return {
      width: `${clampedProgress * 100}%`,
    };
  });

  const progressColorAnimatedStyle = useAnimatedStyle(() => {
    // Clamp progress to [0,1] to avoid interpolation errors
    const clampedProgress = Math.max(0, Math.min(1, animatedProgress.value));
    const progressColor = interpolateColor(
      clampedProgress,
      [0, 0.3, 0.7, 1],
      [Colors.light.error, Colors.light.warning, Colors.light.info, Colors.light.success]
    );

    return {
      backgroundColor: progressColor,
    };
  });

  return (
    <Animated.View style={[styles.container, style]}>
      <View
        style={[
          styles.backgroundBar,
          {
            height,
            backgroundColor: barBackgroundColor,
            borderRadius: height / 2,
          },
        ]}
      >
        {gradient ? (
          <Animated.View style={[animatedStyle, styles.progressContainer]}>
            <LinearGradient
              colors={[barColor, Colors.light.primaryLight] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBar,
                {
                  height,
                  borderRadius: height / 2,
                },
              ]}
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              animatedStyle,
              progressColorAnimatedStyle,
              styles.progressBar,
              {
                height,
                borderRadius: height / 2,
              },
            ]}
          />
        )}
      </View>
      
      {showPercentage && (
        <Animated.Text style={styles.percentageText}>
          {Math.round(progress * 100)}%
        </Animated.Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backgroundBar: {
    flex: 1,
    overflow: 'hidden',
  },
  progressContainer: {
    height: '100%',
  },
  progressBar: {
    height: '100%',
    minWidth: 2,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    minWidth: 35,
    textAlign: 'right',
  },
});
