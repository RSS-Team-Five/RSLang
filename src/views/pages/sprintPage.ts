import config from '../../models/Config';
import CustomElement from '../../utils/customElement';
import startSprintGame from '../components/sprintGameStart';
import getSprintWords from '../components/sprintWords';
import spinnerWhite from '../../assets/icons/spinner-white.svg';
import getOuterBall from '../components/outerBall';

async function createSprintPage(group: string | undefined, page: string | undefined) {
  let level: number | undefined;
  let pageLevel: number | undefined;
  if (group) level = +group;
  if (page) pageLevel = +page;

  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper game',
  });

  const gameIntro = new CustomElement('div', {
    className: 'game__intro',
  });

  const gameText = new CustomElement('div', {
    className: 'game__intro_text',
  });

  const gameName = new CustomElement('h2', {
    className: 'game__name',
    textContent: `${config.GAMES.MAIN[0].gameName}`.toUpperCase(),
  });

  const gameDescription = new CustomElement('p', {
    className: 'game__description',
    innerText:
      'Это игра на время.\nТвоя задача - выбрать правильный перевод слов.\nЧем больше ты дашь правильных ответов за 60 секунд, тем больше баллов получишь.',
  });

  const gameKeys = new CustomElement('p', {
    className: 'game__keys',
    innerText:
      'Чтобы играть с помощью клавиатуры, используй:\nстрелку влево - чтобы дать ответ "неверно",\nстрелку вправо - чтобы дать ответ "верно".',
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

  const gameImg = getOuterBall(1, gameStartButton.element);

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
    const spinner = new CustomElement('dialog', { className: 'spinner' });
    const spinnerImg = new CustomElement('img', { className: 'spinner__img', src: spinnerWhite, alt: 'Spinner' });
    spinner.addChildren([spinnerImg.element]);

    if (level !== undefined) {
      if (document.body.lastElementChild && document.body.lastElementChild instanceof HTMLElement) {
        const footer = document.body.lastElementChild;
        footer.hidden = true;
      }
      gameIntro.element.classList.add('none');
      mainWrapper.element.append(spinner.element);
      spinner.element.showModal();
      const { gameWords, wordsArray } = await getSprintWords(level, pageLevel);
      if (gameWords.length === 0) {
        gameIntro.element.classList.add('none');
        const sorry = new CustomElement('div', {
          className: 'game__sorry',
        });
        const sorryText = new CustomElement('div', {
          className: 'game__sorry_text',
          innerText: 'Ты уже выучил все слова с этой и предыдущей страницы учебника.\nВыбери другу страницу.',
        });
        const sorryButton = new CustomElement('a', {
          className: 'game__sorry_button',
          textContent: 'Вернуться к учебнику',
          href: `#/book`,
        });
        sorry.addChildren([sorryText.element, sorryButton.element]);

        mainWrapper.addChildren([sorry.element]);
      } else {
        gameIntro.element.classList.add('none');
        const gameField = await startSprintGame(gameWords, wordsArray, gameIntro);
        spinner.element.remove();
        mainWrapper.addChildren([gameField.element]);
      }
      mainWrapper.element.classList.add('sprint');
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

export default createSprintPage;
