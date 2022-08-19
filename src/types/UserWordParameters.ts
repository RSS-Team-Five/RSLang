export type DifficultyType = 'easy' | 'hard';
export type OptionalType = {
  repeat: boolean;
  key: string;
};

export type UserWordsType = {
  id: string;
  wordId: string;
  difficulty: DifficultyType;
  optional: OptionalType;
};
