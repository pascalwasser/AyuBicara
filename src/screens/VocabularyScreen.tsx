import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCurriculumStore } from '../store/useCurriculumStore';
import { useWordKnowledgeStore, WordStatus } from '../store/useWordKnowledgeStore';
import { useColors } from '../theme';
import { RootStackParamList } from '../types';
import wordsData from '../data/words.json';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Vocabulary'>;
type Route = RouteProp<RootStackParamList, 'Vocabulary'>;

type WordEntry = {
  id: string;
  tier: number;
  word: string;
  translation: string;
  register?: string;
  notes?: string;
  examples?: { indonesian: string; german: string }[];
};

const allWords: WordEntry[] = (wordsData as any).words;

function findWord(id: string): WordEntry | undefined {
  return allWords.find((w) => w.id === id);
}

const STATUS_LABEL: Record<WordStatus, string> = {
  unknown: 'Neu',
  learning: 'Lernend',
  known: 'Gelernt',
};

const STATUS_COLOR: Record<WordStatus, string> = {
  unknown: '#6b7280',
  learning: '#eab308',
  known: '#22c55e',
};

export default function VocabularyScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tiers } = useCurriculumStore();
  const wordKnowledge = useWordKnowledgeStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const topic = tiers.flatMap((t) => t.topics).find((tp) => tp.id === route.params.topicId);
  if (!topic) return null;

  const words = topic.targetWordIds.map(findWord).filter(Boolean) as WordEntry[];

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.accent }]}>‹ Zurück</Text>
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.text }]}>Schlüsselwörter</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
      >
        {words.map((word) => {
          const status = wordKnowledge.getStatus(word.id);
          const count = wordKnowledge.getCount(word.id);
          const isExpanded = expanded.has(word.id);
          const hasDetails = !!word.notes || (word.examples && word.examples.length > 0);
          return (
            <TouchableOpacity
              key={word.id}
              activeOpacity={hasDetails ? 0.7 : 1}
              onPress={() => hasDetails && toggleExpand(word.id)}
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.word, { color: colors.text }]}>{word.word}</Text>
                <View style={styles.badges}>
                  {word.register && (
                    <View style={[styles.badge, { backgroundColor: colors.progressBg }]}>
                      <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{word.register}</Text>
                    </View>
                  )}
                  <View style={[styles.badge, { backgroundColor: STATUS_COLOR[status] + '22' }]}>
                    <Text style={[styles.badgeText, { color: STATUS_COLOR[status] }]}>
                      {STATUS_LABEL[status]}{status !== 'unknown' ? ` ${count}/5` : ''}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.translation, { color: colors.textSecondary }]}>{word.translation}</Text>
              {isExpanded && word.notes && (
                <Text style={[styles.notes, { color: colors.textTertiary }]}>{word.notes}</Text>
              )}
              {isExpanded && word.examples && word.examples.length > 0 && (
                <View style={[styles.examplesBox, { borderTopColor: colors.progressBg }]}>
                  {word.examples.map((ex, i) => (
                    <View key={i} style={styles.example}>
                      <Text style={[styles.exampleIndonesian, { color: colors.text }]}>{ex.indonesian}</Text>
                      <Text style={[styles.exampleGerman, { color: colors.textSecondary }]}>{ex.german}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  card: { borderRadius: 14, padding: 14, gap: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  word: { fontSize: 20, fontWeight: '700', flexShrink: 1 },
  badges: { flexDirection: 'row', gap: 6, flexShrink: 0 },
  badge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 11 },
  translation: { fontSize: 15 },
  notes: { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
  examplesBox: { borderTopWidth: 1, marginTop: 4, paddingTop: 8, gap: 8 },
  example: { gap: 2 },
  exampleIndonesian: { fontSize: 14, fontWeight: '500' },
  exampleGerman: { fontSize: 12 },
});
