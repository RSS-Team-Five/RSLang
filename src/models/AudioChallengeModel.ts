import IWord from '../types/IWord';

export default class AudioChallengeModel {
  words: IWord[] | null;
  currentWord: number;
  answers: IWord[] | null;
  attempts: number;
  statistic: {};

  constructor() {
    this.words = null;
    this.currentWord = 0;
    this.answers = null;
    this.attempts = 1;
    this.statistic = {};
  }
}
