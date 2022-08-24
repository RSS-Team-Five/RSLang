import config from '../../models/Config';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import soundIcon from '../../assets/icons/sound.png';
import starBlank from '../../assets/icons/02icon-star.png';
import starFill from '../../assets/icons/02icon-star-red.png';
import state from '../../models/State';

class WordCard {
  word: IWord;
  isAuthorized?: boolean = state.user?.isAuthorized;

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
    const difficultStar = this.starIcon();

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
    const soundIconElement = new CustomElement('img', {
      className: 'card__sound',
      src: soundIcon,
      alt: 'sound-icon',
    });

    soundIconElement.element.addEventListener('click', async () => {
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
    });
    return soundIconElement;
  }

  starIcon() {
    const userWordsId: string[] = [];
    const userWords = state.user?.user.userWords;
    userWords?.forEach((wordWithId) => userWordsId.push(wordWithId.wordId));

    const difficultStarIcon = !userWordsId.includes(this.word.id)
      ? new CustomElement('img', {
          className: 'card__star',
          src: starBlank,
          alt: 'star',
        }).element
      : new CustomElement('img', {
          className: 'card__star',
          src: starFill,
          alt: 'star',
        }).element;
    difficultStarIcon.addEventListener('click', async () => {
      if (!this.isAuthorized) {
        window.location.href = `#/signUp`;
      } else if (difficultStarIcon.src === starBlank) {
        await state.user?.createUserWord(state.user.user, this.word.id, {
          difficulty: 'hard',
          optional: {},
        });
        difficultStarIcon.src = starFill;
      } else {
        await state.user?.deleteUserWord(state.user?.user, this.word.id);
        difficultStarIcon.src = starBlank;
      }
    });
    return difficultStarIcon;
  }
}

export default WordCard;
