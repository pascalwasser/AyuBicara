import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSessionStore } from '../store/useSessionStore';
import { useColors } from '../theme';
import { LessonSession, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SessionList'>;

export default function SessionListScreen() {
  const navigation = useNavigation<Nav>();
  const { allSessions, bestScores, loadBestScores, startSession } = useSessionStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  useEffect(() => { loadBestScores(); }, []);

  const handleStart = (session: LessonSession) => {
    startSession(session);
    navigation.navigate('Exercise', { sessionId: session.id });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>AyuBicara</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Deutsch → Bahasa Indonesia</Text>
      </View>

      {allSessions.map((session) => {
        const best = bestScores[session.id];
        const total = session.sentences.length;
        const done = best !== undefined;

        return (
          <TouchableOpacity
            key={session.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: done ? colors.cardDoneBorder : colors.cardBorder }]}
            onPress={() => handleStart(session)}
            activeOpacity={0.8}
          >
            <View style={[styles.icon, { backgroundColor: done ? colors.iconDoneBg : colors.iconBg }]}>
              <Text style={[styles.iconText, { color: done ? colors.iconDoneColor : colors.iconColor }]}>{done ? '✓' : '○'}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{session.title}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>{session.subtitle}</Text>
            </View>
            {done ? (
              <View style={styles.score}>
                <Text style={[styles.scoreNum, scoreColor(best, total)]}>{best}/{total}</Text>
                <Text style={[styles.scoreBest, { color: colors.textSecondary }]}>Bestes</Text>
              </View>
            ) : (
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>›</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function scoreColor(score: number, total: number) {
  if (score === total) return { color: '#22c55e' };
  if (score >= total / 2) return { color: '#f97316' };
  return { color: '#ef4444' };
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16 },
  header: { alignItems: 'center', paddingVertical: 16 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 22 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 12, marginTop: 2 },
  score: { alignItems: 'flex-end' },
  scoreNum: { fontSize: 16, fontWeight: '600' },
  scoreBest: { fontSize: 11 },
  chevron: { fontSize: 24 },
});
