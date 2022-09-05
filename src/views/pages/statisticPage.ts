import { Chart } from 'chart.js';
import state from '../../models/State';
import { UserStatisticsOptionalInterface } from '../../types/UserStatisticsType';
import CustomElement from '../../utils/customElement';
import dateNow from '../../utils/dateNow';
import getOuterBall from '../components/outerBall';

const ZERO_STATS: UserStatisticsOptionalInterface = {
  DAY: { newWordsPerDay: 0, answersAccuracy: 0, inRow: 0, learned: 0 },
  AUDIOCHALLENGE: { newWordsPerDay: 0, answersAccuracy: 0, inRow: 0, learned: 0 },
  SPRINT: { newWordsPerDay: 0, answersAccuracy: 0, inRow: 0, learned: 0 },
};

function templateWordStatistic(statistic: UserStatisticsOptionalInterface) {
  const { newWordsPerDay, answersAccuracy, learned } = statistic.DAY !== undefined ? statistic.DAY : ZERO_STATS.DAY!;
  const wordsStatistic = new CustomElement('div', { className: 'today__words words-stats' });
  const wordsStatisticWrapper = new CustomElement('div', { className: 'words-stats__wrapper' });

  const wordsNewLine = new CustomElement('div', { className: 'words-stats__line line' });
  const wordsNewText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Новых слов',
  });
  const wordsNewData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${newWordsPerDay}`,
  });
  wordsNewLine.addChildren([wordsNewText.element, wordsNewData.element]);

  const wordsLearnedLine = new CustomElement('div', { className: 'words-stats__line line' });
  const wordsLearnedText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Слов изучено',
  });
  const wordsLearnedData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${learned}`,
  });
  wordsLearnedLine.addChildren([wordsLearnedText.element, wordsLearnedData.element]);

  const wordsAccuracyLine = new CustomElement('div', { className: 'words-stats__line line' });
  const wordsAccuracyText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Правильных ответов',
  });
  const wordsAccuracyData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${(answersAccuracy * 100).toFixed()}%`,
  });
  wordsAccuracyLine.addChildren([wordsAccuracyText.element, wordsAccuracyData.element]);

  wordsStatisticWrapper.addChildren([wordsNewLine.element, wordsLearnedLine.element, wordsAccuracyLine.element]);
  wordsStatistic.addChildren([wordsStatisticWrapper.element]);
  return wordsStatistic.element;
}

function templateAudioStatistic(statistic: UserStatisticsOptionalInterface) {
  const { newWordsPerDay, answersAccuracy, inRow } =
    statistic.AUDIOCHALLENGE !== undefined ? statistic.AUDIOCHALLENGE : ZERO_STATS.AUDIOCHALLENGE!;
  const audioStatistic = new CustomElement('div', { className: 'today__audio audio-stats' });

  const audioImage = getOuterBall(2);
  const audioWrapper = new CustomElement('div', { className: 'audio-stats__wrapper' });
  const audioHeader = new CustomElement('h4', { className: 'audio-stats__header', innerText: 'Аудио вызов' });

  const audioNewLine = new CustomElement('div', { className: 'audio-stats__line line' });
  const audioNewText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Новых слов:',
  });
  const audioNewData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${newWordsPerDay}`,
  });
  audioNewLine.addChildren([audioNewText.element, audioNewData.element]);

  const audioAccuracyLine = new CustomElement('div', { className: 'audio-stats__line line' });
  const audioAccuracyText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Правильных ответов:',
  });
  const audioAccuracyData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${(answersAccuracy * 100).toFixed()}%`,
  });
  audioAccuracyLine.addChildren([audioAccuracyText.element, audioAccuracyData.element]);

  const audioSeriesLine = new CustomElement('div', { className: 'audio-stats__line line' });
  const audioSeriesText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Серия верных ответов:',
  });
  const audioSeriesData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${inRow}`,
  });
  audioSeriesLine.addChildren([audioSeriesText.element, audioSeriesData.element]);

  audioWrapper.addChildren([
    audioHeader.element,
    audioNewLine.element,
    audioAccuracyLine.element,
    audioSeriesLine.element,
  ]);
  audioStatistic.addChildren([audioWrapper.element, audioImage]);
  return audioStatistic.element;
}

function templateSprintStatistic(statistic: UserStatisticsOptionalInterface) {
  const { newWordsPerDay, answersAccuracy, inRow } =
    statistic.SPRINT !== undefined ? statistic.SPRINT : ZERO_STATS.SPRINT!;
  const sprintStatistic = new CustomElement('div', { className: 'today__sprint sprint-stats' });

  const sprintImage = getOuterBall(1);
  const sprintWrapper = new CustomElement('div', { className: 'sprint-stats__wrapper' });
  const sprintHeader = new CustomElement('h4', { className: 'sprint-stats__header', innerText: 'Спринт' });

  const sprintNewLine = new CustomElement('div', { className: 'sprint-stats__line line' });
  const sprintNewText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Новых слов:',
  });
  const sprintNewData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${newWordsPerDay}`,
  });
  sprintNewLine.addChildren([sprintNewText.element, sprintNewData.element]);

  const sprintAccuracyLine = new CustomElement('div', { className: 'sprint-stats__line line' });
  const sprintAccuracyText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Правильных ответов:',
  });
  const sprintAccuracyData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${(answersAccuracy * 100).toFixed()}%`,
  });
  sprintAccuracyLine.addChildren([sprintAccuracyText.element, sprintAccuracyData.element]);

  const sprintSeriesLine = new CustomElement('div', { className: 'sprint-stats__line line' });
  const sprintSeriesText = new CustomElement('div', {
    className: 'line__text',
    innerText: 'Серия верных ответов:',
  });
  const sprintSeriesData = new CustomElement('div', {
    className: 'line__data',
    innerText: `${inRow}`,
  });
  sprintSeriesLine.addChildren([sprintSeriesText.element, sprintSeriesData.element]);

  sprintWrapper.addChildren([
    sprintHeader.element,
    sprintNewLine.element,
    sprintAccuracyLine.element,
    sprintSeriesLine.element,
  ]);
  sprintStatistic.addChildren([sprintImage, sprintWrapper.element]);
  return sprintStatistic.element;
}

function renderStatisticToday(statistic: UserStatisticsOptionalInterface) {
  const statisticToday = new CustomElement('div', { className: 'statistic__today today' });
  const todayWrapper = new CustomElement('div', { className: 'today__wrapper' });
  const todayHeader = new CustomElement('h2', { className: 'today__header', innerText: 'Итоги дня' });

  const allStatistic = new CustomElement('div', { className: 'today__info' });
  const wordsStatistic = templateWordStatistic(statistic);
  const audioStatistic = templateAudioStatistic(statistic);
  const sprintStatistic = templateSprintStatistic(statistic);
  allStatistic.addChildren([wordsStatistic, sprintStatistic, audioStatistic]);

  todayWrapper.addChildren([todayHeader.element, allStatistic.element]);
  statisticToday.addChildren([todayWrapper.element]);

  return statisticToday.element;
}

function renderStatisticAll(statistic: Record<number, UserStatisticsOptionalInterface>) {
  const statisticAll = new CustomElement('div', { className: 'statistic__all all' });
  const allWrapper = new CustomElement('div', { className: 'all__wrapper' });
  const allHeader = new CustomElement('h2', { className: 'all__header', innerText: 'Итоги за все время' });

  const dates = Object.keys(statistic)
    .sort((a, b) => Number(a) - Number(b))
    .slice(0, 10);
  const labels = dates.map((item) => {
    const date = new Date(+item);
    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}`;
  });
  labels.length = 12;

  const newWordsData = dates.map((item) => statistic[+item].DAY?.newWordsPerDay);
  const learnedWordsData: number[] = [];
  dates.reduce((acc, item) => {
    const result = acc + (statistic[+item].DAY?.learned ?? 0);
    learnedWordsData.push(result);
    return result;
  }, 0);

  const allCharts = new CustomElement('div', { className: 'all__charts' });
  const newWords = new CustomElement('div', { className: 'all__new-words new-words' });
  const newWordsCtx = new CustomElement('canvas', { className: 'new-words__ctx' });
  newWords.addChildren([newWordsCtx.element]);
  const learnedWords = new CustomElement('div', { className: 'all__learned-words learned-words' });
  const learnedWordsCtx = new CustomElement('canvas', { className: 'learned-words__ctx' });
  learnedWords.addChildren([learnedWordsCtx.element]);
  allCharts.addChildren([newWords.element, learnedWords.element]);

  Chart.defaults.font.family = 'Montserrat, sans-serif';
  Chart.defaults.font.size = 16;
  Chart.defaults.color = '#ffffff';

  // eslint ругается на неиспользуемые переменные. Но нам негде их использовать.
  /* eslint-disable */
  const newWordsChart = new Chart(newWordsCtx.element, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Новых слов за день',
          data: newWordsData,
          backgroundColor:'rgba(255, 255, 255, 0.75)',
          borderColor: 'rgba(255, 255, 255, 1)',
          barThickness: 5,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Новых слов за день',
        },
        legend: {
          display: false,
        }
      },       
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.25)',
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.25)',
          }
        },
      },
    },
  });
  const learnedWordsChart = new Chart(learnedWordsCtx.element, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Количество изученных слов',
          data: learnedWordsData,
          fill: false,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderColor: 'rgba(255, 255, 255, 1)',
          tension: 0.1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Количество изученных слов',
        },
        legend: {
          display: false,
        }
      },       
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.25)',
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.25)',
          }
        },
      },
    },
  });
  /* eslint-enable */

  allWrapper.addChildren([allHeader.element, allCharts.element]);
  statisticAll.addChildren([allWrapper.element]);
  return statisticAll.element;
}

function renderStatisticError() {
  const statisticError = new CustomElement('div', { className: 'statistic__error error' });
  const errorHeader = new CustomElement('h2', {
    className: 'error__header',
    innerText: `У вас пока нет статистики`.toUpperCase(),
  });

  statisticError.addChildren([errorHeader.element]);
  return statisticError.element;
}

async function createStatisticPage() {
  const statisticWrapper = new CustomElement('div', { className: 'statistic' });
  const statisticResponse = await state.user?.getUserStatistic(state.user);

  if (statisticResponse) {
    if ('optional' in statisticResponse) {
      const date = dateNow();
      if (date in statisticResponse.optional) {
        const statisticToday = renderStatisticToday(statisticResponse.optional[date]);
        statisticWrapper.addChildren([statisticToday]);
      } else {
        const statisticToday = renderStatisticToday(ZERO_STATS);
        statisticWrapper.addChildren([statisticToday]);
      }

      const statisticAll = renderStatisticAll(statisticResponse.optional);

      statisticWrapper.addChildren([statisticAll]);
    } else {
      console.log('ERR: ', statisticResponse);
      const statisticError = renderStatisticError();
      statisticWrapper.addChildren([statisticError]);
    }
  }
  return statisticWrapper.element;
}

export default createStatisticPage;
