import AudioChallengeController from '../controllers/AudioChallengeController';
import CustomElement from '../utils/customElement';
import spinnerPath from '../assets/icons/spinner.gif';
import AudioChallengeModel from '../models/AudioChallengeModel';
import config from '../models/Config';

export default class AudioChallengeView {
  controller: AudioChallengeController;
  view: CustomElement<'div'>;

  constructor(controller: AudioChallengeController) {
    this.controller = controller;
    this.view = new CustomElement('div', { className: 'game' });
  }

  start(model: AudioChallengeModel) {
    const spinner = new CustomElement('img', { className: 'spinner', src: spinnerPath, alt: 'Spinner' });
    this.view.addChildren([spinner.element]);

    document.addEventListener('keypress', (e) => {
      if (model.words && model.answers) {
        if (e.code === 'Space') {
          const word = model.words[model.currentWord];
          const wordAudio = new Audio(`${config.API.URL}/${word.audio}`);
          wordAudio.play();
        }
        if (e.code === 'Enter') {
          this.controller.next();
        }
        if (e.code === 'Digit1') {
          const answer = model.answers[0];
          this.controller.try(answer);
        }
        if (e.code === 'Digit2') {
          const answer = model.answers[1];
          this.controller.try(answer);
        }
        if (e.code === 'Digit3') {
          const answer = model.answers[2];
          this.controller.try(answer);
        }
        if (e.code === 'Digit4') {
          const answer = model.answers[3];
          this.controller.try(answer);
        }
        if (e.code === 'Digit5') {
          const answer = model.answers[4];
          this.controller.try(answer);
        }
      }
    });

    return this.view.element;
  }

  renderGame(model: AudioChallengeModel) {
    this.view.element.innerHTML = '';
    if (model.words && model.answers) {
      const word = model.words[model.currentWord];
      const wordBlock = new CustomElement('div', {});
      const wordAudio = new Audio(`${config.API.URL}/${word.audio}`);
      const btnSpeech = new CustomElement('button', { innerText: 'Прослушать' });
      btnSpeech.element.addEventListener('click', () => wordAudio.play());
      if (!model.attempts) {
        btnSpeech.element.style.display = 'none';
      }

      const wordImg = new CustomElement('img', { src: `${config.API.URL}/${word.image}` });
      const wordTitle = new CustomElement('div', {});
      const wordText = new CustomElement('span', { innerText: `${word.word}` });
      const wordSpeech = new CustomElement('button', { innerText: 'Прослушать' });
      wordSpeech.element.addEventListener('click', () => wordAudio.play());
      wordTitle.addChildren([wordText.element, wordSpeech.element]);
      if (model.attempts) {
        wordImg.element.style.display = 'none';
        wordTitle.element.style.display = 'none';
      }

      wordBlock.addChildren([btnSpeech.element, wordImg.element, wordTitle.element]);

      const answersBlock = new CustomElement('div', {});
      const nextBtn = new CustomElement('button', { innerText: model.attempts ? 'Не знаю' : 'Дальше' });

      model.answers.forEach((answer, idx) => {
        const btnAnswer = new CustomElement('button', { innerText: `${idx + 1} ${answer.wordTranslate}` });
        if (model.attempts) {
          btnAnswer.element.addEventListener('click', () => this.controller.try(answer));
        } else if (answer === model.userAnswer) {
          if (answer === word) {
            btnAnswer.element.style.color = 'yellow';
          } else {
            btnAnswer.element.style.color = 'red';
          }
        }

        answersBlock.addChildren([btnAnswer.element]);
      });

      nextBtn.element.addEventListener('click', () => this.controller.next());

      this.view.addChildren([wordBlock.element, answersBlock.element, nextBtn.element]);
    }
  }

  renderResult(model: AudioChallengeModel) {
    // TODO перерисовать результаты.
    this.view.element.innerHTML = '';
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

    this.view.addChildren([result.element, mainPageLink.element, newGameLink.element]);
  }
}
