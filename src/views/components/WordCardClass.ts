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

  async createCard() {
    const cardWrapper = new CustomElement('div', {
      className: 'section__cards-card card',
    });

    const cardImage = this.cardImage();
    const cardInfo = this.info();
    const soundElement = this.soundIcon();
    const difficultStar = await this.starIcon(cardWrapper.element);

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
    let difficultStarIcon: HTMLImageElement;

    let userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
    const eventOnStar = async () => {
      userWord = state.user?.user.userWords?.filter((word) => word.wordId === this.word.id);
      console.log('im here');
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
        difficultStarIcon.src = starFill;
        cardWrapper.classList.add('card__difficult');
      }

      // user word hard
      else if (userWord[0].difficulty === 'hard') {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'easy',
          optional: userWord[0].optional,
        });
        difficultStarIcon.src = starBlank;
        cardWrapper.classList.remove('card__difficult');
        if (window.location.hash === '#/section/6/0') {
          window.location.reload();
        }
      }

      // user word not hard
      else {
        await state.user?.updateUserWord(state.user.user, this.word.id, {
          difficulty: 'hard',
          optional: userWord[0].optional,
        });
        difficultStarIcon.src = starFill;
        cardWrapper.classList.add('card__difficult');
      }
      difficultStarIcon.removeEventListener('click', eventOnStar);
      console.log('🚀 ~ state.user.userWords', state.user?.user.userWords);
      if (state.user) {
        // state.user.userWords = await state.user.getUserAggregatedWords(state.user.user, {});
      }
      difficultStarIcon.addEventListener('click', eventOnStar);
    };

    difficultStarIcon = new CustomClickableElement('img', 'click', eventOnStar, {
      className: 'card__star',
      src: starBlank,
      alt: 'star',
    }).element;

    if (!this.isAuthorized) {
      difficultStarIcon.classList.add('inactive');
    }

    if (userWord && userWord?.length && userWord[0].difficulty === 'hard') {
      cardWrapper.classList.add('card__difficult');
      difficultStarIcon.src = starFill;
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
