import config from '../models/Config';
import { wordsFromAPI } from '../api/words/wordsApi';
import AudioChallengeModel from '../models/AudioChallengeModel';
import state from '../models/State';
import IWord from '../types/IWord';
import { createUserWord, getUserAggregatedWords, updateUserWord } from '../api/users/usersWordsApi';
import { GroupType, PageType } from '../types/SectionTypes';
import { UserWordsForGame } from '../types/UserWordParameters';
import dateNow from '../utils/dateNow';
import { getUserStatistic, upsertUserStatistic } from '../api/users/usersStatisticApi';
import { GameStatisticType, UserStatisticsOptionalInterface } from '../types/UserStatisticsType';
import winSample from '../assets/sounds/win.mp3';
import loseSample from '../assets/sounds/lose.mp3';

export default class AudioChallengeController {
  model: AudioChallengeModel;

  constructor(model: AudioChallengeModel) {
    this.model = model;
  }

  eventHandler(e: KeyboardEvent) {
    if (this.model.words && this.model.answers) {
      if (e.code === 'Space') {
        const word = this.model.words[this.model.currentWord];
        const wordAudio = new Audio(`${config.API.URL}/${word.audio}`);
        wordAudio.play();
      }
      if (e.code === 'Enter') {
        this.next();
      }
      if (e.code === 'Digit1') {
        const answer = this.model.answers[0];
        this.try(answer);
      }
      if (e.code === 'Digit2') {
        const answer = this.model.answers[1];
        this.try(answer);
      }
      if (e.code === 'Digit3') {
        const answer = this.model.answers[2];
        this.try(answer);
      }
      if (e.code === 'Digit4') {
        const answer = this.model.answers[3];
        this.try(answer);
      }
      if (e.code === 'Digit5') {
        const answer = this.model.answers[4];
        this.try(answer);
      }
    }
  }

  async getWords(g: string, p: string) {
    this.model.listener = this.eventHandler.bind(this);
    document.addEventListener('keypress', this.model.listener);
    window.addEventListener('hashchange', () => {
      if (this.model.listener) {
        document.removeEventListener('keypress', this.model.listener);
      }
    });

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
        if (words.length === 0) {
          state.events?.notify('gameNoWords');
          return false;
        }
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
    return true;
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

      if (this.model.trueAnswer === this.model.userAnswer) {
        const winSound = new Audio(winSample);
        winSound.play();
      } else {
        const loseSound = new Audio(loseSample);
        loseSound.play();
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
        if (this.model.trueAnswer === this.model.userAnswer) {
          const winSound = new Audio(winSample);
          winSound.play();
        } else {
          const loseSound = new Audio(loseSample);
          loseSound.play();
        }
      }
      this.model.currentWord += 1;

      if (this.model.currentWord >= this.model.words?.length) {
        this.model.currentWord = 0;
        if (state.user?.isAuthorized) {
          this.saveUserStatistic();
        }
        if (this.model.listener) {
          document.removeEventListener('keypress', this.model.listener);
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
      if (userWord.optional.win === 0 && userWord.optional.lose === 0) {
        this.model.newWords += 1;
      }

      if (this.model.userAnswer === this.model.trueAnswer) {
        const maxWins = userWord.difficulty === 'hard' ? 5 : 3;
        userWord.optional.win += 1;
        if (userWord.optional.win >= maxWins) {
          userWord.optional.learned = true;
          userWord.difficulty = 'easy';
          this.model.learnedWords += 1;
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
      this.model.newWords += 1;
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

  async saveUserStatistic() {
    const wins = this.model.gameStatistic.win.length;
    const loses = this.model.gameStatistic.lose.length;
    const date = dateNow();
    const { learnedWords } = this.model;
    const gameStatistic: GameStatisticType = {
      newWordsPerDay: this.model.newWords,
      answersAccuracy: wins / (wins + loses),
      inRow: this.model.winSeries,
      learned: learnedWords,
    };
    const optional: Record<number, UserStatisticsOptionalInterface> = {};
    optional[date] = {};

    if (state.user) {
      const { userId, token } = state.user;
      const statistic = await getUserStatistic({ userId, token });

      if ('isUnsuccess' in statistic) {
        state.router?.view('/signIn');
      } else if ('isNotFound' in statistic) {
        // Этого не должно происходить
        console.log(statistic);
      } else {
        Object.assign(optional, statistic.optional);
        const statisticLearnedWords = statistic.learnedWords + learnedWords;

        if ('optional' in statistic && date in statistic.optional) {
          const statisticDate = statistic.optional[date];
          const dayStatisticOptional: UserStatisticsOptionalInterface = {
            DAY: {
              newWordsPerDay: this.model.newWords + statisticDate.DAY.newWordsPerDay,
              answersAccuracy: (wins / (wins + loses) + statisticDate.DAY.answersAccuracy) / 2,
              inRow: this.model.winSeries > statisticDate.DAY.inRow ? this.model.winSeries : statisticDate.DAY.inRow,
              learned: learnedWords + statisticDate.DAY.learned,
            },
          };
          if ('AUDIOCHALLENGE' in statistic.optional[date]) {
            const gameStatisticOptional: UserStatisticsOptionalInterface = {
              AUDIOCHALLENGE: {
                newWordsPerDay: gameStatistic.newWordsPerDay + statisticDate.AUDIOCHALLENGE.newWordsPerDay,
                answersAccuracy: (gameStatistic.answersAccuracy + statisticDate.AUDIOCHALLENGE.answersAccuracy) / 2,
                inRow:
                  gameStatistic.inRow > statisticDate.AUDIOCHALLENGE.inRow
                    ? gameStatistic.inRow
                    : statisticDate.DAY.inRow,
                learned: gameStatistic.learned + statisticDate.AUDIOCHALLENGE.learned,
              },
            };
            Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
          } else {
            const gameStatisticOptional: UserStatisticsOptionalInterface = {
              AUDIOCHALLENGE: gameStatistic,
            };
            Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
          }
        } else {
          const dayStatisticOptional: UserStatisticsOptionalInterface = {
            DAY: {
              newWordsPerDay: this.model.newWords,
              answersAccuracy: wins / (wins + loses),
              inRow: this.model.winSeries,
              learned: learnedWords,
            },
          };
          const gameStatisticOptional: UserStatisticsOptionalInterface = {
            AUDIOCHALLENGE: gameStatistic,
          };
          Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
        }

        const responseUpdStatistic = await upsertUserStatistic(
          { userId, token },
          { learnedWords: statisticLearnedWords, optional }
        );
        if ('isUnsuccess' in responseUpdStatistic) {
          state.router?.view('/signIn');
        } else if ('isBad' in responseUpdStatistic) {
          // Этого не должно происходить
          console.log(responseUpdStatistic);
        } else {
          console.log('Statistic updated');
        }
      }
    }
  }
}
