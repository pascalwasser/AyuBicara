import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCurriculumStore } from '../store/useCurriculumStore';
import { useWordKnowledgeStore } from '../store/useWordKnowledgeStore';
import { useColors } from '../theme';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type Route = RouteProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { score, total, topicId, exerciseSetId } = route.params;
  const { saveBestScore, tiers } = useCurriculumStore();
  const { incrementWords } = useWordKnowledgeStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topic = tiers.flatMap((t) => t.topics).find((tp) => tp.id === topicId);
  const exerciseSet = topic?.exercises.find((s) => s.id === exerciseSetId);
  const setIndex = topic?.exercises.findIndex((s) => s.id === exerciseSetId) ?? 0;
  const percent = Math.round((score / total) * 100);

  useEffect(() => {
    saveBestScore(exerciseSetId, score);
    if (score > 0 && topic?.targetWordIds.length) {
      incrementWords(topic.targetWordIds);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={styles.emoji}>{percent === 100 ? '🎉' : percent >= 60 ? '👍' : '💪'}</Text>
        <Text style={[styles.topicTitle, { color: colors.textSecondary }]}>{topic?.title}</Text>
        <Text style={[styles.setTitle, { color: colors.text }]}>Übung {setIndex + 1}</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreNum, scoreColor(score, total)]}>{score}</Text>
          <Text style={[styles.scoreDivider, { color: colors.textSecondary }]}> / {total}</Text>
        </View>
        <Text style={[styles.percent, { color: colors.textSecondary }]}>{percent}% richtig</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate('TopicDetail', { topicId })}
        >
          <Text style={styles.buttonText}>Zurück zum Thema</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonSecondary, { borderColor: colors.accent }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.buttonSecondaryText, { color: colors.accent }]}>Zur Übersicht</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function scoreColor(score: number, total: number) {
  if (score === total) return { color: '#22c55e' };
  if (score >= total / 2) return { color: '#f97316' };
  return { color: '#ef4444' };
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, gap: 24 },
  card: { borderRadius: 20, padding: 32, alignItems: 'center', gap: 4 },
  emoji: { fontSize: 52 },
  topicTitle: { fontSize: 14, marginTop: 8 },
  setTitle: { fontSize: 22, fontWeight: '700' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  scoreNum: { fontSize: 48, fontWeight: '800' },
  scoreDivider: { fontSize: 24 },
  percent: { fontSize: 16 },
  buttons: { gap: 10 },
  button: { borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonSecondary: { borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5 },
  buttonSecondaryText: { fontSize: 16, fontWeight: '600' },
});
