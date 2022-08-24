import CustomElement from '../../utils/customElement';
import config from '../../models/Config';

function createGamesPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper games',
  });

  const pageName = new CustomElement('h2', {
    className: 'games__name',
    innerText: 'ИГРЫ',
  });

  const gamesWrapper = new CustomElement('div', {
    className: 'games-wrapper',
  });

  config.GAMES.forEach((game) => {
    const gameWrapper = new CustomElement('div', {
      className: 'game__wrapper game',
    });

    const gameImg = new CustomElement('img', {
      className: 'game__img',
      src: game.imgUrl,
      alt: game.alt,
    });

    const gameName = new CustomElement('p', {
      className: 'game__name',
      innerText: game.gameName,
    });

    gameWrapper.addChildren([gameImg.element, gameName.element]);

    gameWrapper.element.addEventListener('click', () => {
      window.location.href = `#/games/${game.gameUrl}`;
    });

    gamesWrapper.addChildren([gameWrapper.element]);
  });

  mainWrapper.addChildren([pageName.element, gamesWrapper.element]);

  return mainWrapper.element;
}

export default createGamesPage;
