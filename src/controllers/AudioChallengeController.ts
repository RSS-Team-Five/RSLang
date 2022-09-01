import config from '../models/Config';
import { wordsFromAPI } from '../api/words/wordsApi';
import AudioChallengeModel from '../models/AudioChallengeModel';
import state from '../models/State';
import IWord from '../types/IWord';
import { createUserWord, getUserAggregatedWords, updateUserWord } from '../api/users/usersWordsApi';
import { GroupType, PageType } from '../types/SectionTypes';
import { UserWordsForGame } from '../types/UserWordParameters';

export default class AudioChallengeController {
  model: AudioChallengeModel;

  constructor(model: AudioChallengeModel) {
    this.model = model;
  }

  async getWords(g: string, p: string) {
    const group: GroupType = Number(g) < 0 || Number(g) >= config.BOOK.maxGroup ? 0 : (Number(g) as GroupType);

    let words;
    if (state.user?.isAuthorized) {
      words = await getUserAggregatedWords(
        { userId: state.user.userId, token: state.user.token },
        { group, wordsPerPage: 600 }
      );
      words = words[0].paginatedResults;
      if (p !== 'all') {
        const page: PageType = Number(p) < 0 || Number(p) >= config.BOOK.maxPage ? 0 : (Number(p) as PageType);
        words = words.filter((word: IWord) => word.userWord?.difficulty !== 'easy' && word.page <= page).slice(-20);
      }
    } else {
      const wordsPromises: Promise<unknown>[] = [];
      const randomPage = new Set();
      while (randomPage.size < 10) {
        randomPage.add(Math.floor(Math.random() * config.BOOK.maxPage));
      }

      randomPage.forEach((page) => {
        if (typeof page === 'number') {
          wordsPromises.push(wordsFromAPI(Number(group), page));
        }
      });

      words = (await Promise.all(wordsPromises)) as IWord[];
      words = words.flat();
    }

    this.model.words = words.sort(() => Math.random() - 0.5).slice(0, 20);
    this.model.currentWord = 0;
    this.getAnswers();
    state.events?.notify('audioChallengeModelUpd');
  }

  getAnswers() {
    if (this.model.words) {
      const trueAnswer = this.model.words[this.model.currentWord];
      this.model.trueAnswer = trueAnswer;
      const answers = this.model.words
        .filter((el) => el !== trueAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
      this.model.answers = answers.concat(trueAnswer).sort(() => Math.random() - 0.5);
    }
  }

  try(answer: IWord) {
    if (this.model.trueAnswer) {
      this.model.userAnswer = answer;
      this.model.attempts = 0;
      this.gameStatistic();
      if (state.user?.isAuthorized) {
        this.userStatistic();
      }
      state.events?.notify('audioChallengeModelUpd');
    }
  }

  next() {
    if (this.model.words) {
      if (this.model.attempts !== 0) {
        this.model.userAnswer = null;
        this.gameStatistic();
        if (state.user?.isAuthorized) {
          this.userStatistic();
        }
      }
      this.model.currentWord += 1;

      if (this.model.currentWord >= this.model.words?.length) {
        this.model.currentWord = 0;
        if (state.user?.isAuthorized) {
          this.saveUserStatistic();
        }
        state.events?.notify('audioChallengeResult');
      } else {
        this.model.attempts = 1;
        this.getAnswers();
        state.events?.notify('audioChallengeModelUpd');
      }
    }
  }

  gameStatistic() {
    if (this.model.userAnswer === this.model.trueAnswer) {
      this.model.gameStatistic.win?.push(this.model.trueAnswer!);
      this.model.gameStatistic.score += 10;
      if (this.model.lastAnswerWin) {
        this.model.winSeries += 1;
      } else {
        this.model.lastAnswerWin = true;
        this.model.winSeries = 1;
      }
      this.model.gameStatistic.winSeries =
        this.model.gameStatistic.winSeries > this.model.winSeries
          ? this.model.gameStatistic.winSeries
          : this.model.winSeries;
    } else {
      this.model.gameStatistic.lose?.push(this.model.trueAnswer!);
      this.model.lastAnswerWin = false;
    }
  }

  async userStatistic() {
    if (this.model.trueAnswer?.userWord) {
      const userWord = this.model.trueAnswer?.userWord;

      if (this.model.userAnswer === this.model.trueAnswer) {
        const maxWins = userWord.difficulty === 'hard' ? 5 : 3;
        userWord.optional.win += 1;
        if (userWord.optional.win >= maxWins) {
          userWord.optional.learned = true;
          userWord.difficulty = 'easy';
          // TODO добавить в статистику +1 learned
        }
      } else {
        userWord.optional.lose += 1;
        userWord.optional.learned = false;
        if (userWord.difficulty === 'easy') {
          userWord.difficulty = 'unmarked';
        }
      }

      if (state.user && this.model.trueAnswer) {
        const { _id: wordId } = this.model.trueAnswer;
        if (wordId) {
          await updateUserWord({ userId: state.user.userId, token: state.user.token }, wordId, userWord);
        }
      }
    } else {
      const win = this.model.userAnswer === this.model.trueAnswer ? 1 : 0;
      const lose = this.model.userAnswer === this.model.trueAnswer ? 0 : 1;
      const userWord: UserWordsForGame = {
        difficulty: 'unmarked',
        optional: { win, lose, learned: false },
      };

      if (state.user && this.model.trueAnswer) {
        const { _id: wordId } = this.model.trueAnswer;
        if (wordId) {
          await createUserWord({ userId: state.user.userId, token: state.user.token }, wordId, userWord);
        }
      }
    }

    return this;
  }

  saveUserStatistic() {
    return this;
  }
}
