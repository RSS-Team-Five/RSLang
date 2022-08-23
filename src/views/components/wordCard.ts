import config from '../../models/Config';
import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';

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

  cardWrapper.addChildren([cardImage.element, cardInfo.element]);
  return cardWrapper.element;
}

export default createWordCard;
