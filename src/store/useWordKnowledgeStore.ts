import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wordKnowledge_v1';

export type WordStatus = 'unknown' | 'learning' | 'known';

type WordKnowledgeStore = {
  counts: Record<string, number>;
  load: () => Promise<void>;
  incrementWords: (wordIds: string[]) => Promise<void>;
  getStatus: (wordId: string) => WordStatus;
  getCount: (wordId: string) => number;
};

export const useWordKnowledgeStore = create<WordKnowledgeStore>((set, get) => ({
  counts: {},

  load: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) set({ counts: JSON.parse(raw) });
  },

  incrementWords: async (wordIds) => {
    const { counts } = get();
    const updated = { ...counts };
    for (const id of wordIds) {
      updated[id] = (updated[id] ?? 0) + 1;
    }
    set({ counts: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getStatus: (wordId) => {
    const count = get().counts[wordId] ?? 0;
    if (count === 0) return 'unknown';
    if (count < 5) return 'learning';
    return 'known';
  },

  getCount: (wordId) => get().counts[wordId] ?? 0,
}));
