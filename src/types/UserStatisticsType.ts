export type UserStatisticsType = {
  learnedWords: number;
  optional: Record<number, UserStatisticsOptionalInterface>;
};

export interface UserStatisticsOptionalInterface {
  DAY?: GameStatisticType;
  AUDIOCHALLENGE?: GameStatisticType;
  SPRINT?: GameStatisticType;
}

export type GameStatisticType = {
  newWordsPerDay: number;
  answersAccuracy: number;
  inRow: number;
  learned: number;
};
