import config from '../../models/Config';
import state from '../../models/State';
import CustomElement from '../../utils/customElement';
import startSprintGame from '../components/sprintGameStart';
import getSprintWords from '../components/sprintWords';

async function createSprintPage() {
  let level: number | undefined = state.group;

  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper game',
  });

  const gameIntro = new CustomElement('div', {
    className: 'game__intro',
  });

  const gameName = new CustomElement('h2', {
    className: 'game__name',
    textContent: `${config.GAMES.MAIN[0].gameName}`,
  });

  const gameDescription = new CustomElement('p', {
    className: 'game__description',
    innerText:
      'Это игра на время.\nТвоя задача - выбрать правильный перевод слов.\nЧем больше ты дашь правильных ответов за 60 секунд, тем больше баллов получишь.',
  });

  const gameLevelDescription = new CustomElement('h3', {
    className: 'game__level-description',
    textContent: 'Выбери уровень сложности',
  });

  const gameLevelBox = new CustomElement('div', {
    className: 'game__level-box',
  });

  const gameStartButton = new CustomElement('button', {
    className: 'game__start_button',
    textContent: 'Играть',
  });

  if (level === undefined) {
    gameStartButton.element.classList.add('inactive');
    config.SECTION_CARD.forEach((card, index) => {
      if (index < config.BOOK.maxGroup) {
        const gameLevel = new CustomElement('button', {
          className: 'game__level',
          textContent: (index + 1).toString(),
        });
        gameLevel.element.addEventListener('click', () => {
          level = index;
          gameStartButton.element.classList.remove('inactive');
        });

        gameLevelBox.addChildren([gameLevel.element]);
      }
    });
  } else {
    gameLevelDescription.element.innerHTML = '';
  }

  gameStartButton.element.addEventListener('click', async () => {
    if (level !== undefined) {
      const { gameWords, wordsArray } = await getSprintWords(level);
      const gameField = await startSprintGame(gameWords, wordsArray, gameIntro);
      mainWrapper.element.classList.add('sprint');
      mainWrapper.addChildren([gameField.element]);
    }
  });

  gameIntro.addChildren([
    gameName.element,
    gameDescription.element,
    gameLevelDescription.element,
    gameLevelBox.element,
    gameStartButton.element,
  ]);

  mainWrapper.addChildren([gameIntro.element]);

  return mainWrapper.element;
}

export default createSprintPage;