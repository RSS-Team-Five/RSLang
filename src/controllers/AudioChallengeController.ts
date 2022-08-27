import config from '../models/Config';
import { wordsFromAPI } from '../api/words/wordsApi';
import AudioChallengeModel from '../models/AudioChallengeModel';
import state from '../models/State';

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
      const words = await Promise.all(wordsPromises);
      this.model.words = words
        .flat()
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);

      state.events?.notify('audioChallengeModelUpd');
    }
  }
}
