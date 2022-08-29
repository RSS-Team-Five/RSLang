import config from '../../models/Config';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import soundIcon from '../../assets/icons/sound.png';
import starBlank from '../../assets/icons/02icon-star.png';
import starFill from '../../assets/icons/02icon-star-red.png';
import state from '../../models/State';
import CustomClickableElement from '../../utils/customClickableElement';

class WordCard {
  word: IWord;
  isAuthorized?: boolean = state.user?.isAuthorized;
  userWords = state.user?.user.userWords;
  difficultStarIcon!: HTMLImageElement;
  learnedElement!: HTMLDivElement;

  constructor(word: IWord) {
    this.word = word;
  }

  async createCard() {
    const cardWrapper = new CustomElement('div', {
      className: 'section__cards-card card',
    });

    const winLose = await this.winLose();
    const cardImage = this.cardImage();
    const cardInfo = this.info();
    const soundElement = this.soundIcon();
    const difficultStar = await this.starIcon(cardWrapper.element);
    const learnedMark = await this.learnedWord(cardWrapper.element);

    cardWrapper.addChildren([
      winLose.element,
      cardImage.element,
      cardInfo.element,
      soundElement.element,
      difficultStar,
      learnedMark,
    ]);

    return cardWrapper.element;
  }

  async winLose() {
    const winLoseElement = new CustomElement('div', {
      className: 'card__winlose',
    });

    if (this.userWords && state.user?.isAuthorized) {
      for (let i = 0; i < this.userWords?.length; i += 1) {
        if (this.userWords[i].wordId === this.word.id) {
          const win = new CustomElement('p', {
            className: 'card__win',
            innerHTML: `Wins: ${this.userWords[i].optional.win}`,
          });

          const lose = new CustomElement('p', {
            className: 'card__win',
            innerHTML: `Loses: ${this.userWords[i].optional.lose}`,
          });

          winLoseElement.addChildren([win.element, lose.element]);
          break;
        }
      }
    }
    return winLoseElement;
  }

  cardImage() {
    return new CustomElement('img', {
      className: 'card__image',
      src: `${config.API.URL}/${this.word.image}`,
      alt: this.word.word,
    });
  }

  info() {
    const infoCard = new CustomElement('div', {
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

    resources.forEach((res) => {
      const fieldElement = new CustomElement('p', {
        className: 'card__info-field',
        innerHTML: res,
      });
      infoCard.addChildren([fieldElement.element]);
    });
    return infoCard;
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
      className: 'card__sound',
      src: soundIcon,
      alt: 'sound-icon',
    });

    return soundIconElement;
  }

  async starIcon(cardWrapper: HTMLDivElement) {
    let userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
    const eventOnStar = async () => {
      userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
      if (!this.isAuthorized) {
        window.location.href = `#/signUp`;
      }
      if (!userWord) {
        throw new Error('Invalid user data!');
      }

      // not user word
      if (!userWord?.length) {
        await state.user?.createUserWord(state.user.user, this.word.id, {
          difficulty: 'hard',
          optional: {
            win: 0,
            lose: 0,
            learned: false,
            new: 'no date',
          },
        });
        this.difficultStarIcon.src = starFill;
        cardWrapper.classList.add('card__difficult');
      }

      // user word hard
      else if (userWord[0].difficulty === 'hard') {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: userWord[0].optional,
        });
        this.difficultStarIcon.src = starBlank;
        cardWrapper.classList.remove('card__difficult');
        setTimeout(() => {
          if (window.location.hash === '#/section/6/0') {
            window.location.reload();
          }
        }, 500);
      }

      // user word not hard
      else {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'hard',
          optional: userWord[0].optional,
        });
        this.difficultStarIcon.src = starFill;
        cardWrapper.classList.add('card__difficult');
        cardWrapper.classList.remove('card__learned');
        this.learnedElement.innerText = config.WORD.markAsUnlearned;
      }
    };

    this.difficultStarIcon = new CustomClickableElement('img', 'click', await eventOnStar, {
      className: 'card__star',
      src: starBlank,
      alt: 'star',
    }).element;

    if (!this.isAuthorized) {
      this.difficultStarIcon.classList.add('inactive');
    }

    if (userWord && userWord?.length && userWord[0].difficulty === 'hard') {
      cardWrapper.classList.add('card__difficult');
      this.difficultStarIcon.src = starFill;
    }

    return this.difficultStarIcon;
  }

  async learnedWord(cardWrapper: HTMLDivElement) {
    let userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
    const eventOnLearned = async () => {
      userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
      if (!this.isAuthorized) {
        window.location.href = `#/signUp`;
      }
      if (!userWord) {
        throw new Error('Invalid user data!');
      }
      // not user word
      if (!userWord?.length) {
        await state.user?.createUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: {
            win: 0,
            lose: 0,
            learned: false,
            new: 'no date',
          },
        });
        cardWrapper.classList.add('card__learned');
        this.learnedElement.innerText = config.WORD.markAsLearned;
      }

      // user word easy
      else if (userWord[0].difficulty === 'easy') {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'unmarked',
          optional: userWord[0].optional,
        });
        cardWrapper.classList.remove('card__learned');
        cardWrapper.classList.remove('card__difficult');
        this.learnedElement.innerText = config.WORD.markAsUnlearned;
      }

      // user word not easy
      else {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: userWord[0].optional,
        });
        cardWrapper.classList.add('card__learned');
        cardWrapper.classList.remove('card__difficult');
        this.learnedElement.innerText = config.WORD.markAsLearned;
        this.difficultStarIcon.src = starBlank;
        setTimeout(() => {
          if (window.location.hash === '#/section/6/0') {
            window.location.reload();
          }
        }, 500);
      }
    };

    this.learnedElement = new CustomClickableElement('div', 'click', await eventOnLearned, {
      className: 'card__learned-mark',
      innerText: config.WORD.markAsUnlearned,
    }).element;

    if (!this.isAuthorized) {
      this.learnedElement.classList.add('inactive');
    }

    if (userWord && userWord?.length && userWord[0].difficulty === 'easy') {
      cardWrapper.classList.add('card__learned');
      this.learnedElement.innerText = config.WORD.markAsLearned;
    }

    return this.learnedElement;
  }
}

export default WordCard;
