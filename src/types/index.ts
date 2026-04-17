export type Sentence = {
  id: number;
  german: string;
  indonesian: string;
  wordBank: string[];
};

export type LessonSession = {
  id: string;
  title: string;
  subtitle: string;
  sentences: Sentence[];
};

export type RootStackParamList = {
  SessionList: undefined;
  Exercise: { sessionId: string };
  Result: { sessionId: string; score: number; total: number };
};
