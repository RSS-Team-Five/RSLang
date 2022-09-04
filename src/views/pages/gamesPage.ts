import CustomElement from '../../utils/customElement';
import config from '../../models/Config';
import getOuterBall from '../components/outerBall';

function createGamesPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper games',
  });

  const pageName = new CustomElement('h2', {
    className: 'games__name',
    textContent: 'Выбери свою игру'.toUpperCase(),
  });

  const gamesWrapper = new CustomElement('div', {
    className: 'games-wrapper',
  });

  const gamesLine = new CustomElement('span', {
    className: 'games-wrapper_line',
  });

  config.GAMES.MAIN.forEach((game, index) => {
    const gameWrapper = new CustomElement('div', {
      className: 'games__wrapper game_item',
    });

    const gameInfo = new CustomElement('div', {
      className: 'game-info',
    });

    const gameName = new CustomElement('h3', {
      className: 'game-info__name',
      textContent: game.gameName.toUpperCase(),
    });

    const gameDescription = new CustomElement('p', {
      className: 'game-info__description',
      innerText: game.description,
    });

    const gameBtn = new CustomElement('button', {
      className: 'game-info__button',
      textContent: 'Далее'.toUpperCase(),
    });

    const gameImg = getOuterBall(index + 1, gameBtn.element);

    gameBtn.element.addEventListener('click', () => {
      window.location.href = `#/games/${game.gameUrl}`;
    });

    gameInfo.addChildren([gameName.element, gameDescription.element, gameBtn.element, gameBtn.element]);

    gameWrapper.addChildren([gameImg, gameInfo.element]);

    gamesWrapper.addChildren([gameWrapper.element, gamesLine.element]);
  });

  mainWrapper.addChildren([pageName.element, gamesWrapper.element]);

  return mainWrapper.element;
}

export default createGamesPage;
