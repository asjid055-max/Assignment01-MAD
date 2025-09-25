import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Gradients, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AnimatedLoadingScreenProps {
  message?: string;
  style?: ViewStyle;
  variant?: 'default' | 'dots' | 'pulse' | 'wave';
  size?: 'small' | 'medium' | 'large';
}

export function AnimatedLoadingScreen({
  message = 'Loading...',
  style,
  variant = 'default',
  size = 'medium',
}: AnimatedLoadingScreenProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    // Scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    // Rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1,
      false
    );

    // Opacity animation
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: Typography.sm };
      case 'large':
        return { width: 80, height: 80, fontSize: Typography.lg };
      default:
        return { width: 60, height: 60, fontSize: Typography.base };
    }
  };

  const sizeStyles = getSizeStyles();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={size} />;
      case 'pulse':
        return <PulseLoader size={size} />;
      case 'wave':
        return <WaveLoader size={size} />;
      default:
        return (
          <Animated.View style={[styles.spinner, sizeStyles, animatedStyle]}>
            <LinearGradient
              colors={Gradients.primary as [string, string, ...string[]]}
              style={[styles.spinnerGradient, sizeStyles]}
            />
          </Animated.View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={styles.content}>
        {renderLoadingIndicator()}
        <Animated.View style={animatedStyle}>
          <ThemedText type="bodyLarge" color="textSecondary" style={styles.message}>
            {message}
          </ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}

// Dots loader component
function DotsLoader({ size }: { size: 'small' | 'medium' | 'large' }) {
  const dotSize = size === 'small' ? 8 : size === 'large' ? 16 : 12;
  const dots = [0, 1, 2];

  return (
    <View style={styles.dotsContainer}>
      {dots.map((index) => (
        <AnimatedDot key={index} delay={index * 200} size={dotSize} />
      ))}
    </View>
  );
}

function AnimatedDot({ delay, size }: { delay: number; size: number }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.5, { duration: 400 })
        ),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
      ]}
    />
  );
}

// Pulse loader component
function PulseLoader({ size }: { size: 'small' | 'medium' | 'large' }) {
  const pulseSize = size === 'small' ? 30 : size === 'large' ? 70 : 50;
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(0.8, { duration: 800 })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          width: pulseSize,
          height: pulseSize,
          borderRadius: pulseSize / 2,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={Gradients.primary as [string, string, ...string[]]}
        style={[
          styles.pulseGradient,
          {
            width: pulseSize,
            height: pulseSize,
            borderRadius: pulseSize / 2,
          },
        ]}
      />
    </Animated.View>
  );
}

// Wave loader component
function WaveLoader({ size }: { size: 'small' | 'medium' | 'large' }) {
  const barHeight = size === 'small' ? 20 : size === 'large' ? 40 : 30;
  const bars = [0, 1, 2, 3, 4];

  return (
    <View style={styles.waveContainer}>
      {bars.map((index) => (
        <AnimatedBar key={index} delay={index * 100} height={barHeight} />
      ))}
    </View>
  );
}

function AnimatedBar({ delay, height }: { delay: number; height: number }) {
  const scaleY = useSharedValue(0.3);

  useEffect(() => {
    scaleY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { height },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={Gradients.primary as [string, string, ...string[]]}
        style={[styles.barGradient, { height }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  spinner: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  spinnerGradient: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    backgroundColor: Colors.light.primary,
  },
  pulse: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseGradient: {
    flex: 1,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
    height: 50,
  },
  bar: {
    width: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
  },
  barGradient: {
    flex: 1,
    borderRadius: BorderRadius.sm,
  },
});
