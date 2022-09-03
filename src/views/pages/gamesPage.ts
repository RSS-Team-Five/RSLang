import CustomElement from '../../utils/customElement';
import config from '../../models/Config';
import arrow from '../../assets/icons/Arrow 1.png';

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

  config.GAMES.MAIN.forEach((game, index) => {
    const gameWrapper = new CustomElement('div', {
      className: 'games__wrapper game_item',
    });

    const gameImg = new CustomElement('div', {
      className: `outer-ball${index + 1}`,
    });

    const InnerBall = new CustomElement('div', {
      className: `inner-ball${index + 1}_first`,
    });

    const secondInnerBall = new CustomElement('div', {
      className: `inner-ball${index + 1}_second`,
    });

    const innerArrow = new CustomElement('img', {
      className: `inner-arrow${index + 1}`,
      src: arrow,
      alt: 'arrow-icon',
    });

    gameImg.addChildren([InnerBall.element, secondInnerBall.element, innerArrow.element]);

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

    gameBtn.element.addEventListener('click', () => {
      window.location.href = `#/games/${game.gameUrl}`;
    });

    gameBtn.element.addEventListener('mouseover', () => {
      gameBtn.element.parentElement?.previousElementSibling?.classList.add('move');
    });

    gameBtn.element.addEventListener('mouseout', () => {
      gameBtn.element.parentElement?.previousElementSibling?.classList.remove('move');
    });

    gameInfo.addChildren([gameName.element, gameDescription.element, gameBtn.element, gameBtn.element]);

    gameWrapper.addChildren([gameImg.element, gameInfo.element]);

    gamesWrapper.addChildren([gameWrapper.element]);
  });

  mainWrapper.addChildren([pageName.element, gamesWrapper.element]);

  return mainWrapper.element;
}

export default createGamesPage;
