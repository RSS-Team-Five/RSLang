import config from '../../models/Config';
import CustomElement from '../../utils/customElement';
import getOuterBall from '../components/outerBall';

async function createAudioChallengePage() {
  let level: number | undefined;

  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper game',
  });

  const gameIntro = new CustomElement('div', {
    className: 'game__intro',
  });

  const gameText = new CustomElement('div', {
    className: 'game__intro_text_ac',
  });

  const gameName = new CustomElement('h2', {
    className: 'game__name',
    textContent: `${config.GAMES.MAIN[1].gameName}`.toUpperCase(),
  });

  const gameDescription = new CustomElement('p', {
    className: 'game__description',
    innerText:
      'Это игра улучшает восприятие речи на слух.\nТвоя задача - выбрать правильный перевод слов.\nЧем больше ты дашь правильных ответов, тем больше баллов получишь.',
  });

  const gameKeys = new CustomElement('p', {
    className: 'game__keys',
    innerText:
      'Чтобы играть с помощью клавиатуры, используй клавиши:\n1, 2, 3, 4, 5 - чтобы дать ответ,\nspace - для воспроизведения звука,\nenter - чтобы пропустить вопрос или перейти к следующему вопросу.',
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
    textContent: 'Играть'.toUpperCase(),
  });

  const gameImg = getOuterBall(2, gameStartButton.element);
  gameImg.classList.add('ac');

  if (level === undefined) {
    gameStartButton.element.classList.add('inactive');
    gameStartButton.element.disabled = true;
    const levelsCollection: CustomElement<'button'>[] = [];
    config.SECTION_CARD.forEach((card, index) => {
      if (index < config.BOOK.maxGroup) {
        const gameLevel = new CustomElement('button', {
          className: 'game__level',
          textContent: (index + 1).toString(),
        });

        gameLevelBox.addChildren([gameLevel.element]);
        levelsCollection.push(gameLevel);

        gameLevel.element.addEventListener('click', () => {
          level = index;
          gameLevel.element.classList.add('active');
          levelsCollection.forEach((e) => {
            if (e.element.innerText !== (index + 1).toString()) e.element.classList.remove('active');
          });
          gameStartButton.element.classList.remove('inactive');
          gameStartButton.element.disabled = false;
        });
      }
    });
  } else {
    gameLevelDescription.element.innerHTML = '';
  }

  gameLevelBox.addChildren([gameStartButton.element]);

  gameStartButton.element.addEventListener('click', async () => {
    if (level !== undefined) {
      if (document.body.lastElementChild && document.body.lastElementChild instanceof HTMLElement) {
        const footer = document.body.lastElementChild;
        footer.hidden = true;
      }
      window.location.hash = `#/games/audio-challenge/${level}/all`;
    }
  });

  gameText.addChildren([
    gameName.element,
    gameDescription.element,
    gameKeys.element,
    gameLevelDescription.element,
    gameLevelBox.element,
  ]);

  const line = new CustomElement('span', {
    className: 'game__line',
  });

  gameIntro.addChildren([gameImg, gameText.element, line.element]);

  mainWrapper.addChildren([gameIntro.element]);

  return mainWrapper.element;
}

export default createAudioChallengePage;
