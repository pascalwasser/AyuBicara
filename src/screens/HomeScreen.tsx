import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCurriculumStore } from '../store/useCurriculumStore';
import { useWordKnowledgeStore } from '../store/useWordKnowledgeStore';
import { useColors } from '../theme';
import { Topic, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { tiers, bestScores, loadBestScores } = useCurriculumStore();
  const { load: loadWordKnowledge, counts } = useWordKnowledgeStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const known = Object.values(counts).filter((n) => n >= 5).length;
  const learning = Object.values(counts).filter((n) => n >= 1 && n < 5).length;

  useEffect(() => {
    loadBestScores();
    loadWordKnowledge();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>AyuBicara</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Deutsch → Bahasa Indonesia</Text>
        {(known > 0 || learning > 0) && (
          <View style={styles.statsRow}>
            {known > 0 && (
              <View style={[styles.statPill, { backgroundColor: '#22c55e22' }]}>
                <Text style={[styles.statText, { color: '#22c55e' }]}>{known} gelernt</Text>
              </View>
            )}
            {learning > 0 && (
              <View style={[styles.statPill, { backgroundColor: '#eab30822' }]}>
                <Text style={[styles.statText, { color: '#eab308' }]}>{learning} lernend</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {tiers.map((tier) => (
        <View key={tier.id} style={styles.tierSection}>
          <View style={[styles.tierHeader, { backgroundColor: colors.card }]}>
            <Text style={[styles.tierLabel, { color: colors.accent }]}>{tier.label}</Text>
            <Text style={[styles.tierDescription, { color: colors.textSecondary }]}>{tier.description}</Text>
          </View>

          {tier.topics.length === 0 ? (
            <View style={[styles.emptyTier, { borderColor: colors.progressBg }]}>
              <Text style={[styles.emptyTierText, { color: colors.textTertiary }]}>Kommt bald…</Text>
            </View>
          ) : (
            tier.topics.map((topic) => {
              const completedSets = topic.exercises.filter((s) => bestScores[s.id] !== undefined).length;
              const totalSets = topic.exercises.length;
              const allDone = completedSets === totalSets && totalSets > 0;

              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[styles.topicCard, { backgroundColor: colors.card, borderColor: allDone ? colors.cardDoneBorder : colors.cardBorder }]}
                  onPress={() => navigation.navigate('TopicDetail', { topicId: topic.id })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.topicIcon, { backgroundColor: allDone ? colors.iconDoneBg : colors.iconBg }]}>
                    <Text style={[styles.topicIconText, { color: allDone ? colors.iconDoneColor : colors.iconColor }]}>
                      {allDone ? '✓' : '○'}
                    </Text>
                  </View>
                  <View style={styles.topicInfo}>
                    <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.title}</Text>
                    <Text style={[styles.topicMeta, { color: colors.textSecondary }]}>
                      {topic.targetWordIds.length} Wörter · {totalSets} Übungen
                    </Text>
                  </View>
                  {completedSets > 0 && (
                    <View style={styles.progressPill}>
                      <Text style={[styles.progressText, { color: allDone ? '#22c55e' : '#f97316' }]}>
                        {completedSets}/{totalSets}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 8 },
  header: { alignItems: 'center', paddingVertical: 16 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statText: { fontSize: 13, fontWeight: '600' },
  tierSection: { gap: 6, marginTop: 8 },
  tierHeader: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tierLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  tierDescription: { fontSize: 13 },
  emptyTier: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
  },
  emptyTierText: { fontSize: 13 },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  topicIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIconText: { fontSize: 20 },
  topicInfo: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: '600' },
  topicMeta: { fontSize: 12, marginTop: 2 },
  progressPill: { marginRight: 4 },
  progressText: { fontSize: 13, fontWeight: '600' },
  chevron: { fontSize: 24 },
});
