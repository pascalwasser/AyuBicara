import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import curriculumData from '../data/curriculum.json';
import { Tier, Topic, ExerciseSet, ExerciseSentence } from '../types';

const BEST_SCORES_KEY = 'bestScores_v2';

type CurriculumStore = {
  tiers: Tier[];
  bestScores: Record<string, number>;
  currentTopic: Topic | null;
  currentExerciseSet: ExerciseSet | null;
  currentIndex: number;
  score: number;

  loadBestScores: () => Promise<void>;
  startExercise: (topic: Topic, exerciseSet: ExerciseSet) => void;
  submitAnswer: (correct: boolean) => void;
  nextSentence: () => void;
  currentSentence: () => ExerciseSentence | null;
  progress: () => number;
  saveBestScore: (exerciseSetId: string, score: number) => Promise<void>;
};

export const useCurriculumStore = create<CurriculumStore>((set, get) => ({
  tiers: curriculumData.tiers as Tier[],
  bestScores: {},
  currentTopic: null,
  currentExerciseSet: null,
  currentIndex: 0,
  score: 0,

  loadBestScores: async () => {
    const raw = await AsyncStorage.getItem(BEST_SCORES_KEY);
    if (raw) set({ bestScores: JSON.parse(raw) });
  },

  startExercise: (topic, exerciseSet) => {
    set({ currentTopic: topic, currentExerciseSet: exerciseSet, currentIndex: 0, score: 0 });
  },

  submitAnswer: (correct) => {
    if (correct) set((s) => ({ score: s.score + 1 }));
  },

  nextSentence: () => {
    set((s) => ({ currentIndex: s.currentIndex + 1 }));
  },

  currentSentence: () => {
    const { currentExerciseSet, currentIndex } = get();
    if (!currentExerciseSet) return null;
    if (currentIndex >= currentExerciseSet.sentences.length) return null;
    return currentExerciseSet.sentences[currentIndex];
  },

  progress: () => {
    const { currentExerciseSet, currentIndex } = get();
    if (!currentExerciseSet) return 0;
    return currentIndex / currentExerciseSet.sentences.length;
  },

  saveBestScore: async (exerciseSetId, score) => {
    const { bestScores } = get();
    const current = bestScores[exerciseSetId] ?? 0;
    if (score <= current) return;
    const updated = { ...bestScores, [exerciseSetId]: score };
    set({ bestScores: updated });
    await AsyncStorage.setItem(BEST_SCORES_KEY, JSON.stringify(updated));
  },
}));
