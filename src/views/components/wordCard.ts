import config from '../../models/Config';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';
import soundIcon from '../../assets/icons/sound.png';

function createWordCard(word: IWord) {
  console.log(word);
  const cardWrapper = new CustomElement('div', {
    className: 'section__cards-card card',
  });

  const cardImage = new CustomElement('img', {
    className: 'card__image',
    src: `${config.API.URL}/${word.image}`,
    alt: word.word,
  });

  const cardInfo = new CustomElement('div', {
    className: 'card__info',
  });

  const resources = [
    word.word,
    word.transcription,
    word.wordTranslate,
    word.textMeaning,
    word.textMeaningTranslate,
    word.textExample,
    word.textExampleTranslate,
  ];

  resources.forEach((res) => {
    const fieldElement = new CustomElement('p', {
      className: 'card__info-field',
      innerHTML: res,
    });
    cardInfo.addChildren([fieldElement.element]);
  });

  const soundElement = new CustomElement('img', {
    className: 'card__sound',
    src: soundIcon,
    alt: 'sound-icon',
  });

  soundElement.element.addEventListener('click', async () => {
    const sounds = [
      `${config.API.URL}/${word.audio}`,
      `${config.API.URL}/${word.audioMeaning}`,
      `${config.API.URL}/${word.audioExample}`,
    ];
    console.log('🚀 ~ word.audioMeaning', `${config.API.URL}/${word.audioMeaning}`);
    const playSound1 = new Audio(sounds[0]);
    await playSound1.play();
    const playSound1Duration = playSound1.duration * 1000 + 300;
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

  cardWrapper.addChildren([cardImage.element, cardInfo.element, soundElement.element]);
  return cardWrapper.element;
}

export default createWordCard;
