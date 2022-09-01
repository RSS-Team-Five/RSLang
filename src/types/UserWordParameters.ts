export type DifficultyType = 'easy' | 'hard' | 'unmarked';
export type OptionalType = {
  win: number;
  lose: number;
  learned: boolean;
};

export type UserWordsType = {
  id: string;
  wordId: string;
  difficulty: DifficultyType;
  optional: OptionalType;
};

export type UserWordsForGame = {
  difficulty: DifficultyType;
  optional: OptionalType;
};
