import { useAuth } from '@/contexts/AuthContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
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
import { AnimatedFloatingCard } from '@/components/ui/animated-floating-card';
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button';
import { AnimatedProgressBar } from '@/components/ui/animated-progress-bar';
import { AnimatedPulse } from '@/components/ui/animated-pulse';
import { AnimatedScale } from '@/components/ui/animated-scale';
import { BorderRadius, Colors, Gradients, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const avatarScale = useSharedValue(0);

  const backgroundColor = useThemeColor({}, 'background');
  const headerBackgroundColor = useThemeColor({}, 'backgroundElevated');

  useEffect(() => {
    // Animate components in
    headerOpacity.value = withTiming(1, { duration: 600 });
    avatarScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Edit Profile', 'Profile editing will be available in a future update!');
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor }]}> 
        <ThemedText type="body" color="textSecondary">Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }, headerAnimatedStyle]}>
        <LinearGradient
          colors={Gradients.deepOcean as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
            <AnimatedPulse intensity="subtle" delay={800}>
              <ThemedText type="h2" color="textInverse" style={styles.avatarText}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </ThemedText>
            </AnimatedPulse>
          </Animated.View>
          
          <AnimatedFadeIn delay={400} direction="down">
            <ThemedText type="h2" color="textInverse" style={styles.name}>
              🌊 {user.name}
            </ThemedText>
          </AnimatedFadeIn>
          
          <AnimatedFadeIn delay={600} direction="up">
            <ThemedText type="bodyLarge" color="textInverse" style={styles.email}>
              {user.email}
            </ThemedText>
          </AnimatedFadeIn>
          
          <AnimatedScale type="bounce" delay={800}>
            <AnimatedButton
              title="🌊 Edit Profile"
              onPress={handleEditProfile}
              variant="ghost"
              size="small"
              style={styles.editButton}
            />
          </AnimatedScale>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <AnimatedFloatingCard delay={1000} floatingIntensity={3}>
            <View style={styles.section}>
              <AnimatedFadeIn delay={1200} direction="up">
                <ThemedText type="h4" style={styles.sectionTitle}>🌊 About Me</ThemedText>
              </AnimatedFadeIn>
              <AnimatedFadeIn delay={1400} direction="up">
                <ThemedText type="body" color="textSecondary" style={styles.bio}>
                  {user.bio}
                </ThemedText>
              </AnimatedFadeIn>
            </View>
          </AnimatedFloatingCard>

          <AnimatedFloatingCard delay={1200} floatingIntensity={4}>
            <View style={styles.section}>
              <AnimatedFadeIn delay={1600} direction="up">
                <ThemedText type="h4" style={styles.sectionTitle}>🌊 Skills I Share</ThemedText>
              </AnimatedFadeIn>
              {user.skillsOffered.length > 0 ? (
                <View style={styles.skillsContainer}>
                  {user.skillsOffered.map((skill, index) => (
                    <AnimatedFadeIn key={index} delay={1800 + index * 100} direction="up">
                      <AnimatedScale type="zoom" delay={1800 + index * 100}>
                        <View style={styles.skillTag}>
                          <ThemedText type="caption" style={styles.skillText}>{skill}</ThemedText>
                        </View>
                      </AnimatedScale>
                    </AnimatedFadeIn>
                  ))}
                </View>
              ) : (
                <AnimatedFadeIn delay={1800} direction="up">
                  <ThemedText type="body" color="textTertiary" style={styles.emptyText}>
                    No skills offered yet
                  </ThemedText>
                </AnimatedFadeIn>
              )}
            </View>
          </AnimatedFloatingCard>

          <AnimatedFloatingCard delay={1400} floatingIntensity={5}>
            <View style={styles.section}>
              <AnimatedFadeIn delay={2000} direction="up">
                <ThemedText type="h4" style={styles.sectionTitle}>🌊 Skills I Want to Dive Into</ThemedText>
              </AnimatedFadeIn>
              {user.skillsWanted.length > 0 ? (
                <View style={styles.skillsContainer}>
                  {user.skillsWanted.map((skill, index) => (
                    <AnimatedFadeIn key={index} delay={2200 + index * 100} direction="up">
                      <AnimatedScale type="bounce" delay={2200 + index * 100}>
                        <View style={[styles.skillTag, styles.wantedSkillTag]}>
                          <ThemedText type="caption" style={[styles.skillText, styles.wantedSkillText]}>
                            {skill}
                          </ThemedText>
                        </View>
                      </AnimatedScale>
                    </AnimatedFadeIn>
                  ))}
                </View>
              ) : (
                <AnimatedFadeIn delay={2200} direction="up">
                  <ThemedText type="body" color="textTertiary" style={styles.emptyText}>
                    No skills wanted yet
                  </ThemedText>
                </AnimatedFadeIn>
              )}
            </View>
          </AnimatedFloatingCard>

          <AnimatedFloatingCard delay={1600} floatingIntensity={3}>
            <View style={styles.section}>
              <AnimatedFadeIn delay={2400} direction="up">
                <ThemedText type="h4" style={styles.sectionTitle}>🌊 Ocean Stats</ThemedText>
              </AnimatedFadeIn>
              <View style={styles.statsContainer}>
                <AnimatedFadeIn delay={2600} direction="up">
                  <View style={styles.statItem}>
                    <AnimatedPulse intensity="medium" delay={2800}>
                      <ThemedText type="h3" color="primary" style={styles.statNumber}>
                        {user.skillsOffered.length}
                      </ThemedText>
                    </AnimatedPulse>
                    <ThemedText type="caption" color="textSecondary" style={styles.statLabel}>
                      Skills Shared
                    </ThemedText>
                    <AnimatedProgressBar 
                      progress={user.skillsOffered.length / 10} 
                      height={4}
                      style={styles.progressBar}
                    />
                  </View>
                </AnimatedFadeIn>
                
                <AnimatedFadeIn delay={2800} direction="up">
                  <View style={styles.statItem}>
                    <AnimatedPulse intensity="medium" delay={3000}>
                      <ThemedText type="h3" color="secondary" style={styles.statNumber}>
                        {user.skillsWanted.length}
                      </ThemedText>
                    </AnimatedPulse>
                    <ThemedText type="caption" color="textSecondary" style={styles.statLabel}>
                      Skills to Learn
                    </ThemedText>
                    <AnimatedProgressBar 
                      progress={user.skillsWanted.length / 10} 
                      height={4}
                      style={styles.progressBar}
                    />
                  </View>
                </AnimatedFadeIn>
                
                <AnimatedFadeIn delay={3000} direction="up">
                  <View style={styles.statItem}>
                    <AnimatedPulse intensity="medium" delay={3200}>
                      <ThemedText type="h3" color="tertiary" style={styles.statNumber}>0</ThemedText>
                    </AnimatedPulse>
                    <ThemedText type="caption" color="textSecondary" style={styles.statLabel}>
                      Connections
                    </ThemedText>
                    <AnimatedProgressBar 
                      progress={0} 
                      height={4}
                      style={styles.progressBar}
                    />
                  </View>
                </AnimatedFadeIn>
              </View>
            </View>
          </AnimatedFloatingCard>

          <AnimatedFadeIn delay={3200} direction="up">
            <AnimatedGradientButton
              title="🌊 Surface & Logout"
              onPress={handleLogout}
              gradient="error"
              size="large"
              style={styles.logoutButton}
            />
          </AnimatedFadeIn>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    ...Shadows.lg,
  },
  headerGradient: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  avatarText: {
    textAlign: 'center',
  },
  name: {
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  email: {
    marginBottom: Spacing.lg,
    opacity: 0.9,
    textAlign: 'center',
  },
  editButton: {
    marginTop: Spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  section: {
    padding: 0, // AnimatedFloatingCard handles padding
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  bio: {
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillTag: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  wantedSkillTag: {
    backgroundColor: Colors.light.warning + '20',
  },
  skillText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  wantedSkillText: {
    color: Colors.light.warning,
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    marginBottom: Spacing.xs,
  },
  statLabel: {
    marginBottom: Spacing.sm,
  },
  progressBar: {
    width: '100%',
    marginTop: Spacing.xs,
  },
  logoutButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
