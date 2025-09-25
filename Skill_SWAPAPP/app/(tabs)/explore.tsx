import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AnimatedGradientButton } from '@/components/ui/animated-gradient-button';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

const categories = [
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'language', label: 'Language', emoji: '🗣️' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'programming', label: 'Programming', emoji: '💻' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

export default function CreatePostScreen() {
  const [skill, setSkill] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const headerBackgroundColor = useThemeColor({}, 'backgroundElevated');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');

  const handlePost = async () => {
    if (!skill.trim() || !description.trim()) {
      Alert.alert('Incomplete', 'Please enter both a skill name and description.');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Incomplete', 'Please select a category.');
      return;
    }

    setIsPosting(true);
    
    // Assignment behavior: log data and navigate back to Home
    console.log('Create Post:', { title: skill, description, category: selectedCategory });
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsPosting(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Posted', 'Your post was logged to console. Returning to Home.', [
      {
        text: 'OK',
        onPress: () => {
          setSkill('');
          setDescription('');
          setSelectedCategory('');
          router.replace('/(tabs)');
        }
      }
    ]);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        <LinearGradient
          colors={Gradients.primary as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <ThemedText type="h1" color="textInverse" style={styles.title}>
            🌊 Create Skill Wave
          </ThemedText>
          <ThemedText type="bodyLarge" color="textInverse" style={styles.subtitle}>
            Make waves in our ocean of knowledge
          </ThemedText>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText type="label" style={styles.label}>🌊 Skill Name *</ThemedText>
            <TextInput
              placeholder="e.g. 🌊 Ocean Photography, 🐠 Marine Biology, 🏄‍♂️ Surfing"
              placeholderTextColor={Colors.light.inputPlaceholder}
              value={skill}
              onChangeText={setSkill}
              style={[styles.input, { backgroundColor: inputBackgroundColor }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="label" style={styles.label}>Category *</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabBar}>
              <View style={styles.chipsRow}>
                {categories.map(cat => {
                  const selected = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => handleCategorySelect(cat.id)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <ThemedText type="body" style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {cat.emoji} {cat.label}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="label" style={styles.label}>🌊 Description *</ThemedText>
            <TextInput
              placeholder="Dive deep! Describe what you offer, your experience level, what students can expect to learn in this skill ocean..."
              placeholderTextColor={Colors.light.inputPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              style={[styles.input, styles.textArea, { backgroundColor: inputBackgroundColor }]}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <AnimatedGradientButton
              title={isPosting ? "Making waves..." : "🌊 Create Wave"}
              onPress={handlePost}
              gradient="ocean"
              size="large"
              loading={isPosting}
              disabled={isPosting}
              style={styles.postButton}
            />
          </View>

          <ThemedText type="caption" color="textTertiary" style={styles.note}>
            * Required fields. Your skill wave will ripple through our ocean community.
          </ThemedText>
        </View>
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
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.9,
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    padding: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    marginBottom: Spacing.sm,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.base,
    ...Shadows.sm,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryTabBar: {
    marginTop: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.light.inputBorder,
    backgroundColor: Colors.light.background,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  chipText: {
    color: Colors.light.text,
  },
  chipTextSelected: {
    color: Colors.light.textInverse,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  postButton: {
    marginBottom: Spacing.lg,
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});