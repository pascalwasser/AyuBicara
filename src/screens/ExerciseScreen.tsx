import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSessionStore } from '../store/useSessionStore';
import WordTile from '../components/WordTile';
import { useColors } from '../theme';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Exercise'>;
type Route = RouteProp<RootStackParamList, 'Exercise'>;

export default function ExerciseScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const store = useSessionStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [bank, setBank] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const sentence = store.currentSentence();
  const progress = store.progress();

  useEffect(() => { resetSentence(); }, [store.currentIndex]);

  function resetSentence() {
    const s = store.currentSentence();
    if (!s) return;
    setBank([...s.wordBank].sort(() => Math.random() - 0.5));
    setAnswer([]);
    setChecked(false);
    setIsCorrect(false);
  }

  function addToAnswer(word: string) {
    if (checked) return;
    setBank((b) => { const i = b.indexOf(word); return [...b.slice(0, i), ...b.slice(i + 1)]; });
    setAnswer((a) => [...a, word]);
  }

  function returnToBank(index: number) {
    if (checked) return;
    const word = answer[index];
    setAnswer((a) => [...a.slice(0, index), ...a.slice(index + 1)]);
    setBank((b) => [...b, word]);
  }

  function handleCheck() {
    const correct = answer.join(' ') === sentence!.indonesian;
    setIsCorrect(correct);
    setChecked(true);
    store.submitAnswer(correct);
  }

  function handleNext() {
    const { currentSession, currentIndex, score } = store;
    const total = currentSession!.sentences.length;
    if (currentIndex + 1 >= total) {
      navigation.replace('Result', {
        sessionId: route.params.sessionId,
        score: store.score,
        total,
      });
    } else {
      store.nextSentence();
    }
  }

  function tileStyle(index: number): 'selected' | 'correct' | 'incorrect' {
    if (!checked) return 'selected';
    const correctWords = sentence!.indonesian.split(' ');
    if (index < correctWords.length && answer[index] === correctWords[index]) return 'correct';
    return 'incorrect';
  }

  if (!sentence) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.progressBar, { marginTop: insets.top, backgroundColor: colors.progressBg }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.germanCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.germanLabel, { color: colors.textSecondary }]}>Übersetze ins Indonesische</Text>
          <Text style={[styles.germanText, { color: colors.text }]}>{sentence.german}</Text>
        </View>

        <View style={styles.answerArea}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Deine Antwort</Text>
          <View style={[styles.answerBox, { backgroundColor: colors.card }, checked && (isCorrect ? styles.answerCorrect : styles.answerIncorrect)]}>
            {answer.length === 0 ? (
              <Text style={[styles.placeholder, { color: colors.textTertiary }]}>Tippe auf Wörter unten</Text>
            ) : (
              <View style={styles.tileWrap}>
                {answer.map((word, i) => (
                  <WordTile key={i} word={word} tileStyle={tileStyle(i)} onPress={() => returnToBank(i)} colors={colors} />
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.tileWrap}>
          {bank.map((word, i) => (
            <WordTile key={i} word={word} tileStyle="bank" onPress={() => addToAnswer(word)} colors={colors} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.bg, paddingBottom: insets.bottom + 12 }]}>
        {checked && (
          <View style={styles.feedback}>
            <Text style={[styles.feedbackText, { color: isCorrect ? '#22c55e' : '#ef4444' }]}>
              {isCorrect ? '✓ Richtig!' : `✗ Falsch — ${sentence.indonesian}`}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: answer.length === 0 && !checked ? colors.progressBg : colors.accent }]}
          onPress={checked ? handleNext : handleCheck}
          disabled={answer.length === 0 && !checked}
        >
          <Text style={styles.buttonText}>{checked ? 'Weiter' : 'Überprüfen'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressBar: { height: 6 },
  progressFill: { height: 6 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 20 },
  germanCard: { borderRadius: 12, padding: 16 },
  germanLabel: { fontSize: 12, marginBottom: 4 },
  germanText: { fontSize: 20, fontWeight: '600' },
  answerArea: { gap: 8 },
  sectionLabel: { fontSize: 12 },
  answerBox: {
    minHeight: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 8,
    justifyContent: 'center',
  },
  answerCorrect: { borderColor: '#22c55e' },
  answerIncorrect: { borderColor: '#ef4444' },
  placeholder: { fontSize: 13, padding: 4 },
  tileWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: { paddingHorizontal: 16, paddingTop: 8, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 },
  feedback: { paddingVertical: 8 },
  feedbackText: { fontSize: 15, fontWeight: '500' },
  button: { borderRadius: 14, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
