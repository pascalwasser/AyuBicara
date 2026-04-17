import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSessionStore } from '../store/useSessionStore';
import { useColors } from '../theme';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type Route = RouteProp<RootStackParamList, 'Result'>;

export default function ResultScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { score, total, sessionId } = route.params;
  const { saveBestScore, allSessions } = useSessionStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const session = allSessions.find((s) => s.id === sessionId);
  const percent = Math.round((score / total) * 100);

  useEffect(() => { saveBestScore(sessionId, score); }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={styles.emoji}>{percent === 100 ? '🎉' : percent >= 60 ? '👍' : '💪'}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{session?.title}</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreNum, scoreColor(score, total)]}>{score}</Text>
          <Text style={[styles.scoreDivider, { color: colors.textSecondary }]}> / {total}</Text>
        </View>
        <Text style={[styles.percent, { color: colors.textSecondary }]}>{percent}% richtig</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={() => navigation.navigate('SessionList')}>
        <Text style={styles.buttonText}>Zurück zur Übersicht</Text>
      </TouchableOpacity>
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
  card: { borderRadius: 20, padding: 32, alignItems: 'center', gap: 8 },
  emoji: { fontSize: 52 },
  title: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  scoreNum: { fontSize: 48, fontWeight: '800' },
  scoreDivider: { fontSize: 24 },
  percent: { fontSize: 16 },
  button: { borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
