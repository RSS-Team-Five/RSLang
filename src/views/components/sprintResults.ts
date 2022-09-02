import { getUserStatistic, upsertUserStatistic } from '../../api/users/usersStatisticApi';
import state from '../../models/State';
import IGameWord from '../../types/IGameWord';
import { GameStatisticType, UserStatisticsOptionalInterface } from '../../types/UserStatisticsType';
import CustomElement from '../../utils/customElement';
import dateNow from '../../utils/dateNow';
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
  const resultTable = new CustomElement('div', {
    className: 'game__result__table',
  });
  gameField.addChildren([resultTable.element]);

  const resultHeader = new CustomElement('div', {
    className: 'result__table__header',
  });

  const resultTitle = new CustomElement('h2', {
    className: 'header__title',
    textContent: 'Результаты',
  });

  const resultAgainButton = new CustomElement('button', {
    className: 'header__again-button',
    textContent: 'Повторить',
  });

  resultAgainButton.element.addEventListener('click', () => {
    gameIntro.element.classList.remove('none');
    gameField.element.remove();
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
    textContent: 'Вы набрали ',
  });

  const resultScorePoints = new CustomElement('p', {
    className: 'total-score__points',
    textContent: score.toString(),
  });

  const resultScoreSecond = new CustomElement('p', {
    className: 'total-score__text',
    textContent: ' баллов',
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

  resultMain.addChildren([resultTotalScore.element, resultDiagram.element]);

  gameWords.forEach((word) => {
    if (word.guess !== null) {
      const wordLine = new CustomElement('div', {
        className: 'game__result__word-line',
      });

      const correctness = new CustomElement('div', {
        className: 'game__result__word__correctness',
      });

      if (word.guess) {
        correctness.element.classList.add('correct_green');
      } else {
        correctness.element.classList.add('correct_red');
      }

      const wordName = new CustomElement('p', {
        className: 'game__result__word',
        textContent: word.word,
      });

      const wordDash = new CustomElement('p', {
        className: 'game__result__word_dash',
        textContent: '-',
      });

      const wordTranslation = new CustomElement('p', {
        className: 'game__result__word_translation',
        textContent: word.wordTranslate,
      });

      wordLine.addChildren([correctness.element, wordName.element, wordDash.element, wordTranslation.element]);

      resultTable.addChildren([wordLine.element]);
    }
  });

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
      }
      let statisticLearnedWords;

      if ('optional' in statistic && date in statistic.optional) {
        statisticLearnedWords = statistic.learnedWords + learnedWords;
        const statisticDate = statistic.optional[date];
        const dayStatisticOptional: UserStatisticsOptionalInterface = {
          DAY: {
            newWordsPerDay: gameStatistic.newWordsPerDay + statisticDate.DAY.newWordsPerDay,
            answersAccuracy: (accuracy + statisticDate.DAY.answersAccuracy) / 2,
            inRow: inRow > statisticDate.DAY.inRow ? inRow : statisticDate.DAY.inRow,
            learned: learnedWords + statisticDate.DAY.learned,
          },
        };
        if (statistic.optional[date].SPRINT) {
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
            SPRINT: {
              newWordsPerDay: gameStatistic.newWordsPerDay,
              answersAccuracy: gameStatistic.answersAccuracy / 2,
              inRow: gameStatistic.inRow,
              learned: gameStatistic.learned,
            },
          };
          Object.assign(optional[date], dayStatisticOptional, gameStatisticOptional);
        }
      } else {
        statisticLearnedWords = learnedWords;
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

  await saveUserStatistic();

  const stat = await state.user?.getUserStatistic(state.user.user);
  console.log(stat);
}

export default drawResults;
