import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export interface AnimatedFadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  style?: ViewStyle;
}

export function AnimatedFadeIn({
  children,
  delay = 0,
  duration = 600,
  direction = 'up',
  style,
}: AnimatedFadeInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Set initial values based on direction
    switch (direction) {
      case 'up':
        translateY.value = 30;
        break;
      case 'down':
        translateY.value = -30;
        break;
      case 'left':
        translateX.value = 30;
        break;
      case 'right':
        translateX.value = -30;
        break;
      default:
        translateY.value = 0;
        translateX.value = 0;
        break;
    }

    // Start animation
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 150 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 150 }));
  }, [delay, duration, direction]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
