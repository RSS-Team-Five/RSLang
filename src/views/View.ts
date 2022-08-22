import dialogSignUp from './components/dialogSignUp';
import createBookPage from './pages/bookPage';
import createGamesPage from './pages/gamesPage';
import createMainPage from './pages/mainPage';
import createPromoPage from './pages/promoPage';
import createStatisticPage from './pages/statisticPage';

export default class View {
  content: HTMLElement | null;

  constructor() {
    this.content = document.querySelector('.content');
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
      this.content.innerHTML = '';
      const dialog = dialogSignUp();
      this.content.append(dialog);
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    }
  }
}
