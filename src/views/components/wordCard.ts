import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';

function createWordCard(word: IWord) {
  console.log(word);
  const cardWrapper = new CustomElement('div', {
    className: 'section__cards-card card',
  });

  const cardImage = new CustomElement('img', {
    className: 'card__image',
    src: ` https://raw.githubusercontent.com/rolling-scopes-school/react-rslang-be/main/${word.image}`,
    alt: word.word,
  });

  cardWrapper.addChildren([cardImage.element]);
  return cardWrapper.element;
}

export default createWordCard;
