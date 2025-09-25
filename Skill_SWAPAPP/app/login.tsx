import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedFadeIn } from '@/components/ui/animated-fade-in';
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { AnimatedScale } from '@/components/ui/animated-scale';
import { Colors, Gradients, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  // Animation values
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
  const formOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const textInverse = useThemeColor({}, 'textInverse');
  const isDark = useMemo(() => backgroundColor === Colors.dark.background, [backgroundColor]);

  useEffect(() => {
    backgroundOpacity.value = withTiming(1, { duration: 800 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 10, stiffness: 120 });

    formOpacity.value = withDelay(250, withTiming(1, { duration: 500 }));
    formTranslateY.value = withDelay(250, withSpring(0, { damping: 14, stiffness: 120 }));
  }, []);

  const emailValid = useMemo(
    () => /^\S+@\S+\.\S+$/.test(email.trim()),
    [email]
  );
  const passwordValid = useMemo(() => password.trim().length >= 4, [password]);

  const canSubmit = emailValid && passwordValid && !loading;

  const safeSubmit = (fn: () => Promise<void> | void) => {
    if (!canSubmit) return;
    setLoading(true);
    Promise.resolve(fn()).finally(() => {
      // If navigation didn’t happen (e.g., invalid demo), reset loading here
      setLoading(false);
    });
  };

  const handleLogin = async () => {
    if (email.trim() === 'test@student.com' && password.trim() === '12345') {
      // simulate loading; loading state is handled by safeSubmit
      await new Promise((r) => setTimeout(r, 1000));
      login(email.trim(), password);
      router.replace('/(tabs)');
      return;
    }
    Alert.alert('Login failed', 'Invalid email or password. Use test@student.com / 12345');
  };

  const handleSignUp = async () => {
    if (!emailValid || !passwordValid) {
      Alert.alert('Check your details', 'Enter a valid email and a password with at least 4 characters.');
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
    Alert.alert('Success', 'Account created! You are now logged in.');
    login(email.trim(), password);
    router.replace('/(tabs)');
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Background */}
      <Animated.View style={[styles.backgroundContainer, backgroundAnimatedStyle]}>
        <LinearGradient
          colors={Gradients.deepOcean as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        {/* Floating orbs */}
        <View style={styles.floatingOrb1} />
        <View style={styles.floatingOrb2} />
        <View style={styles.floatingOrb3} />
      </Animated.View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <AnimatedScale type="zoom" delay={200}>
              <View style={styles.modernLogoContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.08)']}
                  style={styles.logoGradient}
                >
                  <ThemedText type="h1" color="textInverse" style={styles.logoEmoji}>
                    🌊
                  </ThemedText>
                </LinearGradient>
              </View>
            </AnimatedScale>
            <AnimatedFadeIn delay={600} direction="up">
              <ThemedText type="h2" color="textInverse" style={styles.appName}>
                SkillSwap
              </ThemedText>
            </AnimatedFadeIn>
            <AnimatedFadeIn delay={800} direction="up">
              <ThemedText type="bodyLarge" color="textInverse" style={styles.tagline}>
                {isSignUp ? '🌊 Join the Ocean' : '🔑 Welcome Back'}
              </ThemedText>
            </AnimatedFadeIn>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <View style={styles.blurWrapper}>
              <View
                style={[
                  styles.glassmorphismCard,
                  {
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
                    backgroundColor: isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.9)'
                  }
                ]}
              >
                {/* Header */}
                <View style={styles.formHeader}>
                  <ThemedText type="h3" style={[styles.formTitle, { color: textColor }]}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </ThemedText>
                  <ThemedText type="body" color="textSecondary" style={styles.formSubtitle}>
                    {isSignUp ? 'Join our community of learners' : 'Welcome back to your journey'}
                  </ThemedText>
                </View>

                {/* Inputs */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <ThemedText type="label" style={[styles.inputLabel, { color: textColor }]}>
                      📧 Email Address
                    </ThemedText>
                    <AnimatedInput
                      placeholder="Enter your email address"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      disabled={loading}
                      style={[
                        styles.modernInput,
                        isDark ? {
                          backgroundColor: 'rgba(30,30,30,0.9)',
                          borderColor: 'rgba(255,255,255,0.08)'
                        } : undefined
                      ]}
                    />
                    {!emailValid && email.length > 0 && (
                      <ThemedText type="caption" color="textTertiary" style={styles.hint}>
                        Please enter a valid email.
                      </ThemedText>
                    )}
                  </View>

                  <View style={styles.inputWrapper}>
                    <ThemedText type="label" style={[styles.inputLabel, { color: textColor }]}>
                      🔒 Password
                    </ThemedText>
                    <View style={styles.passwordRow}>
                      <AnimatedInput
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        disabled={loading}
                        style={[
                          styles.modernInput,
                          { flex: 1 },
                          isDark ? {
                            backgroundColor: 'rgba(30,30,30,0.9)',
                            borderColor: 'rgba(255,255,255,0.08)'
                          } : undefined
                        ]}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((s) => !s)}
                        style={styles.eyeBtn}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <ThemedText type="body" color={isDark ? 'textInverse' : 'text'}>
                          {showPassword ? '🙈' : '👁️'}
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                    {!passwordValid && password.length > 0 && (
                      <ThemedText type="caption" color="textTertiary" style={styles.hint}>
                        Minimum 4 characters.
                      </ThemedText>
                    )}
                  </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonSection}>
                  <View style={styles.primaryButtonContainer}>
                    <AnimatedGradientButton
                      title={isSignUp ? '🚀 Create Account' : '🔑 Sign In'}
                      onPress={() => safeSubmit(isSignUp ? handleSignUp : handleLogin)}
                      loading={loading}
                      gradient="ocean"
                      size="large"
                      disabled={!canSubmit}
                    />
                  </View>

                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <ThemedText type="caption" color="textTertiary" style={styles.dividerText}>
                      or
                    </ThemedText>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.secondaryButtonContainer}>
                    <AnimatedButton
                      title={isSignUp ? '✨ Already have an account? Sign In' : "🌟 Don't have an account? Sign Up"}
                      onPress={() => {
                        setIsSignUp((s) => !s);
                        // Light haptic/animation could be triggered here if you have it
                      }}
                      variant="ghost"
                      size="medium"
                      disabled={loading}
                    />
                  </View>
                </View>

                {/* Demo credentials */}
                <View style={styles.demoSection}>
                  <View style={styles.demoCard}>
                    <ThemedText type="caption" color="textTertiary" style={styles.demoText}>
                      🧪 Demo Credentials
                    </ThemedText>
                    <ThemedText type="caption" color="textSecondary" style={styles.demoCredentials}>
                      Email: test@student.com{'\n'}Password: 12345
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  gradient: { flex: 1 },

  // Orbs
  floatingOrb1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingOrb2: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(6, 182, 212, 0.22)',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingOrb3: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // Logo
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  modernLogoContainer: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.xl, overflow: 'hidden',
  },
  logoGradient: {
    width: '100%', height: '100%',
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 50,
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontWeight: '800',
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.9,
    fontSize: 16,
    fontWeight: '500',
  },

  // Form
  formContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // Blur glass wrapper
  blurWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },

  glassmorphismCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: Spacing.lg,
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 20,
  },
  formHeader: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  inputContainer: { marginBottom: Spacing.xl },
  inputWrapper: { marginBottom: Spacing.lg },
  inputLabel: {
    marginBottom: Spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  modernInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    marginLeft: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  hint: {
    marginTop: 6,
  },

  buttonSection: { marginBottom: Spacing.xl },
  primaryButtonContainer: { marginBottom: Spacing.xl },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dividerText: { marginHorizontal: Spacing.md, fontSize: 14, opacity: 0.6 },
  secondaryButtonContainer: { marginTop: Spacing.lg },

  demoSection: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  demoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  demoText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  demoCredentials: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
