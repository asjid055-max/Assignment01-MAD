import { useAuth } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { AnimatedFadeIn } from '@/components/ui/animated-fade-in';
import { AnimatedFloatingCard } from '@/components/ui/animated-floating-card';
import { AnimatedScale } from '@/components/ui/animated-scale';
import { AnimatedSkeleton, SkeletonCard } from '@/components/ui/animated-skeleton';
import { AnimatedToast, useToast } from '@/components/ui/animated-toast';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';

interface SkillOffer {
  id: string;
  skill: string;
  user: string;
  description: string;
  category: string;
}

const dummyOffers: SkillOffer[] = [
  { id: '1', skill: 'Python Tutoring', user: 'Ali', description: 'Learn Python fundamentals from scratch.', category: 'Programming' },
  { id: '2', skill: 'Guitar Lessons', user: 'Fatima', description: 'Acoustic and electric basics with chords and rhythm.', category: 'Music' },
  { id: '3', skill: 'Drawing Basics', user: 'Ahmed', description: 'Pencil drawing, shading, and composition for beginners.', category: 'Art' },
  { id: '4', skill: 'Yoga & Meditation', user: 'Sara', description: 'Breathing, stretching, and mindfulness practices.', category: 'Wellness' },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOffers, setFilteredOffers] = useState(dummyOffers);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const headerOpacity = useSharedValue(0);
  const searchOpacity = useSharedValue(0);
  const listOpacity = useSharedValue(0);

  const backgroundColor = useThemeColor({}, 'background');
  const headerBackgroundColor = useThemeColor({}, 'backgroundElevated');
  const searchBackgroundColor = useThemeColor({}, 'backgroundSecondary');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animate in components
      headerOpacity.value = withTiming(1, { duration: 600 });
      searchOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
      listOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setFilteredOffers(dummyOffers);
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredOffers(dummyOffers);
    } else {
      const filtered = dummyOffers.filter(offer =>
        offer.skill.toLowerCase().includes(query.toLowerCase()) ||
        offer.description.toLowerCase().includes(query.toLowerCase()) ||
        offer.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOffers(filtered);
    }
  };

  const handleOfferPress = (offer: SkillOffer) => {
    showToast(`Viewing ${offer.skill} by ${offer.user}`, 'info');
    Alert.alert(
      offer.skill,
      `Offered by: ${offer.user}\n\n${offer.description}\n\nCategory: ${offer.category}`,
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Connect', 
          onPress: () => {
            showToast(`Connection request sent to ${offer.user}!`, 'success');
          }
        }
      ]
    );
  };

  const handleCreateOffer = () => {
    showToast('Navigating to create offer...', 'info');
    router.push('/(tabs)/explore');
  };

  const renderOffer = ({ item, index }: { item: SkillOffer; index: number }) => (
    <AnimatedFadeIn delay={index * 100} direction="up">
      <AnimatedFloatingCard
        floatingIntensity={4}
        floatingDuration={4000 + index * 200}
        delay={index * 100}
      >
        <TouchableOpacity 
          style={styles.offerCard}
          onPress={() => handleOfferPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.offerHeader}>
            <AnimatedScale type="zoom" delay={index * 100 + 200}>
              <ThemedText type="h4" style={styles.skillName}>
                {item.skill}
              </ThemedText>
            </AnimatedScale>
            <View style={[styles.categoryBadge, { backgroundColor: Colors.light.primary + '20' }]}>
              <ThemedText type="caption" style={styles.categoryText}>
                {item.category}
              </ThemedText>
            </View>
          </View>
          
          <ThemedText type="bodySmall" color="textSecondary" style={styles.userName}>
            Offered by {item.user}
          </ThemedText>
          
          <ThemedText type="body" color="text" style={styles.description} numberOfLines={2}>
            {item.description}
          </ThemedText>
          
          <View style={styles.offerFooter}>
            <View style={styles.ratingContainer}>
              <ThemedText type="caption" color="textTertiary">⭐ 4.8</ThemedText>
            </View>
            <AnimatedScale type="bounce" delay={index * 100 + 400}>
              <View style={styles.learnMoreContainer}>
                <ThemedText type="caption" style={styles.learnMore}>
                  Learn More →
                </ThemedText>
              </View>
            </AnimatedScale>
          </View>
        </TouchableOpacity>
      </AnimatedFloatingCard>
    </AnimatedFadeIn>
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
  }));

  const listAnimatedStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
  }));

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.header}>
          <AnimatedSkeleton width="70%" height={20} style={styles.welcomeText} />
          <AnimatedSkeleton width="50%" height={32} style={styles.title} />
        </View>
        
        <View style={styles.searchContainer}>
          <AnimatedSkeleton width="100%" height={48} borderRadius={12} />
        </View>

        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => <SkeletonCard />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }, headerAnimatedStyle]}>
        <AnimatedFadeIn delay={200} direction="down">
          <ThemedText type="bodyLarge" color="textSecondary" style={styles.welcomeText}>
            Welcome back, {user?.name.split(' ')[0]}! 🌊
          </ThemedText>
        </AnimatedFadeIn>
        <AnimatedScale type="zoom" delay={400}>
          <ThemedText type="h1" style={styles.title}>
            🌊 Skill Ocean
          </ThemedText>
        </AnimatedScale>
      </Animated.View>
      
      <Animated.View style={[styles.searchContainer, { backgroundColor: searchBackgroundColor }, searchAnimatedStyle]}>
        <AnimatedFadeIn delay={600} direction="up">
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Dive deep into skills, categories, or descriptions..."
            placeholderTextColor={Colors.light.inputPlaceholder}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </AnimatedFadeIn>
      </Animated.View>

      <Animated.View style={[styles.listContainer, listAnimatedStyle]}>
        <FlatList
          data={filteredOffers}
          keyExtractor={item => item.id}
          renderItem={renderOffer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
            />
          }
          ListEmptyComponent={
            <AnimatedFadeIn delay={200} direction="up">
              <View style={styles.emptyContainer}>
                <ThemedText type="h3" color="textSecondary" style={styles.emptyTitle}>
                  🌊 No treasures found
                </ThemedText>
                <ThemedText type="body" color="textTertiary" style={styles.emptyText}>
                  Dive deeper! Try adjusting your search terms or explore the entire skill ocean.
                </ThemedText>
              </View>
            </AnimatedFadeIn>
          }
        />
      </Animated.View>

      {/* Floating Action Button */}
      <FloatingActionButton
        onPress={handleCreateOffer}
        icon={<ThemedText type="h3" color="textInverse">+</ThemedText>}
        size="large"
        position="bottom-right"
        variant="primary"
        gradient="primary"
      />

      {/* Toast Container */}
      <AnimatedToast
        message=""
        type="info"
        style={{ display: 'none' }}
      />
      {toasts.map((toast) => (
        <AnimatedToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: 60,
    ...Shadows.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  welcomeText: {
    marginBottom: Spacing.xs,
    fontStyle: 'italic',
  },
  title: {
    marginBottom: Spacing.xs,
  },
  searchContainer: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchInput: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.base,
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    ...Shadows.sm,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  offerCard: {
    padding: 0, // Remove padding since AnimatedFloatingCard handles it
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  skillName: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  userName: {
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  description: {
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: BorderRadius.md,
  },
  learnMore: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 24,
  },
});