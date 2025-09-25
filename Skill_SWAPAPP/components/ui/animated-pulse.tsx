import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

export interface AnimatedPulseProps {
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
  scale?: number;
  delay?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function AnimatedPulse({
  children,
  style,
  duration = 1000,
  scale = 1.05,
  delay = 0,
  intensity = 'medium',
}: AnimatedPulseProps) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  const intensityMap = {
    subtle: { scale: 1.02, opacity: 0.1 },
    medium: { scale: 1.05, opacity: 0.2 },
    strong: { scale: 1.1, opacity: 0.3 },
  };

  const currentIntensity = intensityMap[intensity];

  useEffect(() => {
    // Scale animation
    pulseScale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(currentIntensity.scale, { duration: duration / 2 }),
          withTiming(1, { duration: duration / 2 })
        ),
        -1,
        true
      )
    );

    // Opacity animation for subtle effect
    pulseOpacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1 - currentIntensity.opacity, { duration: duration / 2 }),
          withTiming(1, { duration: duration / 2 })
        ),
        -1,
        true
      )
    );
  }, [delay, duration, currentIntensity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
