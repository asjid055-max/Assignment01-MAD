import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Gradients, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface AnimatedSplashScreenProps {
  onAnimationComplete?: () => void;
  duration?: number;
  style?: ViewStyle;
  logo?: string;
  appName?: string;
  tagline?: string;
}

export function AnimatedSplashScreen({
  onAnimationComplete,
  duration = 3000,
  style,
  logo = '🌊',
  appName = 'SkillSwap',
  tagline = 'Dive Deep • Share Skills • Rise Together',
}: AnimatedSplashScreenProps) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  
  const appNameScale = useSharedValue(0);
  const appNameOpacity = useSharedValue(0);
  const appNameTranslateY = useSharedValue(50);
  
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(30);
  
  const backgroundOpacity = useSharedValue(0);
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    const animationSequence = () => {
      // Background fade in
      backgroundOpacity.value = withTiming(1, { duration: 500 });

      // Logo animation
      logoScale.value = withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(1, { duration: 400 })
      );
      logoOpacity.value = withTiming(1, { duration: 800 });
      logoRotation.value = withTiming(360, { duration: 1200 });

      // App name animation
      appNameScale.value = withDelay(600, withTiming(1, { duration: 600 }));
      appNameOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
      appNameTranslateY.value = withDelay(600, withTiming(0, { duration: 600 }));

      // Tagline animation
      taglineOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));
      taglineTranslateY.value = withDelay(1200, withTiming(0, { duration: 600 }));

      // Complete animation
      setTimeout(() => {
        onAnimationComplete?.();
      }, duration);
    };

    animationSequence();
  }, [duration, onAnimationComplete]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const appNameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: appNameScale.value },
      { translateY: appNameTranslateY.value },
    ],
    opacity: appNameOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: taglineTranslateY.value }],
    opacity: taglineOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor }, backgroundAnimatedStyle, style]}>
      <LinearGradient
        colors={Gradients.deepOcean as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />

      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoCircle}>
            <Animated.Text style={styles.logo}>{logo}</Animated.Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={[styles.appNameContainer, appNameAnimatedStyle]}>
          <ThemedText type="h1" color="textInverse" style={styles.appName}>
            {appName}
          </ThemedText>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, taglineAnimatedStyle]}>
          <ThemedText type="bodyLarge" color="textInverse" style={styles.tagline}>
            {tagline}
          </ThemedText>
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      <Animated.View style={[styles.loadingContainer, taglineAnimatedStyle]}>
        <LoadingDots />
      </Animated.View>
    </Animated.View>
  );
}

// Loading dots component
function LoadingDots() {
  const dots = [0, 1, 2];
  
  return (
    <View style={styles.dotsContainer}>
      {dots.map((index) => (
        <AnimatedDot key={index} delay={index * 200} />
      ))}
    </View>
  );
}

function AnimatedDot({ delay }: { delay: number }) {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 400 })
    );
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400 })
    );

    // Continuous animation
    const interval = setInterval(() => {
      scale.value = withSequence(
        withTiming(0.5, { duration: 400 }),
        withTiming(1, { duration: 400 })
      );
      opacity.value = withSequence(
        withTiming(0.3, { duration: 400 }),
        withTiming(1, { duration: 400 })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.dot, animatedStyle]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
  },
  appNameContainer: {
    marginBottom: Spacing.lg,
  },
  appName: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    marginBottom: Spacing.xl,
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
