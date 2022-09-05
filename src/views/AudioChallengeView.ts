import AudioChallengeController from '../controllers/AudioChallengeController';
import CustomElement from '../utils/customElement';
import spinnerWhite from '../assets/icons/spinner-white.svg';
import AudioChallengeModel from '../models/AudioChallengeModel';
import config from '../models/Config';
import sound from '../assets/icons/GREEN-sound.png';
import getOuterBall from './components/outerBall';
import IWord from '../types/IWord';
import drawChart from './components/audioChart';

export default class AudioChallengeView {
  controller: AudioChallengeController;
  view: CustomElement<'div'>;

  constructor(controller: AudioChallengeController) {
    this.controller = controller;
    this.view = new CustomElement('div', { className: 'game__field' });
    this.view.element.classList.add('audio');
  }

  start() {
    const spinner = new CustomElement('dialog', { className: 'spinner' });
    const spinnerImg = new CustomElement('img', { className: 'spinner__img', src: spinnerWhite, alt: 'Spinner' });
    spinner.addChildren([spinnerImg.element]);
    this.view.addChildren([spinner.element]);

    return this.view.element;
  }

  renderGame(model: AudioChallengeModel) {
    this.view.element.innerHTML = '';
    const gameContainer = new CustomElement('div', { className: 'game__container__ac' });
    const line = new CustomElement('span', {
      className: 'ac__line',
    });
    const acBall = getOuterBall(2);
    acBall.classList.add('ac__bottom');
    this.view.addChildren([gameContainer.element, line.element, acBall]);
    const soundButton = new CustomElement('button', { className: 'ac_sound' });

    function turnOn() {
      soundButton.element.classList.add('sound_on');
      soundButton.element.classList.remove('sound_of');
      soundButton.element.textContent = 'только голос'.toUpperCase();
    }

    function turnOff() {
      soundButton.element.textContent = 'включить звуки'.toUpperCase();
      soundButton.element.classList.remove('sound_on');
      soundButton.element.classList.add('sound_of');
    }

    if (model.sound) {
      turnOn();
    } else {
      turnOff();
    }
    soundButton.element.addEventListener('click', () => {
      if (soundButton.element.classList.contains('sound_on')) {
        turnOff();
        model.sound = false;
      } else {
        turnOn();
        model.sound = true;
      }
    });
    if (model.words && model.answers) {
      const word = model.words[model.currentWord];
      const wordBlock = new CustomElement('div', { className: 'game__ac__block' });
      const wordAudio = new Audio(`${config.API.URL}/${word.audio}`);
      const btnSpeech = new CustomElement('img', { src: sound, alt: 'sound-icon', className: 'game__ac__sound' });
      btnSpeech.element.addEventListener('click', () => {
        wordAudio.play();
        btnSpeech.element.classList.add('animate_blue');
        setTimeout(() => btnSpeech.element.classList.remove('animate_blue'), 800);
      });
      if (!model.attempts) {
        btnSpeech.element.style.display = 'none';
      }

      const imgContainer = new CustomElement('div', { className: 'game__ac__block__container' });
      const wordImg = new CustomElement('img', {
        src: `${config.API.URL}/${word.image}`,
        alt: 'word-image',
        className: 'game__ac__block__container_image',
      });
      imgContainer.addChildren([wordImg.element]);
      const wordTitle = new CustomElement('div', { className: 'game__ac__block__word' });
      const wordText = new CustomElement('span', {
        innerText: `${word.word.toUpperCase()}`,
        className: 'game__ac__block__word_text',
      });
      const wordSpeech = new CustomElement('img', {
        src: sound,
        alt: 'sound-icon',
        className: 'game__ac__block__word_sound',
      });
      wordSpeech.element.addEventListener('click', () => wordAudio.play());
      wordTitle.addChildren([wordText.element, wordSpeech.element]);
      if (model.attempts) {
        imgContainer.element.style.display = 'none';
        wordTitle.element.style.display = 'none';
      }

      wordBlock.addChildren([btnSpeech.element, imgContainer.element, wordTitle.element]);

      const answersBlock = new CustomElement('div', { className: 'game__ac__answer_block' });
      const nextBtn = new CustomElement('button', {
        innerText: model.attempts ? 'Не знаю'.toUpperCase() : 'Дальше'.toUpperCase(),
        className: 'game__ac__answer_next',
      });

      const btnArr: CustomElement<'button'>[] = [];

      model.answers.forEach((answer, idx) => {
        const btnAnswer = new CustomElement('button', {
          innerText: `${idx + 1} ${answer.wordTranslate.toUpperCase()}`,
          className: 'game__ac__answer_btn',
        });
        btnArr.push(btnAnswer);
        if (model.attempts) {
          btnAnswer.element.addEventListener('click', () => this.controller.try(answer));
        } else if (answer === model.userAnswer) {
          if (answer === word) {
            btnAnswer.element.classList.add('blue-back');
          } else {
            btnAnswer.element.classList.add('orange-back');
          }
        }

        answersBlock.addChildren([btnAnswer.element]);
      });

      nextBtn.element.addEventListener('click', () => this.controller.next());
      answersBlock.addChildren([nextBtn.element]);

      gameContainer.addChildren([soundButton.element, wordBlock.element, answersBlock.element]);
    }
  }

  renderResult(model: AudioChallengeModel) {
    this.view.element.innerHTML = '';
    const resultTable = new CustomElement('div', { className: 'game__result__table' });

    const line = new CustomElement('span', { className: 'ac__line' });
    const acBall = getOuterBall(2);
    acBall.classList.add('ac__bottom');
    this.view.addChildren([resultTable.element, line.element, acBall]);

    const resultHeader = new CustomElement('div', { className: 'result__table__header' });
    const resultTitle = new CustomElement('h2', {
      className: 'header__title',
      textContent: 'Результаты'.toUpperCase(),
    });
    const resultAgainButton = new CustomElement('a', {
      className: 'header__again-button',
      textContent: 'Повторить'.toUpperCase(),
      href: '#/games/audio-challenge',
    });
    resultHeader.addChildren([resultTitle.element, resultAgainButton.element]);
    const resultMain = new CustomElement('div', { className: 'result__table__main' });
    resultTable.addChildren([resultHeader.element, resultMain.element]);
    const resultTotalScore = new CustomElement('div', { className: 'game__result__total-score' });
    const resultScoreFirst = new CustomElement('p', {
      className: 'total-score__text',
      textContent: 'Вы набрали '.toUpperCase(),
    });
    const resultScorePoints = new CustomElement('p', {
      innerText: `${model.gameStatistic.score}`,
      className: 'total-score__points',
    });
    const resultScoreSecond = new CustomElement('p', {
      className: 'total-score__text',
      textContent: ' баллов'.toUpperCase(),
    });
    const resultDiagram = new CustomElement('div', { className: 'game__result__diagram' });
    const diagramChart = new CustomElement('canvas', { className: 'diagram_chart' });
    resultTotalScore.addChildren([resultScoreFirst.element, resultScorePoints.element, resultScoreSecond.element]);
    resultDiagram.addChildren([diagramChart.element]);
    drawChart(model, diagramChart);

    const points = new CustomElement('div', { className: 'game__result__points' });
    for (let i = 0; i < 3; i += 1) {
      const dotProgress = new CustomElement('div', {
        className: `game__result__points_dot${i}`,
      });
      points.addChildren([dotProgress.element]);
    }
    resultMain.addChildren([resultTotalScore.element, resultDiagram.element, points.element]);
    const correctTitle = new CustomElement('div', {
      className: 'game__result__title_cor',
      textContent: 'верно'.toUpperCase(),
    });
    resultTable.addChildren([correctTitle.element]);
    model.gameStatistic.win.forEach((word) => AudioChallengeView.drawWords(word, 'win', resultTable));
    const incorrectTitle = new CustomElement('div', {
      className: 'game__result__title_incor',
      textContent: 'ошибки'.toUpperCase(),
    });
    resultTable.addChildren([incorrectTitle.element]);
    model.gameStatistic.lose.forEach((word) => AudioChallengeView.drawWords(word, 'lose', resultTable));
  }

  static drawWords(word: IWord, param: string, resultTable: CustomElement<'div'>) {
    const wordLine = new CustomElement('div', { className: 'game__result__word-line' });
    const correctness = new CustomElement('div', {});
    if (param === 'win') {
      correctness.element.classList.add('game__result__points_dot2');
    } else {
      correctness.element.classList.add('game__result__points_dot1');
    }
    const wordName = new CustomElement('p', { className: 'game__result__word', textContent: word.word.toUpperCase() });
    const wordDash = new CustomElement('p', { className: 'game__result__word_dash', textContent: '-' });
    const wordTranslation = new CustomElement('p', {
      className: 'game__result__word_translation',
      textContent: word.wordTranslate.toUpperCase(),
    });

    wordLine.addChildren([correctness.element, wordName.element, wordDash.element, wordTranslation.element]);
    resultTable.addChildren([wordLine.element]);
  }

  renderNoWords() {
    this.view.element.innerHTML = '';

    const gameSorry = new CustomElement('div', {
      className: 'sorry',
    });

    const sorryText = new CustomElement('p', {
      className: 'sorry__text',
      innerText: 'Ты уже выучил все слова с этой и предыдущей страницы учебника.\nВыбери другу страницу.',
    });

    const sorryLink = new CustomElement('a', {
      className: 'sorry__link link',
      href: '#/book',
      innerText: 'Вернуться к учебнику',
    });

    gameSorry.addChildren([sorryText.element, sorryLink.element]);

    this.view.addChildren([gameSorry.element]);
  }
}
