import IWord from '../types/IWord';

export default class AudioChallengeModel {
  listener?: (this: Document, ev: KeyboardEvent) => void;
  words: IWord[] | null;
  currentWord: number;
  trueAnswer: IWord | null;
  answers: IWord[] | null;
  userAnswer: IWord | null;
  attempts: number;
  lastAnswerWin: boolean;
  winSeries: number;
  newWords: number;
  learnedWords: number;
  gameStatistic: { win: IWord[]; lose: IWord[]; winSeries: number; score: number };
  sound: boolean;

  constructor() {
    this.words = null;
    this.currentWord = 0;
    this.trueAnswer = null;
    this.answers = null;
    this.userAnswer = null;
    this.attempts = 1;
    this.lastAnswerWin = false;
    this.winSeries = 0;
    this.newWords = 0;
    this.learnedWords = 0;
    this.gameStatistic = { win: [], lose: [], winSeries: 0, score: 0 };
    this.sound = true;
  }
}
