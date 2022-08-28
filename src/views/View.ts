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
import createPromoPage from './pages/promoPage';
import createSectionPage from './pages/sectionPage';
import createStatisticPage from './pages/statisticPage';
import dialogSignIn from './components/dialogSignIn';
import AudioChallengeView from './AudioChallengeView';
import AudioChallengeModel from '../models/AudioChallengeModel';
import AudioChallengeController from '../controllers/AudioChallengeController';

export default class View {
  content: HTMLElement | null;

  constructor() {
    this.content = null;
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
    const footerElement = footer();

    state.events?.subscribe('userAuthorized', () => {
      headerElement.element.innerHTML = '';
      headerElement.addChildren([header()]);
    });

    this.content = container.element;
    document.body.append(headerElement.element, main.element, footerElement);
  }

  renderMain() {
    if (this.content) {
      this.content.innerHTML = '';
      const mainPage: HTMLElement = createMainPage();
      this.content?.append(mainPage);
    }
  }

  renderBook() {
    if (this.content) {
      this.content.innerHTML = '';
      const bookPage: HTMLElement = createBookPage();
      this.content?.append(bookPage);
    }
  }

  async renderSection(group: string, page: string) {
    if (this.content) {
      this.content.innerHTML = '';
      if (+group <= config.BOOK.maxGroup && +page <= config.BOOK.maxPage) {
        const groupAdd = +group as GroupType;
        const pageAdd = +page as PageType;
        const sectionPage: HTMLElement = await createSectionPage(groupAdd, pageAdd);
        this.content?.append(sectionPage);
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
    }
  }

  renderPromo() {
    if (this.content) {
      this.content.innerHTML = '';
      const promoPage: HTMLElement = createPromoPage();
      this.content?.append(promoPage);
    }
  }

  renderStatistics() {
    if (this.content) {
      this.content.innerHTML = '';
      const statisticPage: HTMLElement = createStatisticPage();
      this.content?.append(statisticPage);
    }
  }

  render404() {
    if (this.content) {
      this.content.innerHTML = '';
      this.content.innerHTML = 'Page has not been found!';
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

      const model = new AudioChallengeModel();
      const controller = new AudioChallengeController(model);
      const view = new AudioChallengeView(controller);
      const game: HTMLElement = view.start();

      state.events?.subscribe('audioChallengeModelUpd', () => view.renderGame(model));
      state.events?.subscribe('audioChallengeResult', () => view.renderResult());

      if (group && page) {
        this.content?.append(game);
        await controller.getWords(group, page);
      } else {
        const difficultPanel = new CustomElement('div', { className: 'difficult' });
        for (let groupNumber = 0; groupNumber < config.BOOK.maxGroup; groupNumber += 1) {
          const difficultBtn = new CustomElement('a', {
            className: 'link difficult__link',
            innerText: `${groupNumber}`,
            href: `#/games/audio-challenge/${groupNumber}/all`,
          });
          difficultPanel.addChildren([difficultBtn.element]);
        }
        this.content?.append(difficultPanel.element);
      }
    }
  }
}
