import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import sessionsData from '../data/sessions.json';
import { LessonSession, Sentence } from '../types';

const BEST_SCORES_KEY = 'bestScores';

type SessionStore = {
  allSessions: LessonSession[];
  bestScores: Record<string, number>;
  currentSession: LessonSession | null;
  currentIndex: number;
  score: number;

  loadBestScores: () => Promise<void>;
  startSession: (session: LessonSession) => void;
  submitAnswer: (correct: boolean) => void;
  nextSentence: () => void;
  currentSentence: () => Sentence | null;
  progress: () => number;
  saveBestScore: (sessionId: string, score: number) => Promise<void>;
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  allSessions: sessionsData as LessonSession[],
  bestScores: {},
  currentSession: null,
  currentIndex: 0,
  score: 0,

  loadBestScores: async () => {
    const raw = await AsyncStorage.getItem(BEST_SCORES_KEY);
    if (raw) set({ bestScores: JSON.parse(raw) });
  },

  startSession: (session) => {
    set({ currentSession: session, currentIndex: 0, score: 0 });
  },

  submitAnswer: (correct) => {
    if (correct) set((s) => ({ score: s.score + 1 }));
  },

  nextSentence: () => {
    set((s) => ({ currentIndex: s.currentIndex + 1 }));
  },

  currentSentence: () => {
    const { currentSession, currentIndex } = get();
    if (!currentSession) return null;
    if (currentIndex >= currentSession.sentences.length) return null;
    return currentSession.sentences[currentIndex];
  },

  progress: () => {
    const { currentSession, currentIndex } = get();
    if (!currentSession) return 0;
    return currentIndex / currentSession.sentences.length;
  },

  saveBestScore: async (sessionId, score) => {
    const { bestScores } = get();
    const current = bestScores[sessionId] ?? 0;
    if (score <= current) return;
    const updated = { ...bestScores, [sessionId]: score };
    set({ bestScores: updated });
    await AsyncStorage.setItem(BEST_SCORES_KEY, JSON.stringify(updated));
  },
}));
