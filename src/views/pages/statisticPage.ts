import { Chart } from 'chart.js';
import state from '../../models/State';
import { UserStatisticsOptionalInterface } from '../../types/UserStatisticsType';
import CustomElement from '../../utils/customElement';
import dateNow from '../../utils/dateNow';

const ZERO_STATS: UserStatisticsOptionalInterface = {
  DAY: { newWordsPerDay: 0, answersAccuracy: 0, inRow: 0, learned: 0 },
  AUDIOCHALLENGE: { newWordsPerDay: 0, answersAccuracy: 0, inRow: 0, learned: 0 },
  SPRINT: { newWordsPerDay: 0, answersAccuracy: 0, inRow: 0, learned: 0 },
};

function templateWordStatistic(statistic: UserStatisticsOptionalInterface) {
  const { newWordsPerDay, answersAccuracy, learned } = statistic.DAY !== undefined ? statistic.DAY : ZERO_STATS.DAY!;
  const wordsStatistic = new CustomElement('div', { className: 'today__words words-stats' });
  const wordsHeader = new CustomElement('h4', { className: 'words-stats__header', innerText: 'Всего' });
  const wordsNew = new CustomElement('div', {
    className: 'words-stats__new',
    innerText: `Новых слов: ${newWordsPerDay}`,
  });
  const wordsLearned = new CustomElement('div', {
    className: 'words-stats__learned',
    innerText: `Слов изучено: ${learned}`,
  });
  const wordsAccuracy = new CustomElement('div', {
    className: 'words-stats__accuracy',
    innerText: `Правильных ответов: ${(answersAccuracy * 100).toFixed()}%`,
  });
  wordsStatistic.addChildren([wordsHeader.element, wordsNew.element, wordsLearned.element, wordsAccuracy.element]);
  return wordsStatistic.element;
}

function templateAudioStatistic(statistic: UserStatisticsOptionalInterface) {
  const { newWordsPerDay, answersAccuracy, inRow } =
    statistic.AUDIOCHALLENGE !== undefined ? statistic.AUDIOCHALLENGE : ZERO_STATS.AUDIOCHALLENGE!;
  const audioStatistic = new CustomElement('div', { className: 'today__audio audio-stats' });
  const audioHeader = new CustomElement('h4', { className: 'audio-stats__header', innerText: 'Аудио вызов' });
  const audioNew = new CustomElement('div', {
    className: 'audio-stats__new',
    innerText: `Новых слов: ${newWordsPerDay}`,
  });
  const audioAccuracy = new CustomElement('div', {
    className: 'audio-stats__accuracy',
    innerText: `Правильных ответов: ${(answersAccuracy * 100).toFixed()}%`,
  });
  const audioSeries = new CustomElement('div', {
    className: 'audio-stats__series',
    innerText: `Серия: ${inRow}`,
  });
  audioStatistic.addChildren([audioHeader.element, audioNew.element, audioAccuracy.element, audioSeries.element]);
  return audioStatistic.element;
}

function templateSprintStatistic(statistic: UserStatisticsOptionalInterface) {
  const { newWordsPerDay, answersAccuracy, inRow } =
    statistic.SPRINT !== undefined ? statistic.SPRINT : ZERO_STATS.SPRINT!;
  const sprintStatistic = new CustomElement('div', { className: 'today__sprint sprint-stats' });
  const sprintHeader = new CustomElement('h4', { className: 'sprint-stats__header', innerText: 'Спринт' });
  const sprintNew = new CustomElement('div', {
    className: 'sprint-stats__new',
    innerText: `Новых слов: ${newWordsPerDay}`,
  });
  const sprintAccuracy = new CustomElement('div', {
    className: 'sprint-stats__accuracy',
    innerText: `Правильных ответов: ${(answersAccuracy * 100).toFixed()}%`,
  });
  const sprintSeries = new CustomElement('div', {
    className: 'sprint-stats__series',
    innerText: `Серия: ${inRow}`,
  });
  sprintStatistic.addChildren([sprintHeader.element, sprintNew.element, sprintAccuracy.element, sprintSeries.element]);
  return sprintStatistic.element;
}

function renderStatisticToday(statistic: UserStatisticsOptionalInterface) {
  const statisticToday = new CustomElement('div', { className: 'statistic__today today' });
  const todayHeader = new CustomElement('h2', { className: 'today__header', innerText: 'Статистика за сегодня' });

  const wordsStatistic = templateWordStatistic(statistic);
  const audioStatistic = templateAudioStatistic(statistic);
  const sprintStatistic = templateSprintStatistic(statistic);

  statisticToday.addChildren([todayHeader.element, wordsStatistic, audioStatistic, sprintStatistic]);

  return statisticToday.element;
}

function renderStatisticAll(statistic: Record<number, UserStatisticsOptionalInterface>) {
  const statisticAll = new CustomElement('div', { className: 'statistic__all all' });
  const allHeader = new CustomElement('h2', { className: 'all__header', innerText: 'Статистика за все время' });

  const dates = Object.keys(statistic)
    .sort((a, b) => Number(a) - Number(b))
    .slice(0, 10);
  const labels = dates.map((item) => {
    const date = new Date(+item);
    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth().toString().padStart(2, '0')}`;
  });
  labels.length = 10;

  const newWordsData = dates.map((item) => statistic[+item].DAY?.newWordsPerDay);
  const learnedWordsData = dates.map((item) => statistic[+item].DAY?.learned);

  const newWords = new CustomElement('div', { className: 'all__new-words new-words' });
  const newWordsCtx = new CustomElement('canvas', { className: 'new-words__ctx' });
  newWords.addChildren([newWordsCtx.element]);

  const learnedWords = new CustomElement('div', { className: 'all__learned-words learned-words' });
  const learnedWordsCtx = new CustomElement('canvas', { className: 'learned-words__ctx' });
  learnedWords.addChildren([learnedWordsCtx.element]);

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
      layout: {
        padding: 20
      },        
      scales: {
        y: {
          beginAtZero: true,
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
      layout: {
        padding: 20
      },        
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  /* eslint-enable */

  statisticAll.addChildren([allHeader.element, newWords.element, learnedWords.element]);
  return statisticAll.element;
}

function renderStatisticError() {
  const statisticError = new CustomElement('div', { className: 'statistic__error error' });
  const errorHeader = new CustomElement('h2', {
    className: 'error__header',
    innerText: 'У вас, пока, нет статистики.',
  });

  statisticError.addChildren([errorHeader.element]);
  return statisticError.element;
}

async function createStatisticPage() {
  const statisticWrapper = new CustomElement('div', { className: 'statistic' });
  const statisticResponse = await state.user?.getUserStatistic(state.user);

  if (statisticResponse) {
    if ('optional' in statisticResponse) {
      console.log(statisticResponse);
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
