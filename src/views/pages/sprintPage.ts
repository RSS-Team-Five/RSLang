import { wordsFromAPI } from '../../api/words/wordsApi';
import config from '../../models/Config';
import IGameWord from '../../types/IGameWord';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import shuffle from '../../utils/shuffleArray';

async function startSprintGame(gameWords: IGameWord[], wordsArray: IWord[]) {
  let count = 0;
  let score = 0;
  let points = 10;
  let pointsCounter = 0;
  let timer: NodeJS.Timeout;
  let counting = 60;

  const gameField = new CustomElement('div', {
    className: 'game__field',
  });

  const gameTimer = new CustomElement('div', {
    className: 'game__timer',
  });

  const gameCounting = new CustomElement('p', {
    className: 'game__timer__counting',
    textContent: counting.toString(),
  });

  gameTimer.addChildren([gameCounting.element]);

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
    textContent: score.toString(),
  });

  const gamePoints = new CustomElement('p', {
    className: 'game__points',
    textContent: `+${points} очков`,
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
  const dots = Array.from(gamePointsProgress.element.children);

  gameInfoTable.addChildren([gameScore.element, gamePoints.element, gamePointsProgress.element]);

  const gameCard = new CustomElement('div', {
    className: 'game__card',
  });

  const gameAnimal = new CustomElement('img', {
    className: 'game__animal',
    src: config.GAMES.SPRINT[count].imgUrl,
    alt: config.GAMES.SPRINT[count].alt,
  });

  const gameWord = new CustomElement('p', {
    className: 'game__word',
    textContent: gameWords[count].word,
  });

  const gameWordTranslate = new CustomElement('p', {
    className: 'game__word_translate',
    textContent: gameWords[count].wordTranslate,
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

  function refreshWords() {
    gameWord.element.textContent = gameWords[count].word;
    gameWordTranslate.element.textContent = gameWords[count].wordTranslate;
  }

  function refreshPoints() {
    gameContainer.element.classList.add('animate_green');
    setTimeout(() => gameContainer.element.classList.remove('animate_green'), 800);
    count += 1;
    pointsCounter += 1;
    if (pointsCounter > 0 && pointsCounter < 4) {
      dots[pointsCounter - 1].classList.add('dot_actual');
    }
    if (pointsCounter === 4) {
      gameAnimal.element.src = config.GAMES.SPRINT[points / 10].imgUrl;
      gameAnimal.element.alt = config.GAMES.SPRINT[points / 10].alt;
      points += 10;
      pointsCounter = 0;
      gamePoints.element.textContent = `+${points} очков`;
      switch (points) {
        case 20:
          gamePoints.element.classList.add('points_red');
          break;
        case 30:
          gamePoints.element.classList.remove('points_red');
          gamePoints.element.classList.add('points_orange');
          break;
        case 40:
          gamePoints.element.classList.remove('points_orange');
          gamePoints.element.classList.add('points_yellow');
          break;
        case 50:
          gamePoints.element.classList.remove('points_yellow');
          gamePoints.element.classList.add('points_green');
          break;
        case 60:
          gamePoints.element.classList.remove('points_green');
          gamePoints.element.classList.add('points_blue');
          break;
        case 70:
          gamePoints.element.classList.remove('points_blue');
          gamePoints.element.classList.add('points_dark-blue');
          break;
        case 80:
          gamePoints.element.classList.remove('points_dark-blue');
          gamePoints.element.classList.add('points_purple');
          break;
        case 90:
          gamePoints.element.classList.remove('points_purple');
          gamePoints.element.classList.add('points_red');
          break;
        case 100:
          gamePoints.element.classList.remove('points_red');
          gamePoints.element.classList.add('points_orange');
          break;
        case 110:
          gamePoints.element.classList.remove('points_orange');
          gamePoints.element.classList.add('points_yellow');
          break;
        case 120:
          gamePoints.element.classList.remove('points_yellow');
          gamePoints.element.classList.add('points_green');
          break;
        case 130:
          gamePoints.element.classList.remove('points_green');
          gamePoints.element.classList.add('points_blue');
          break;
        case 140:
          gamePoints.element.classList.remove('points_blue');
          gamePoints.element.classList.add('points_dark-blue');
          break;
        default:
          gamePoints.element.classList.remove('points_dark-blue');
          gamePoints.element.classList.add('points_purple');
          break;
      }
      dots.forEach((dot) => dot.classList.remove('dot_actual'));
    }
    score += points;
    gameScore.element.textContent = score.toString();
  }

  function refreshProgress() {
    gameContainer.element.classList.add('animate_red');
    setTimeout(() => gameContainer.element.classList.remove('animate_red'), 800);
    count += 1;
    pointsCounter = 0;
    points = 10;
    gamePoints.element.textContent = `+${points} очков`;
    dots.forEach((dot) => dot.classList.remove('dot_actual'));
    gameAnimal.element.src = config.GAMES.SPRINT[pointsCounter].imgUrl;
    gameAnimal.element.alt = config.GAMES.SPRINT[pointsCounter].alt;
  }

  function drawResults() {
    clearTimeout(timer);
    gameField.element.innerHTML = '';
    const resultTable = new CustomElement('div', {
      className: 'game__result__table',
    });
    gameField.addChildren([resultTable.element]);

    const gameTotalScore = new CustomElement('p', {
      className: 'game__result__total-score',
      textContent: score.toString(),
    });

    resultTable.addChildren([gameTotalScore.element]);

    gameWords.forEach((word) => {
      if (word.guess !== null) {
        const wordLine = new CustomElement('div', {
          className: 'game__result__word-line',
        });

        const correctness = new CustomElement('div', {
          className: 'game__result__word__correctness',
        });

        if (word.guess) {
          correctness.element.classList.add('correct_green');
        } else {
          correctness.element.classList.add('correct_red');
        }

        const wordName = new CustomElement('p', {
          className: 'game__result__word',
          textContent: word.word,
        });

        const wordTranslation = new CustomElement('p', {
          className: 'game__result__word_translation',
          textContent: word.wordTranslate,
        });

        wordLine.addChildren([correctness.element, wordName.element, wordTranslation.element]);

        resultTable.addChildren([wordLine.element]);
      }
    });
  }

  function startTimer() {
    counting -= 1;
    gameCounting.element.textContent = counting.toString();
    if (counting === 40) {
      gameCounting.element.classList.add('counting_yellow');
    }
    if (counting < 27) {
      gameCounting.element.classList.add('counting_red');
    }
    if (counting === 0) {
      clearTimeout(timer);
      drawResults();
    } else {
      timer = setTimeout(startTimer, 1000);
    }
  }
  startTimer();

  function getWrongAnswer() {
    const actualWord = wordsArray.find((word) => word.word === gameWord.element.textContent);
    const wordIndex = gameWords.findIndex((word) => word.word === actualWord?.word);
    if (actualWord && gameWordTranslate.element.textContent === actualWord.wordTranslate) {
      gameWords[wordIndex].guess = false;
      refreshProgress();
    } else {
      gameWords[wordIndex].guess = true;
      refreshPoints();
    }
    if (count < gameWords.length) {
      refreshWords();
    } else {
      clearTimeout(timer);
      drawResults();
    }
  }

  function getRightAnswer() {
    const actualWord = wordsArray.find((word) => word.word === gameWord.element.textContent);
    const wordIndex = gameWords.findIndex((word) => word.word === actualWord?.word);
    if (actualWord && gameWordTranslate.element.textContent === actualWord.wordTranslate) {
      gameWords[wordIndex].guess = true;
      refreshPoints();
    } else {
      gameWords[wordIndex].guess = false;
      refreshProgress();
    }
    if (count < gameWords.length) {
      refreshWords();
    } else {
      clearTimeout(timer);
      drawResults();
    }
  }

  gameButtonWrong.element.addEventListener('click', () => getWrongAnswer());
  gameButtonRight.element.addEventListener('click', () => getRightAnswer());

  document.onkeydown = (e) => {
    if (e.key === 'ArrowRight') getRightAnswer();
    if (e.key === 'ArrowLeft') getWrongAnswer();
  };

  gameButtons.addChildren([gameButtonWrong.element, gameButtonRight.element]);

  gameCard.addChildren([gameAnimal.element, gameWord.element, gameWordTranslate.element, gameButtons.element]);

  gameContainer.addChildren([soundButton.element, gameInfoTable.element, gameCard.element]);

  gameField.addChildren([gameTimer.element, gameContainer.element]);

  return gameField;
}

async function getSprintWords(level: number) {
  const pagesSet = new Set<number>();

  while (pagesSet.size < 3) {
    const page = Math.floor(Math.random() * (config.BOOK.maxPage + 1));
    pagesSet.add(page);
  }
  const pagesArr = Array.from(pagesSet);

  let wordsArray: IWord[] = [];

  await Promise.all(
    pagesArr.map(async (page) => {
      const wordsFromPage = (await wordsFromAPI(level, page)) as IWord[];
      wordsArray = wordsArray.concat(wordsFromPage);
    })
  );
  wordsArray = shuffle(wordsArray);

  const correctWords = JSON.parse(JSON.stringify(wordsArray.slice(0, config.BOOK.maxPage + 1))) as IGameWord[];
  const incorrectWords = JSON.parse(JSON.stringify(wordsArray.slice(config.BOOK.maxPage + 1))) as IGameWord[];

  incorrectWords.forEach((word) => {
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    word.wordTranslate = wordsArray[randomIndex].wordTranslate;
  });

  let gameWords = correctWords.concat(incorrectWords);
  gameWords = shuffle(gameWords);
  gameWords.forEach((word) => {
    word.guess = null;
  });

  return { gameWords, wordsArray };
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
        const { gameWords, wordsArray } = await getSprintWords(level);
        mainWrapper.element.innerHTML = '';
        const gameContainer = await startSprintGame(gameWords, wordsArray);
        mainWrapper.element.classList.add('sprint');
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
