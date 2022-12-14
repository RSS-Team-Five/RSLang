import config from '../../models/Config';
import state from '../../models/State';
import IGameWord from '../../types/IGameWord';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import getOuterBall from './outerBall';
import drawResults from './sprintResults';
import winSample from '../../assets/sounds/win.mp3';
import loseSample from '../../assets/sounds/lose.mp3';

async function startSprintGame(gameWords: IGameWord[], wordsArray: IWord[], gameIntro: CustomElement<'div'>) {
  let count = 0;
  let score = 0;
  let points = 10;
  let pointsCounter = 0;
  let timer: ReturnType<typeof setTimeout>;
  let counting = 60;

  if (state.user?.isAuthorized) {
    await state.user.getAllUserWords(state.user.user);
  }

  gameIntro.element.classList.add('none');

  const line = new CustomElement('span', {
    className: 'sprint__line',
  });

  const sprintBall = getOuterBall(1);
  sprintBall.classList.add('bottom');

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

  const gameInfoTable = new CustomElement('div', {
    className: 'game__info-table',
  });

  const infoTableFirstRow = new CustomElement('div', {
    className: 'game__info-table_first-row',
  });

  const soundButton = new CustomElement('button', {
    className: 'game__sound_on',
    textContent: 'убрать звук'.toUpperCase(),
  });

  soundButton.element.addEventListener('click', () => {
    if (soundButton.element.classList.contains('game__sound_on')) {
      soundButton.element.textContent = 'включить звук'.toUpperCase();
      soundButton.element.classList.remove('game__sound_on');
      soundButton.element.classList.add('game__sound_of');
    } else {
      soundButton.element.textContent = 'убрать звук'.toUpperCase();
      soundButton.element.classList.remove('game__sound_of');
      soundButton.element.classList.add('game__sound_on');
    }
  });

  const gameScore = new CustomElement('p', {
    className: 'game__score',
    textContent: score.toString(),
  });

  infoTableFirstRow.addChildren([gameScore.element, soundButton.element]);

  const gamePoints = new CustomElement('p', {
    className: 'game__points',
    textContent: `+${points} очков`.toUpperCase(),
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

  gameInfoTable.addChildren([infoTableFirstRow.element, gamePoints.element, gamePointsProgress.element]);

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
    textContent: gameWords[count].word.toUpperCase(),
  });

  const gameWordTranslate = new CustomElement('p', {
    className: 'game__word_translate',
    textContent: gameWords[count].wordTranslate.toUpperCase(),
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

  // eslint ругается на доступ к ф-цям до их объявления
  /* eslint-disable */
  function eventHandler(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') getRightAnswer();
    if (e.key === 'ArrowLeft') getWrongAnswer();
  }
  /* eslint-enable */

  function refreshWords() {
    gameWord.element.textContent = gameWords[count].word.toUpperCase();
    gameWordTranslate.element.textContent = gameWords[count].wordTranslate.toUpperCase();
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
      gamePoints.element.textContent = `+${points} очков`.toUpperCase();
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

  async function refreshProgress() {
    gameContainer.element.classList.add('animate_red');
    setTimeout(() => gameContainer.element.classList.remove('animate_red'), 800);
    count += 1;
    pointsCounter = 0;
    points = 10;
    gamePoints.element.textContent = `+${points} очков`.toUpperCase();
    dots.forEach((dot) => dot.classList.remove('dot_actual'));
    const regex = 'points_[a-zA-Z-]+';
    const classArray = Array.from(gamePoints.element.classList);
    const classToRemove = classArray.find((item) => item.match(regex));
    if (classToRemove) gamePoints.element.classList.remove(classToRemove);
    gameAnimal.element.src = config.GAMES.SPRINT[pointsCounter].imgUrl;
    gameAnimal.element.alt = config.GAMES.SPRINT[pointsCounter].alt;
  }

  async function startTimer() {
    counting -= 1;
    gameCounting.element.textContent = counting.toString();
    if (counting === 40) {
      gameCounting.element.classList.add('counting_blue');
    }
    if (counting < 27) {
      gameCounting.element.classList.remove('counting_blue');
      gameCounting.element.classList.add('counting_dark-grey');
    }
    if (counting === 0) {
      clearTimeout(timer);
      document.removeEventListener('keydown', eventHandler);
      await drawResults(gameField, gameIntro, gameWords, timer, score);
    } else {
      timer = setTimeout(startTimer, 1000);
    }
  }
  startTimer();

  async function getWrongAnswer() {
    const actualWord = wordsArray.find(
      (word) => word.word.toLowerCase() === gameWord.element.textContent?.toLowerCase()
    );
    const wordIndex = gameWords.findIndex((word) => word.word.toLowerCase() === actualWord?.word.toLowerCase());
    if (actualWord && gameWordTranslate.element.textContent?.toLowerCase() === actualWord.wordTranslate.toLowerCase()) {
      const loseSound = new Audio(loseSample);
      if (soundButton.element.classList.contains('game__sound_of')) loseSound.volume = 0;
      else loseSound.volume = 0.2;
      loseSound.play();
      gameWords[wordIndex].guess = false;
      refreshProgress();
    } else {
      const winSound = new Audio(winSample);
      if (soundButton.element.classList.contains('game__sound_of')) winSound.volume = 0;
      else winSound.volume = 0.2;
      winSound.play();
      gameWords[wordIndex].guess = true;
      refreshPoints();
    }
    if (count < gameWords.length) {
      refreshWords();
    } else {
      clearTimeout(timer);
      document.removeEventListener('keydown', eventHandler);
      await drawResults(gameField, gameIntro, gameWords, timer, score);
    }
  }

  async function getRightAnswer() {
    const actualWord = wordsArray.find(
      (word) => word.word.toLowerCase() === gameWord.element.textContent?.toLowerCase()
    );
    const wordIndex = gameWords.findIndex((word) => word.word.toLowerCase() === actualWord?.word.toLowerCase());
    if (
      actualWord &&
      gameWordTranslate.element.textContent?.toLowerCase() === actualWord.wordTranslate?.toLowerCase()
    ) {
      const winSound = new Audio(winSample);
      if (soundButton.element.classList.contains('game__sound_of')) winSound.volume = 0;
      else winSound.volume = 0.2;
      winSound.play();
      gameWords[wordIndex].guess = true;
      refreshPoints();
    } else {
      const loseSound = new Audio(loseSample);
      if (soundButton.element.classList.contains('game__sound_of')) loseSound.volume = 0;
      else loseSound.volume = 0.2;
      loseSound.play();
      gameWords[wordIndex].guess = false;
      refreshProgress();
    }
    if (count < gameWords.length) {
      refreshWords();
    } else {
      clearTimeout(timer);
      document.removeEventListener('keydown', eventHandler);
      await drawResults(gameField, gameIntro, gameWords, timer, score);
    }
  }

  gameButtonWrong.element.addEventListener('click', () => getWrongAnswer());
  gameButtonRight.element.addEventListener('click', () => getRightAnswer());

  document.addEventListener('keydown', eventHandler);
  window.addEventListener('hashchange', () => document.removeEventListener('keydown', eventHandler));

  gameButtons.addChildren([gameButtonWrong.element, gameButtonRight.element]);

  gameCard.addChildren([gameAnimal.element, gameWord.element, gameWordTranslate.element, gameButtons.element]);

  gameContainer.addChildren([gameInfoTable.element, gameCard.element]);

  gameField.addChildren([gameTimer.element, gameContainer.element, sprintBall, line.element]);

  return gameField;
}

export default startSprintGame;
