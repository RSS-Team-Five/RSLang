import cleanElement from "../utils/cleanElement";
import createBookPage from "./pages/bookPage";
import createGamesPage from "./pages/gamesPage";
import createMainPage from "./pages/mainPage";
import createPromoPage from "./pages/promoPage";
import createStatisticPage from "./pages/statisticPage";

export default class View {
  content: HTMLElement | null;

  constructor() {
    this.content = document.querySelector(".content");
  }

  renderMain() {
    if (this.content) {
      cleanElement(this.content);
      const mainPage: HTMLElement = createMainPage();
      this.content?.append(mainPage);
    }
  }

  renderBook() {
    if (this.content) {
      cleanElement(this.content);
      const bookPage: HTMLElement = createBookPage();
      this.content?.append(bookPage);
    }
  }

  renderGames() {
    if (this.content) {
      cleanElement(this.content);
      const gamesPage: HTMLElement = createGamesPage();
      this.content?.append(gamesPage);
    }
  }

  renderPromo() {
    if (this.content) {
      cleanElement(this.content);
      const promoPage: HTMLElement = createPromoPage();
      this.content?.append(promoPage);
    }
  }

  renderStatistics() {
    if (this.content) {
      cleanElement(this.content);
      const statisticPage: HTMLElement = createStatisticPage();
      this.content?.append(statisticPage);
    }
  }

  render404() {
    if (this.content) {
      cleanElement(this.content);
      this.content.innerHTML = 'Page has not found!';
    }
  }
}
