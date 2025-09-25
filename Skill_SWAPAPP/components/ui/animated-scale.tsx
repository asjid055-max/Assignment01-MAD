import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

export interface AnimatedScaleProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  type?: 'zoom' | 'zoomIn' | 'zoomOut' | 'bounce' | 'pulse';
  style?: ViewStyle;
}

export function AnimatedScale({
  children,
  delay = 0,
  duration = 600,
  type = 'zoom',
  style,
}: AnimatedScaleProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Start animation
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    
    if (type === 'pulse') {
      scale.value = withSequence(
        withDelay(delay, withSpring(1.1, { damping: 8, stiffness: 150 })),
        withSpring(1, { damping: 8, stiffness: 150 })
      );
    } else if (type === 'bounce') {
      scale.value = withDelay(
        delay,
        withSpring(1, { damping: 6, stiffness: 200 })
      );
    } else if (type === 'zoomIn') {
      scale.value = withDelay(
        delay,
        withSpring(1, { damping: 15, stiffness: 150 })
      );
    } else if (type === 'zoomOut') {
      scale.value = withDelay(
        delay,
        withTiming(0.8, { duration: duration / 2 })
      );
    } else {
      // Default zoom
      scale.value = withDelay(
        delay,
        withSpring(1, { damping: 15, stiffness: 150 })
      );
    }
  }, [delay, type, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
