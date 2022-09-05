import { getUserStatistic, upsertUserStatistic } from '../../api/users/usersStatisticApi';
import state from '../../models/State';
import IGameWord from '../../types/IGameWord';
import { GameStatisticType, UserStatisticsOptionalInterface } from '../../types/UserStatisticsType';
import CustomElement from '../../utils/customElement';
import dateNow from '../../utils/dateNow';
import getOuterBall from './outerBall';
import drawChart from './sprintChart';

async function drawResults(
  gameField: CustomElement<'div'>,
  gameIntro: CustomElement<'div'>,
  gameWords: IGameWord[],
  timer: NodeJS.Timeout,
  score: number
) {
  clearTimeout(timer);
  gameField.element.innerHTML = '';

  const line = new CustomElement('span', {
    className: 'sprint__line',
  });

  const sprintBall = getOuterBall(1);
  sprintBall.classList.add('bottom');

  const resultTable = new CustomElement('div', {
    className: 'game__result__table',
  });
  gameField.addChildren([resultTable.element]);

  const resultHeader = new CustomElement('div', {
    className: 'result__table__header',
  });

  const resultTitle = new CustomElement('h2', {
    className: 'header__title',
    textContent: 'Результаты'.toUpperCase(),
  });

  const resultAgainButton = new CustomElement('button', {
    className: 'header__again-button',
    textContent: 'Повторить'.toUpperCase(),
  });

  resultAgainButton.element.addEventListener('click', () => {
    gameIntro.element.classList.remove('none');
    gameField.element.remove();
    document.body.classList.remove('dark-orange-background');
    const header = Array.from(document.body.children).filter((e) => e.classList.contains('header'))[0];
    document.body.classList.add('blue-background');
    if (header instanceof HTMLElement) {
      header.firstElementChild?.classList.remove('blue-color');
      header.firstElementChild?.classList.add('orange-color');
    }
    const main = Array.from(document.body.children).filter((e) => e.classList.contains('main'))[0];
    if (main instanceof HTMLElement) {
      main.firstElementChild?.firstElementChild?.classList.remove('sprint');
    }
    const footer = Array.from(document.body.children).filter((e) => e.classList.contains('footer'))[0];
    if (footer instanceof HTMLElement) {
      footer.hidden = false;
    }
  });

  resultHeader.addChildren([resultTitle.element, resultAgainButton.element]);

  const resultMain = new CustomElement('div', {
    className: 'result__table__main',
  });

  resultTable.addChildren([resultHeader.element, resultMain.element]);

  const resultTotalScore = new CustomElement('div', {
    className: 'game__result__total-score',
  });

  const resultScoreFirst = new CustomElement('p', {
    className: 'total-score__text',
    textContent: 'Вы набрали '.toUpperCase(),
  });

  const resultScorePoints = new CustomElement('p', {
    className: 'total-score__points',
    textContent: score.toString(),
  });

  const resultScoreSecond = new CustomElement('p', {
    className: 'total-score__text',
    textContent: ' баллов'.toUpperCase(),
  });

  resultTotalScore.addChildren([resultScoreFirst.element, resultScorePoints.element, resultScoreSecond.element]);

  const resultDiagram = new CustomElement('div', {
    className: 'game__result__diagram',
  });

  const diagramChart = new CustomElement('canvas', {
    className: 'diagram_chart',
  });

  resultDiagram.addChildren([diagramChart.element]);

  drawChart(gameWords, diagramChart);

  const points = new CustomElement('div', {
    className: 'game__result__points',
  });

  for (let i = 0; i < 3; i += 1) {
    const dotProgress = new CustomElement('div', {
      className: `game__result__points_dot${i}`,
    });
    points.addChildren([dotProgress.element]);
  }

  resultMain.addChildren([resultTotalScore.element, resultDiagram.element, points.element]);

  const correctWords = gameWords.filter((e) => e.guess !== null && e.guess);
  const incorrectWords = gameWords.filter((e) => e.guess !== null && !e.guess);

  function drawWords(arr: IGameWord[]) {
    arr.forEach((word) => {
      const wordLine = new CustomElement('div', {
        className: 'game__result__word-line',
      });

      const correctness = new CustomElement('div', {});

      if (word.guess) {
        correctness.element.classList.add('game__result__points_dot2');
      } else {
        correctness.element.classList.add('game__result__points_dot1');
      }

      const wordName = new CustomElement('p', {
        className: 'game__result__word',
        textContent: word.word.toUpperCase(),
      });

      const wordDash = new CustomElement('p', {
        className: 'game__result__word_dash',
        textContent: '-',
      });

      const wordTranslation = new CustomElement('p', {
        className: 'game__result__word_translation',
        textContent: word.wordTranslate.toUpperCase(),
      });

      wordLine.addChildren([correctness.element, wordName.element, wordDash.element, wordTranslation.element]);
      resultTable.addChildren([wordLine.element]);
    });
  }

  const correctTitle = new CustomElement('div', {
    className: 'game__result__title_cor',
    textContent: 'верно'.toUpperCase(),
  });

  resultTable.addChildren([correctTitle.element]);
  drawWords(correctWords);

  const incorrectTitle = new CustomElement('div', {
    className: 'game__result__title_incor',
    textContent: 'ошибки'.toUpperCase(),
  });

  resultTable.addChildren([incorrectTitle.element]);
  drawWords(incorrectWords);

  resultTable.addChildren([sprintBall, line.element]);

  async function addLoseAndWinWords(wordsWord: IGameWord) {
    if (state.user?.isAuthorized) {
      if (wordsWord.guess) {
        wordsWord.win = 1;
        wordsWord.lose = 0;
      } else {
        wordsWord.win = 0;
        wordsWord.lose = 1;
      }
      const word = state.user?.user.userWords?.filter((e) => e.wordId === wordsWord.id);
      if (!word || word.length === 0) {
        wordsWord.new = true;
        await state.user?.createUserWord(state.user.user, wordsWord.id, {
          difficulty: 'unmarked',
          optional: { win: wordsWord.win, lose: wordsWord.lose, learned: false },
        });
      } else {
        let dif = word[0].difficulty;
        const lost = word[0].optional.lose;
        const won = word[0].optional.win;
        let learn;
        const maxWins = dif === 'hard' ? 5 : 3;
        if (wordsWord.guess) {
          if (won + 1 >= maxWins) {
            dif = 'easy';
            learn = true;
          } else learn = false;
          await state.user?.updateUserWord(state.user.user, wordsWord.id, {
            difficulty: dif,
            optional: { win: won + 1, lose: lost, learned: learn },
          });
          wordsWord.learned = learn;
          wordsWord.win = won + 1;
          wordsWord.lose = lost;
          if (won === 0 && lost === 0) wordsWord.new = true;
        } else {
          if (dif === 'easy') dif = 'unmarked';
          learn = false;
          await state.user?.updateUserWord(state.user.user, wordsWord.id, {
            difficulty: dif,
            optional: { win: won, lose: lost + 1, learned: learn },
          });
          wordsWord.learned = learn;
          wordsWord.win = won;
          wordsWord.lose = lost + 1;
          if (won === 0 && lost === 0) wordsWord.new = true;
        }
      }
    }
  }

  await Promise.allSettled(
    gameWords.map(async (gameWord: IGameWord) => {
      await addLoseAndWinWords(gameWord);
    })
  );

  async function saveUserStatistic() {
    if (state.user?.isAuthorized) {
      const date = dateNow();
      const winsArr: number[] = [];
      const losesArr: number[] = [];
      let wins = 0;
      let loses = 0;
      gameWords.forEach((e) => {
        if (e.win) winsArr.push(e.win);
        if (e.lose) losesArr.push(e.lose);
      });
      if (winsArr.length > 0) wins = winsArr.reduce((sum, current) => sum + current);
      if (losesArr.length > 0) loses = losesArr.reduce((sum, current) => sum + current);
      let inRow = 0;
      let repeat = 0;
      gameWords.forEach((word) => {
        if (word.guess) repeat += 1;
        else {
          if (repeat > inRow) inRow = repeat;
          repeat = 0;
        }
      });
      if (repeat > inRow) inRow = repeat;
      const learnedWords = gameWords.filter((e) => e.learned).length;
      const newWords = gameWords.filter((e) => e.new).length;
      const accuracy = !(wins === 0 && loses === 0) ? wins / (wins + loses) : 0;
      const gameStatistic: GameStatisticType = {
        newWordsPerDay: newWords,
        answersAccuracy: accuracy,
        inRow,
        learned: learnedWords,
      };
      const optional: Record<number, UserStatisticsOptionalInterface> = {};
      optional[date] = {};

      const statistic = await getUserStatistic(state.user.user);
      if ('isUnsuccess' in statistic) {
        state.router?.view('/signIn');
      } else {
        Object.assign(optional, statistic.optional);
        const statisticLearnedWords = statistic.learnedWords + learnedWords;

        if ('optional' in statistic && date in statistic.optional) {
          const statisticDate = statistic.optional[date];
          const dayStatisticOptional: UserStatisticsOptionalInterface = {
            DAY: {
              newWordsPerDay: gameStatistic.newWordsPerDay + statisticDate.DAY.newWordsPerDay,
              answersAccuracy: (accuracy + statisticDate.DAY.answersAccuracy) / 2,
              inRow: inRow > statisticDate.DAY.inRow ? inRow : statisticDate.DAY.inRow,
              learned: learnedWords + statisticDate.DAY.learned,
            },
          };
          if ('SPRINT' in statistic.optional[date]) {
            const gameStatisticOptional: UserStatisticsOptionalInterface = {
              SPRINT: {
                newWordsPerDay: gameStatistic.newWordsPerDay + statisticDate.SPRINT.newWordsPerDay,
                answersAccuracy: (gameStatistic.answersAccuracy + statisticDate.SPRINT.answersAccuracy) / 2,
                inRow: gameStatistic.inRow > statisticDate.SPRINT.inRow ? gameStatistic.inRow : statisticDate.DAY.inRow,
                learned: gameStatistic.learned + statisticDate.SPRINT.learned,
              },
            };
            Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
          } else {
            const gameStatisticOptional: UserStatisticsOptionalInterface = {
              SPRINT: gameStatistic,
            };
            Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
          }
        } else {
          const dayStatisticOptional: UserStatisticsOptionalInterface = {
            DAY: {
              newWordsPerDay: gameStatistic.newWordsPerDay,
              answersAccuracy: accuracy,
              inRow,
              learned: learnedWords,
            },
          };
          const gameStatisticOptional: UserStatisticsOptionalInterface = {
            SPRINT: gameStatistic,
          };
          Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
        }

        const responseUpdStatistic = await upsertUserStatistic(state.user.user, {
          learnedWords: statisticLearnedWords,
          optional,
        });
        if ('isUnsuccess' in responseUpdStatistic) {
          state.router?.view('/signIn');
        }
      }
    }
  }

  await saveUserStatistic();
}

export default drawResults;
