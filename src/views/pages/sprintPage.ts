import { wordsFromAPI } from '../../api/words/wordsApi';
import config from '../../models/Config';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import shuffle from '../../utils/shuffleArray';

async function startSprintGame(gameWords: IWord[]) {
  console.log(gameWords);

  const gameContainer = new CustomElement('div', {
    className: 'game__container',
  });

  const soundButton = new CustomElement('button', {
    className: 'game__sound',
    textContent: 'mute',
  });

  const gameInfoTable = new CustomElement('div', {
    className: 'game__info-table',
  });

  const gameScore = new CustomElement('p', {
    className: 'game__score',
    textContent: '0',
  });

  const gamePoints = new CustomElement('p', {
    className: 'game__points',
    textContent: '+10 points',
  });

  const gamePointsProgress = new CustomElement('div', {
    className: 'game__points_progress',
  });

  for (let i = 0; i < 3; i += 1) {
    const dotProgress = new CustomElement('div', {
      className: 'game__points_progress_dot',
    });
    gamePointsProgress.addChildren([dotProgress.element]);
  }

  gameInfoTable.addChildren([gameScore.element, gamePoints.element, gamePointsProgress.element]);

  const gameCard = new CustomElement('div', {
    className: 'game__card',
  });

  const gameAnimal = new CustomElement('img', {
    className: 'game__animal',
    src: config.GAMES.SPRINT[0].imgUrl,
    alt: config.GAMES.SPRINT[0].alt,
  });

  const gameWord = new CustomElement('p', {
    className: 'game__word',
    textContent: gameWords[0].word,
  });

  const gameWordTranslate = new CustomElement('p', {
    className: 'game__word_translate',
    textContent: gameWords[0].wordTranslate,
  });

  const gameButtons = new CustomElement('div', {
    className: 'game__button',
  });

  const gameButtonWrong = new CustomElement('button', {
    className: 'game__button_wrong',
    textContent: 'Неверно'.toUpperCase(),
  });

  const gameButtonRight = new CustomElement('button', {
    className: 'game__button_right',
    textContent: 'Верно'.toUpperCase(),
  });

  gameButtons.addChildren([gameButtonWrong.element, gameButtonRight.element]);

  gameCard.addChildren([gameAnimal.element, gameWord.element, gameWordTranslate.element, gameButtons.element]);

  gameContainer.addChildren([soundButton.element, gameInfoTable.element, gameCard.element]);

  return gameContainer;
}

async function getSprintWords(level: number) {
  const pagesSet = new Set<number>();

  while (pagesSet.size < 3) {
    const page = Math.floor(Math.random() * (config.BOOK.maxPage + 1));
    pagesSet.add(page);
  }
  const pagesArr = Array.from(pagesSet);

  let allGameWords: IWord[] = [];

  await Promise.all(
    pagesArr.map(async (page) => {
      const wordsFromPage = (await wordsFromAPI(level, page)) as IWord[];
      allGameWords = allGameWords.concat(wordsFromPage);
    })
  );
  allGameWords = shuffle(allGameWords);

  const correctWords = allGameWords.slice(0, config.BOOK.maxPage + 1);
  const incorrectWords = allGameWords.slice(config.BOOK.maxPage + 1);

  incorrectWords.forEach((word) => {
    const randomIndex = Math.floor(Math.random() * allGameWords.length);
    word.wordTranslate = allGameWords[randomIndex].wordTranslate;
  });

  let gameWords = correctWords.concat(incorrectWords);
  gameWords = shuffle(gameWords);

  return gameWords;
}

async function createSprintPage() {
  let level: number | null = null;

  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper game',
  });

  const gameCard = new CustomElement('div', {
    className: 'game__card',
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

  config.SECTION_CARD.forEach((card, index) => {
    if (index < config.BOOK.maxGroup) {
      const gameLevel = new CustomElement('button', {
        className: 'game__level',
        textContent: (index + 1).toString(),
      });
      gameLevel.element.addEventListener('click', async () => {
        level = index;
        const gameWords = await getSprintWords(level);
        mainWrapper.element.innerHTML = '';
        const gameContainer = await startSprintGame(gameWords);
        mainWrapper.addChildren([gameContainer.element]);
      });

      gameLevelBox.addChildren([gameLevel.element]);
    }
  });

  gameCard.addChildren([gameName.element, gameDescription.element, gameLevelDescription.element, gameLevelBox.element]);

  mainWrapper.addChildren([gameCard.element]);

  return mainWrapper.element;
}

export default createSprintPage;
