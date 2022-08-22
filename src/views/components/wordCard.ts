import IWord from '../../types/IWord';
import CustomElement from '../../utils/customElement';

function createWordCard(word: IWord) {
  console.log(word);
  const cardWrapper = new CustomElement('div', {
    className: 'section__cards-card card',
  });
  return cardWrapper.element;
}

export default createWordCard;
