import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCurriculumStore } from '../store/useCurriculumStore';
import { useColors } from '../theme';
import { ExerciseSet, RootStackParamList, Topic } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TopicDetail'>;
type Route = RouteProp<RootStackParamList, 'TopicDetail'>;

export default function TopicDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tiers, bestScores, loadBestScores, startExercise } = useCurriculumStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  useEffect(() => { loadBestScores(); }, []);

  const topic = tiers.flatMap((t) => t.topics).find((tp) => tp.id === route.params.topicId);
  if (!topic) return null;

  const handleExercise = (set: ExerciseSet) => {
    startExercise(topic, set);
    navigation.navigate('Exercise', { topicId: topic.id, exerciseSetId: set.id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.accent }]}>‹ Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]}>{topic.title}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      >
        <Row
          icon="📖"
          title="Geschichte"
          subtitle="Die Geschichte lesen"
          colors={colors}
          onPress={() => navigation.navigate('Story', { topicId: topic.id })}
        />

        <View style={[styles.divider, { backgroundColor: colors.progressBg }]} />

        {topic.exercises.map((set, i) => {
          const best = bestScores[set.id];
          const total = set.sentences.length;
          return (
            <Row
              key={set.id}
              icon="✏️"
              title={`Übung ${i + 1}`}
              subtitle={`${total} Aufgaben`}
              badge={best !== undefined ? { score: best, total } : undefined}
              colors={colors}
              onPress={() => handleExercise(set)}
            />
          );
        })}

        <View style={[styles.divider, { backgroundColor: colors.progressBg }]} />

        <Row
          icon="📋"
          title="Schlüsselwörter"
          subtitle={`${topic.targetWordIds.length} Wörter`}
          colors={colors}
          onPress={() => navigation.navigate('Vocabulary', { topicId: topic.id })}
        />
      </ScrollView>
    </View>
  );
}

type RowProps = {
  icon: string;
  title: string;
  subtitle: string;
  badge?: { score: number; total: number };
  colors: ReturnType<typeof import('../theme').useColors>;
  onPress: () => void;
};

function Row({ icon, title, subtitle, badge, colors, onPress }: RowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {badge !== undefined ? (
        <View style={styles.badge}>
          <Text style={[styles.badgeScore, scoreColor(badge.score, badge.total)]}>
            {badge.score}/{badge.total}
          </Text>
          <Text style={[styles.badgeBest, { color: colors.textSecondary }]}>Bestes</Text>
        </View>
      ) : (
        <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
      )}
    </TouchableOpacity>
  );
}

function scoreColor(score: number, total: number) {
  if (score === total) return { color: '#22c55e' };
  if (score >= total / 2) return { color: '#f97316' };
  return { color: '#ef4444' };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: { width: 80 },
  backText: { fontSize: 16 },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  divider: { height: 1, marginVertical: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
  badge: { alignItems: 'flex-end' },
  badgeScore: { fontSize: 15, fontWeight: '600' },
  badgeBest: { fontSize: 11 },
  chevron: { fontSize: 24 },
});
