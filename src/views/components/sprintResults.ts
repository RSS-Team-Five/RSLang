import IGameWord from '../../types/IGameWord';
import CustomElement from '../../utils/customElement';
import drawChart from './sprintChart';

function drawResults(
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
    console.log('1');
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
}

export default drawResults;
