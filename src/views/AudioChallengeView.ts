import AudioChallengeController from '../controllers/AudioChallengeController';
import CustomElement from '../utils/customElement';
import spinnerWhite from '../assets/icons/spinner-white.svg';
import AudioChallengeModel from '../models/AudioChallengeModel';
import config from '../models/Config';
import sound from '../assets/icons/GREEN-sound.png';
import getOuterBall from './components/outerBall';

export default class AudioChallengeView {
  controller: AudioChallengeController;
  view: CustomElement<'div'>;

  constructor(controller: AudioChallengeController) {
    this.controller = controller;
    this.view = new CustomElement('div', { className: 'game__field' });
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
    const acBall = getOuterBall(1);
    acBall.classList.add('bottom');
    this.view.addChildren([gameContainer.element, line.element, acBall]);
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
            btnAnswer.element.classList.add('blue_back');
          } else {
            btnAnswer.element.classList.add('orange_back');
          }
        }

        answersBlock.addChildren([btnAnswer.element]);
      });

      nextBtn.element.addEventListener('click', () => this.controller.next());
      answersBlock.addChildren([nextBtn.element]);

      gameContainer.addChildren([wordBlock.element, answersBlock.element]);
    }
  }

  renderResult(model: AudioChallengeModel) {
    this.view.element.innerHTML = '';
    const gameContainer = new CustomElement('div', { className: 'game__container__ac' });
    this.view.addChildren([gameContainer.element]);
    const result = new CustomElement('div', {
      innerText: `SCORE - ${model.gameStatistic.score}\nSERIES - ${model.gameStatistic.winSeries}\n`,
    });
    const win = new CustomElement('div', { innerText: `WIN - ${model.gameStatistic.win.length}\n` });
    model.gameStatistic.win.forEach((word) => {
      const row = new CustomElement('p', { innerText: `${word.word} - ${word.wordTranslate}` });
      win.addChildren([row.element]);
    });
    const lose = new CustomElement('div', { innerText: `LOSE - ${model.gameStatistic.lose.length}\n` });
    model.gameStatistic.lose.forEach((word) => {
      const row = new CustomElement('p', { innerText: `${word.word} - ${word.wordTranslate}` });
      lose.addChildren([row.element]);
    });
    result.addChildren([win.element, lose.element]);

    const mainPageLink = new CustomElement('a', { href: '#/', innerText: 'На главную' });
    const newGameLink = new CustomElement('a', { href: '#/games/audio-challenge', innerText: 'Играть заново' });

    gameContainer.addChildren([result.element, mainPageLink.element, newGameLink.element]);
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
