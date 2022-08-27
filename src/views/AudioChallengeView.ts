import AudioChallengeController from '../controllers/AudioChallengeController';
import CustomElement from '../utils/customElement';
import spinnerPath from '../assets/icons/spinner.gif';
import AudioChallengeModel from '../models/AudioChallengeModel';

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

  render(model: AudioChallengeModel) {
    this.view.element.innerHTML = '';
    console.log(model);
  }
}
