export type DifficultyType = 'easy' | 'hard' | 'unmarked';
export type OptionalType = {
  win: number;
  lose: number;
  learned: boolean;
  new: Date | null;
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
