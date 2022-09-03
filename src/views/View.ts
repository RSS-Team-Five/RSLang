import config from '../models/Config';
import state from '../models/State';
import { GroupType, PageType } from '../types/SectionTypes';
import CustomElement from '../utils/customElement';
import footer from './components/footer';
import header from './components/header';
import dialogSignUp from './components/dialogSignUp';
import createBookPage from './pages/bookPage';
import createGamesPage from './pages/gamesPage';
import createMainPage from './pages/mainPage';
import createSectionPage from './pages/sectionPage';
import createStatisticPage from './pages/statisticPage';
import dialogSignIn from './components/dialogSignIn';
import createSprintPage from './pages/sprintPage';
import createAboutUsPage from './pages/aboutUsPage';
import AudioChallengeView from './AudioChallengeView';
import AudioChallengeModel from '../models/AudioChallengeModel';
import AudioChallengeController from '../controllers/AudioChallengeController';
import createAudioChallengePage from './pages/audioChallengePage';
import spinnerPath from '../assets/icons/spinner.gif';

export default class View {
  content: HTMLElement | null;
  footerElement: HTMLElement;

  constructor() {
    this.content = null;
    this.footerElement = footer();
  }

  renderLayout() {
    const headerElement = new CustomElement('header', {
      className: 'header',
    });
    const headerContent = header();
    headerElement.addChildren([headerContent]);
    const main = new CustomElement('main', {
      className: 'main',
    });
    const container = new CustomElement('div', {
      className: 'main__container container content',
    });
    main.addChildren([container.element]);

    state.events?.subscribe('userAuthorized', () => {
      headerElement.element.innerHTML = '';
      headerElement.addChildren([header()]);
    });

    this.content = container.element;
    document.body.append(headerElement.element, main.element);
  }

  renderMain() {
    if (this.content) {
      this.content.innerHTML = '';
      this.addBlueStyle();
      const mainPage: HTMLElement = createMainPage();
      this.content?.append(mainPage);
      document.body.append(this.footerElement);
      this.footerElement.hidden = false;
    }
  }

  renderBook() {
    if (this.content) {
      this.content.innerHTML = '';
      this.addBlueStyle();
      const bookPage: HTMLElement = createBookPage();
      this.content?.append(bookPage);
      document.body.append(this.footerElement);
      this.footerElement.hidden = false;
    }
  }

  async renderSection(group: string, page: string) {
    if (this.content) {
      this.content.innerHTML = '';
      this.addGreyStyle();
      if (+group <= config.BOOK.maxGroup && +page <= config.BOOK.maxPage) {
        const groupAdd = +group as GroupType;
        const pageAdd = +page as PageType;
        const sectionPage: HTMLElement = await createSectionPage(groupAdd, pageAdd);
        this.content?.append(sectionPage);
        document.body.append(this.footerElement);
        this.footerElement.hidden = false;
      } else {
        window.location.href = `#/404`;
      }
    }
  }

  renderGames() {
    if (this.content) {
      this.content.innerHTML = '';
      const gamesPage: HTMLElement = createGamesPage();
      this.content?.append(gamesPage);
      this.addBlueStyle();
      document.body.append(this.footerElement);
      this.footerElement.hidden = false;
    }
  }

  async renderSprint(group: string, page: string) {
    if (this.content) {
      this.content.innerHTML = '';
      this.addBlueStyle();
      const sprintPage: HTMLElement = await createSprintPage(group, page);
      this.content?.append(sprintPage);
      this.footerElement.hidden = true;
    }
  }

  renderAboutUs() {
    if (this.content) {
      this.content.innerHTML = '';
      this.deleteStyle();
      const aboutUsPage: HTMLElement = createAboutUsPage();
      this.content?.append(aboutUsPage);
      document.body.append(this.footerElement);
      this.footerElement.hidden = false;
    }
  }

  async renderStatistics() {
    if (this.content) {
      this.content.innerHTML = '';
      this.deleteStyle();
      this.addStatisticStyle();
      const spinner = new CustomElement('img', { className: 'spinner', src: spinnerPath, alt: 'Spinner' });
      this.content.append(spinner.element);
      const statisticPage: HTMLElement = await createStatisticPage();
      this.content.innerHTML = '';
      this.content?.append(statisticPage);
      document.body.append(this.footerElement);
      this.footerElement.hidden = false;
    }
  }

  render404() {
    if (this.content) {
      this.content.innerHTML = '';
      this.content.innerHTML = 'Page has not been found!';
      this.deleteStyle();
    }
  }

  renderSignUp() {
    if (this.content) {
      const dialog = dialogSignUp();
      this.content.append(dialog);
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    }
  }

  renderSignIn() {
    if (this.content) {
      const dialog = dialogSignIn();
      this.content.append(dialog);
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    }
  }

  async renderAudioChallenge(group: string, page: string) {
    if (this.content) {
      this.content.innerHTML = '';
      this.addBlueStyle();
      const model = new AudioChallengeModel();
      const controller = new AudioChallengeController(model);
      const view = new AudioChallengeView(controller);
      const game: HTMLElement = view.start(model);

      state.events?.subscribe('audioChallengeModelUpd', () => view.renderGame(model));
      state.events?.subscribe('audioChallengeResult', () => view.renderResult(model));
      state.events?.subscribe('gameNoWords', () => view.renderNoWords());

      if (group && page) {
        this.content?.append(game);
        await controller.getWords(group, page);
      } else {
        const audioChallengePage: HTMLElement = await createAudioChallengePage();
        this.content?.append(audioChallengePage);
        this.footerElement.hidden = true;
      }
    }
  }

  deleteStyle() {
    document.body.classList.remove('blue-background');
    document.body.classList.remove('orange-background');
    document.body.classList.remove('grey-background');
    this.content?.parentElement?.previousElementSibling?.firstElementChild?.classList.remove('blue-color');
    this.content?.parentElement?.previousElementSibling?.firstElementChild?.classList.remove('orange-color');
    this.footerElement.classList.remove('orange-triangle');
  }

  addBlueStyle() {
    this.deleteStyle();
    document.body.classList.add('blue-background');
    this.content?.parentElement?.previousElementSibling?.firstElementChild?.classList.add('orange-color');
  }

  addGreyStyle() {
    this.deleteStyle();
    document.body.classList.add('grey-background');
    this.content?.parentElement?.previousElementSibling?.firstElementChild?.classList.add('blue-color');
    this.footerElement.classList.add('orange-triangle');
  }

  addStatisticStyle() {
    this.deleteStyle();
    document.body.classList.add('orange-background');
    this.content?.parentElement?.previousElementSibling?.firstElementChild?.classList.add('blue-color');
    this.footerElement.classList.add('white-triangle');
  }
}
