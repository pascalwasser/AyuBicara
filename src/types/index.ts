export type ExerciseSentence = {
  id: string;
  german: string;
  indonesian: string;
  wordBank: string[];
};

export type ExerciseSet = {
  id: string;
  sentences: ExerciseSentence[];
};

export type StoryLine =
  | { type: 'dialogue'; speaker: 'A' | 'B'; indonesian: string; german?: string }
  | { type: 'narration'; indonesian: string; german?: string }
  | { type: 'emoji'; content: string };

export type Topic = {
  id: string;
  title: string;
  targetWordIds: string[];
  story: StoryLine[];
  exercises: ExerciseSet[];
};

export type Tier = {
  id: string;
  label: string;
  description: string;
  topics: Topic[];
};

export type RootStackParamList = {
  Home: undefined;
  TopicDetail: { topicId: string };
  Story: { topicId: string };
  Exercise: { topicId: string; exerciseSetId: string };
  Vocabulary: { topicId: string };
  Result: { topicId: string; exerciseSetId: string; score: number; total: number };
};
