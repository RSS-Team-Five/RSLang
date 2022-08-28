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

  start() {
    const spinner = new CustomElement('img', { className: 'spinner', src: spinnerPath, alt: 'Spinner' });
    this.view.addChildren([spinner.element]);

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

      model.answers.forEach((answer) => {
        const btnAnswer = new CustomElement('button', { innerText: answer.wordTranslate });
        if (model.attempts) {
          btnAnswer.element.addEventListener('click', () => this.controller.try());
        } else if (answer === word) {
          btnAnswer.element.style.color = 'yellow';
        } else {
          btnAnswer.element.style.color = 'red';
        }

        answersBlock.addChildren([btnAnswer.element]);
      });

      nextBtn.element.addEventListener('click', () => this.controller.next());

      this.view.addChildren([wordBlock.element, answersBlock.element, nextBtn.element]);
    }
  }

  renderResult() {
    this.view.element.innerHTML = '';
    const mainPageLink = new CustomElement('a', { href: '#/', innerText: 'На главную' });
    const newGameLink = new CustomElement('a', { href: '#/games/audio-challenge', innerText: 'Играть заново' });

    this.view.addChildren([mainPageLink.element, newGameLink.element]);
  }
}
