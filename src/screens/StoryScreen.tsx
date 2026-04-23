import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCurriculumStore } from '../store/useCurriculumStore';
import { useColors } from '../theme';
import { RootStackParamList, StoryLine } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Story'>;
type Route = RouteProp<RootStackParamList, 'Story'>;

export default function StoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tiers } = useCurriculumStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topic = tiers.flatMap((t) => t.topics).find((tp) => tp.id === route.params.topicId);
  if (!topic) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8, backgroundColor: colors.bg }]}>
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
        {topic.story.map((line, i) => (
          <StoryLineView key={i} line={line} colors={colors} />
        ))}
      </ScrollView>
    </View>
  );
}

function StoryLineView({ line, colors }: { line: StoryLine; colors: ReturnType<typeof import('../theme').useColors> }) {
  if (line.type === 'emoji') {
    return (
      <View style={styles.emojiRow}>
        <Text style={styles.emoji}>{line.content}</Text>
      </View>
    );
  }

  if (line.type === 'narration') {
    return (
      <View style={styles.narrationRow}>
        <Text style={[styles.narrationText, { color: colors.textSecondary }]}>{line.indonesian}</Text>
        {line.german && <Text style={[styles.narrationGerman, { color: colors.textTertiary }]}>{line.german}</Text>}
      </View>
    );
  }

  const isA = line.speaker === 'A';

  return (
    <View style={[styles.dialogueRow, isA ? styles.rowA : styles.rowB]}>
      <View style={[
        styles.bubble,
        isA
          ? [styles.bubbleA, { backgroundColor: colors.bubbleA, borderColor: colors.bubbleABorder }]
          : [styles.bubbleB, { backgroundColor: colors.card, borderColor: colors.progressBg }],
      ]}>
        <Text style={[styles.speakerLabel, { color: isA ? colors.bubbleALabel : colors.textSecondary }]}>
          {isA ? 'A' : 'B'}
        </Text>
        <Text style={[styles.indonesianText, { color: isA ? colors.bubbleAText : colors.text }]}>{line.indonesian}</Text>
        {line.german && (
          <Text style={[styles.germanText, { color: isA ? colors.bubbleALabel : colors.textSecondary }]}>{line.german}</Text>
        )}
      </View>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  dialogueRow: { flexDirection: 'row' },
  rowA: { justifyContent: 'flex-start' },
  rowB: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    gap: 3,
  },
  bubbleA: { borderBottomLeftRadius: 4 },
  bubbleB: { borderBottomRightRadius: 4 },
  speakerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  indonesianText: { fontSize: 16, fontWeight: '500' },
  germanText: { fontSize: 12, marginTop: 2 },
  narrationRow: { alignItems: 'center', paddingVertical: 6 },
  narrationText: { fontSize: 13, fontStyle: 'italic' },
  narrationGerman: { fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  emojiRow: { alignItems: 'center', paddingVertical: 8 },
  emoji: { fontSize: 40 },
});
