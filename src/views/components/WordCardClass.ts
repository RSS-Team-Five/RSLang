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

  constructor(word: IWord) {
    this.word = word;
  }

  createCard() {
    const cardWrapper = new CustomElement('div', {
      className: 'section__cards-card card',
    });

    const cardImage = this.cardImage();
    const cardInfo = this.info();
    const soundElement = this.soundIcon();
    const difficultStar = this.starIcon(cardWrapper.element);

    cardWrapper.addChildren([cardImage.element, cardInfo.element, soundElement.element, difficultStar]);

    return cardWrapper.element;
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

  starIcon(cardWrapper: HTMLDivElement) {
    const userWordsId: string[] = [];
    this.userWords?.forEach((wordWithId) => userWordsId.push(wordWithId.wordId));
    const isUserWord = userWordsId.includes(this.word.id);
    let difficultStarIcon: HTMLImageElement;

    const eventOnBlankStar = () => {
      if (!this.isAuthorized) {
        window.location.href = `#/signUp`;
      }
      state.user?.createUserWord(state.user.user, this.word.id, {
        difficulty: 'hard',
        optional: {},
      });
      difficultStarIcon.src = starFill;
      cardWrapper.classList.add('card__difficult');
      difficultStarIcon.removeEventListener('click', eventOnBlankStar);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      difficultStarIcon.addEventListener('click', eventOnFilledStar);
    };

    const eventOnFilledStar = () => {
      state.user?.deleteUserWord(state.user?.user, this.word.id);
      difficultStarIcon.src = starBlank;
      cardWrapper.classList.remove('card__difficult');
      difficultStarIcon.removeEventListener('click', eventOnFilledStar);
      difficultStarIcon.addEventListener('click', eventOnBlankStar);
    };

    if (!isUserWord) {
      difficultStarIcon = new CustomClickableElement('img', 'click', eventOnBlankStar, {
        className: 'card__star',
        src: starBlank,
        alt: 'star',
      }).element;
    } else {
      difficultStarIcon = new CustomClickableElement('img', 'click', eventOnFilledStar, {
        className: 'card__star',
        src: starFill,
        alt: 'star',
      }).element;
    }

    if (!this.isAuthorized) {
      difficultStarIcon.classList.add('inactive');
    }

    if (isUserWord) {
      cardWrapper.classList.add('card__difficult');
    }

    return difficultStarIcon;
  }

  // learnedWord() {
  //   const learnedIconElement = new CustomElement('img', {
  //     className: 'card__sound',
  //     src: soundIcon,
  //     alt: 'sound-icon',
  //   });
  // }
}

export default WordCard;
