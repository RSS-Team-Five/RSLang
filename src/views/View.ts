import config from '../models/Config';
import state from '../models/State';
import { GroupType, PageType } from '../types/SectionTypes';
import CustomElement from '../utils/customElement';
import footer from './components/footer';
import header from './components/header';
import createBookPage from './pages/bookPage';
import createGamesPage from './pages/gamesPage';
import createMainPage from './pages/mainPage';
import createPromoPage from './pages/promoPage';
import createSectionPage from './pages/sectionPage';
import createStatisticPage from './pages/statisticPage';

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
}
