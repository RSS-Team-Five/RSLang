import config from '../../models/Config';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import soundIcon from '../../assets/icons/GREEN-sound.png';
import starBlank from '../../assets/icons/02icon-star.png';
import orangeStarBlank from '../../assets/icons/Star-orange-blank.png';
import starFill from '../../assets/icons/02icon-star-red.png';
import state from '../../models/State';
import CustomClickableElement from '../../utils/customClickableElement';
import isAllLearned from '../../utils/isAllLearned';
import Section from '../../controllers/Section';

async function needToReload(): Promise<void> {
  const section = new Section(state.group, state.page);
  const allWordsOnPage = await section.getWordsOnPage();
  if (isAllLearned(allWordsOnPage).isTrue || isAllLearned(allWordsOnPage).countLearned === allWordsOnPage.length - 1) {
    window.location.reload();
  }
}

class WordCard {
  word: IWord;
  isAuthorized?: boolean = state.user?.isAuthorized;
  userWords = state.user?.user.userWords;
  difficultStarIcon!: HTMLImageElement;
  learnedElement!: HTMLDivElement;
  infoCard!: CustomElement<'div'>;

  constructor(word: IWord) {
    this.word = word;
  }

  async createCard() {
    const userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
    const cardWrapper = new CustomElement('div', {
      className: 'section__cards-card card',
    });

    const cardImageBlock = this.cardImageBlock();
    const iconsBlock = await this.iconsBlock(cardWrapper);
    const cardInfo = this.info();

    if (userWord && userWord.length && userWord[0].optional.learned) {
      this.learnedElement.classList.add('card__icons-learned-button');
      this.learnedElement.classList.remove('card__icons-learned-mark');
      this.difficultStarIcon.src = orangeStarBlank;
      this.infoCard.element.style.color = 'white';
    }
    cardWrapper.addChildren([cardImageBlock.element, iconsBlock.element, cardInfo.element]);

    return cardWrapper.element;
  }

  winLose() {
    const winLoseElement = new CustomElement('div', {
      className: 'card__block-winlose',
    });

    if (this.userWords && state.user?.isAuthorized) {
      for (let i = 0; i < this.userWords?.length; i += 1) {
        if (this.userWords[i].wordId === this.word.id) {
          const win = new CustomElement('p', {
            className: 'card__block-winlose-win',
            innerHTML: `${this.userWords[i].optional.win}`,
          });

          const slash = new CustomElement('p', {
            className: 'card__block-winlose-slash',
            innerText: '/',
          });

          const lose = new CustomElement('p', {
            className: 'card__block-winlose-lose',
            innerHTML: `${this.userWords[i].optional.lose}`,
          });

          winLoseElement.addChildren([win.element, slash.element, lose.element]);
          break;
        }
      }
    }
    winLoseElement.element.setAttribute('title', 'Верные и неверные ответы');
    return winLoseElement;
  }

  cardImageBlock() {
    const imageWrapper = new CustomElement('div', {
      className: 'card__block',
    });

    const image = new CustomElement('img', {
      className: 'card__block-image',
      src: `${config.API.URL}/${this.word.image}`,
      alt: this.word.word,
    });

    const winLose = this.winLose();
    imageWrapper.addChildren([image.element, winLose.element]);
    return imageWrapper;
  }

  async iconsBlock(cardWrapper: CustomElement<'div'>) {
    const iconsWrapper = new CustomElement('div', {
      className: 'card__icons',
    });

    const soundElement = this.soundIcon();
    const difficultStar = await this.starIcon(cardWrapper.element);
    const learnedMark = await this.learnedWord(cardWrapper.element);
    iconsWrapper.addChildren([soundElement.element, difficultStar, learnedMark]);
    return iconsWrapper;
  }

  info() {
    this.infoCard = new CustomElement('div', {
      className: 'card__info',
    });

    const resources = [
      this.word.word,
      this.word.transcription,
      this.word.wordTranslate,
      this.word.textMeaning,
      this.word.textMeaningTranslate,
      this.word.textExample,
      this.word.textExampleTranslate,
    ];

    resources.forEach((res, i) => {
      const fieldElement = new CustomElement('p', {
        className: `card__info-field card__info-field-${i}`,
        innerHTML: res,
      }).element;
      this.infoCard.addChildren([fieldElement]);
    });
    return this.infoCard;
  }

  soundIcon() {
    const eventOnSoundIcon = async () => {
      const sounds = [
        `${config.API.URL}/${this.word.audio}`,
        `${config.API.URL}/${this.word.audioMeaning}`,
        `${config.API.URL}/${this.word.audioExample}`,
      ];
      const playSound1 = new Audio(sounds[0]);
      await playSound1.play();
      const playSound1Duration = playSound1.duration * 1000;
      const playSound2 = new Audio(sounds[1]);
      setTimeout(async () => {
        await playSound2.play();
        const playSound2Duration = (playSound1.duration + playSound2.duration) * 1000;
        const playSound3 = new Audio(sounds[2]);
        setTimeout(async () => {
          await playSound3.play();
        }, playSound2Duration);
      }, playSound1Duration);
    };
    const soundIconElement = new CustomClickableElement('img', 'click', eventOnSoundIcon, {
      className: 'card__icons-sound',
      src: soundIcon,
      alt: 'sound-icon',
    });

    return soundIconElement;
  }

  async starIcon(cardWrapper: HTMLDivElement) {
    let userWord = state.user?.user.userWords?.filter((word) => {
      return word.wordId === this.word.id;
    });

    const eventOnStar = async () => {
      if (!this.isAuthorized) {
        state.router?.view('/signUp');
        return;
      }
      userWord = state.user?.user.userWords
        ? state.user?.user.userWords.filter((word) => {
            return word.wordId === this.word.id;
          })
        : [];

      // not user word
      if (!userWord?.length) {
        await state.user?.createUserWord(state.user.user, this.word.id, {
          difficulty: 'hard',
          optional: {
            win: 0,
            lose: 0,
            learned: false,
          },
        });
        this.difficultStarIcon.src = starFill;
        cardWrapper.classList.add('card__icons-difficult');
      }

      // user word hard
      else if (userWord[0].difficulty === 'hard') {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: {
            win: userWord[0].optional.win,
            lose: userWord[0].optional.lose,
            learned: true,
          },
        });
        this.difficultStarIcon.src = starBlank;
        cardWrapper.classList.remove('card__icons-difficult');
        setTimeout(() => {
          if (window.location.hash === '#/section/6/0') {
            window.location.reload();
          }
          needToReload();
        }, 0);
      }

      // user word not hard
      else {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'hard',
          optional: {
            win: userWord[0].optional.win,
            lose: userWord[0].optional.lose,
            learned: false,
          },
        });
        this.difficultStarIcon.src = starFill;
        cardWrapper.classList.add('card__icons-difficult');
        cardWrapper.classList.remove('card__icons-learned');
        this.learnedElement.classList.add('card__icons-learned-mark');
        this.learnedElement.classList.remove('card__icons-learned-button');
        this.learnedElement.innerText = config.WORD.markAsUnlearned;
        this.infoCard.element.style.color = '#223c50';
        needToReload();
      }
    };

    this.difficultStarIcon = new CustomClickableElement('img', 'click', eventOnStar, {
      className: 'card__icons-star',
      src: starBlank,
      alt: 'star',
    }).element;

    if (userWord && userWord.length && userWord[0].optional.learned) {
      this.difficultStarIcon.src = orangeStarBlank;
    }

    if (!this.isAuthorized) {
      this.difficultStarIcon.classList.add('inactive');
    }

    if (userWord && userWord?.length && userWord[0].difficulty === 'hard') {
      cardWrapper.classList.add('card__icons-difficult');
      this.difficultStarIcon.src = starFill;
    }

    return this.difficultStarIcon;
  }

  async learnedWord(cardWrapper: HTMLDivElement) {
    let userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
    const eventOnLearned = async () => {
      if (!this.isAuthorized) {
        state.router?.view('/signUp');
        return;
      }
      userWord = state.user?.user.userWords
        ? state.user?.user.userWords.filter((word) => {
            return word.wordId === this.word.id;
          })
        : [];

      // not user word
      if (!userWord?.length) {
        await state.user?.createUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: {
            win: 0,
            lose: 0,
            learned: true,
          },
        });
        cardWrapper.classList.add('card__icons-learned');
        this.learnedElement.innerText = config.WORD.markAsLearned;
      }

      // learned user word
      else if (userWord[0].optional.learned) {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'unmarked',
          optional: {
            win: userWord[0].optional.win,
            lose: userWord[0].optional.lose,
            learned: false,
          },
        });
        cardWrapper.classList.remove('card__icons-learned');
        cardWrapper.classList.remove('card__icons-difficult');
        this.learnedElement.classList.add('card__icons-learned-mark');
        this.learnedElement.classList.remove('card__icons-learned-button');
        this.learnedElement.innerText = config.WORD.markAsUnlearned;
        this.infoCard.element.style.color = '#223c50';
        needToReload();
      }

      // not learned user word
      else {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: {
            win: userWord[0].optional.win,
            lose: userWord[0].optional.lose,
            learned: true,
          },
        });
        cardWrapper.classList.add('card__icons-learned');
        cardWrapper.classList.remove('card__icons-difficult');
        this.learnedElement.classList.add('card__icons-learned-button');
        this.learnedElement.classList.remove('card__icons-learned-mark');
        this.difficultStarIcon.src = orangeStarBlank;
        this.infoCard.element.style.color = 'white';
        this.learnedElement.innerText = config.WORD.markAsLearned;
        setTimeout(() => {
          if (window.location.hash === '#/section/6/0') {
            window.location.reload();
          }
        }, 500);
        needToReload();
      }
    };

    this.learnedElement = new CustomClickableElement('div', 'click', eventOnLearned, {
      className: 'card__icons-learned-mark',
      innerText: config.WORD.markAsUnlearned,
    }).element;

    if (!this.isAuthorized) {
      this.learnedElement.classList.add('inactive');
      cardWrapper.classList.remove('card__icons-learned');
    } else if (userWord && userWord?.length && userWord[0].optional.learned) {
      cardWrapper.classList.add('card__icons-learned');
      this.learnedElement.innerText = config.WORD.markAsLearned;
    }

    return this.learnedElement;
  }
}

export default WordCard;
