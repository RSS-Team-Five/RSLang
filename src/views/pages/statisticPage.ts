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
  console.log(statistic);

  statisticAll.addChildren([allHeader.element]);
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
