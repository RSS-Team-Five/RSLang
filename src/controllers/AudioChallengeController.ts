import config from '../models/Config';
import { wordsFromAPI } from '../api/words/wordsApi';
import AudioChallengeModel from '../models/AudioChallengeModel';
import state from '../models/State';
import IWord from '../types/IWord';

export default class AudioChallengeController {
  model: AudioChallengeModel;

  constructor(model: AudioChallengeModel) {
    this.model = model;
  }

  async getWords(group: string, page: string) {
    if (page !== 'all') {
      const words = await wordsFromAPI(Number(group), Number(page));
      // TODO проверка на 'easy'
      // TODO если меньше 20 слов, взять предыдущую страницу
      console.log(words);
    } else {
      const wordsPromises = [];
      for (let pageCounter = 0; pageCounter <= config.BOOK.maxPage; pageCounter += 1) {
        wordsPromises.push(wordsFromAPI(Number(group), pageCounter));
      }
      const words = (await Promise.all(wordsPromises)) as IWord[];
      this.model.words = words
        .flat()
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
      this.model.currentWord = 0;
      this.getAnswers();
      state.events?.notify('audioChallengeModelUpd');
    }
  }

  getAnswers() {
    if (this.model.words) {
      const trueAnswer = this.model.words[this.model.currentWord];
      const answers = this.model.words
        .filter((el) => el !== trueAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      this.model.answers = answers.concat(trueAnswer).sort(() => Math.random() - 0.5);
    }
  }

  try() {
    this.model.attempts = 0;
    state.events?.notify('audioChallengeModelUpd');
  }

  next() {
    if (this.model.words) {
      this.model.currentWord += 1;
      if (this.model.currentWord >= this.model.words?.length) {
        this.model.currentWord = 0;
        state.events?.notify('audioChallengeResult');
      } else {
        this.model.attempts = 1;
        this.getAnswers();
        state.events?.notify('audioChallengeModelUpd');
      }
    }
  }
}
