import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button';
import { BorderRadius, Colors, Gradients, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface OnboardingCardProps {
  title: string;
  description: string;
  emoji: string;
  gradient?: keyof typeof Gradients;
  onNext?: () => void;
  onSkip?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function OnboardingCard({
  title,
  description,
  emoji,
  gradient = 'primary',
  onNext,
  onSkip,
  isLast = false,
  style,
}: OnboardingCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor = useThemeColor({}, 'background');

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext?.();
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkip?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor }, animatedStyle, style]}>
      <View style={styles.content}>
        {/* Emoji Header */}
        <Animated.View style={styles.emojiContainer}>
          <Animated.Text style={styles.emoji}>{emoji}</Animated.Text>
        </Animated.View>

        {/* Gradient Background */}
        <LinearGradient
          colors={Gradients[gradient] as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />

        {/* Content */}
        <View style={styles.textContainer}>
          <ThemedText type="h1" color="text" style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText type="bodyLarge" color="textSecondary" style={styles.description}>
            {description}
          </ThemedText>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <AnimatedGradientButton
            title={isLast ? "Get Started! 🚀" : "Next"}
            onPress={handleNext}
            gradient={gradient}
            size="large"
            style={styles.nextButton}
          />
          
          {!isLast && (
            <AnimatedButton
              title="Skip"
              onPress={handleSkip}
              variant="ghost"
              size="medium"
              style={styles.skipButton}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// Onboarding Screen Container
export interface OnboardingScreenProps {
  cards: {
    title: string;
    description: string;
    emoji: string;
    gradient?: keyof typeof Gradients;
  }[];
  onComplete: () => void;
  onSkip: () => void;
  style?: ViewStyle;
}

export function OnboardingScreen({
  cards,
  onComplete,
  onSkip,
  style,
}: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const currentCard = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.screenContainer, animatedStyle, style]}>
      <OnboardingCard
        title={currentCard.title}
        description={currentCard.description}
        emoji={currentCard.emoji}
        gradient={currentCard.gradient}
        onNext={handleNext}
        onSkip={handleSkip}
        isLast={isLast}
      />
      
      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentIndex 
                  ? Colors.light.primary 
                  : Colors.light.border,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
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
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
  },
  emojiContainer: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    borderRadius: BorderRadius.xl,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  nextButton: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  skipButton: {
    marginTop: Spacing.sm,
  },
  screenContainer: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  progressDot: {
    height: 8,
    borderRadius: BorderRadius.full,
  },
});
