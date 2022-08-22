import config from '../../models/Config';
import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function createBookPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper book',
  });

  const pageName = new CustomElement('h2', {
    className: 'book__name',
    innerText: 'TEXTBOOK',
  });

  const sectionsWrapper = new CustomElement('div', {
    className: 'book__sections-wrapper',
  });

  config.SECTION_CARD.forEach((card) => {
    const cardWrapper = new CustomElement('div', {
      className: 'section__wrapper section',
    });

    if (!state.user?.isAuthorized && card.sectionName === 'Your challenging words') {
      cardWrapper.element.classList.add('inactive');
    }
    const cardImg = new CustomElement('img', {
      className: 'section__img',
      src: card.imgUrl,
      alt: card.alt,
    });
    const cardName = new CustomElement('p', {
      className: 'section_name',
      innerText: card.sectionName,
    });
    cardWrapper.addChildren([cardImg.element, cardName.element]);

    sectionsWrapper.addChildren([cardWrapper.element]);
  });

  Array.from(sectionsWrapper.element.children).map((card, index) => {
    card.addEventListener('click', () => {
      if (index === 6 && !state.user?.isAuthorized) {
        // TODO вывести модальное окно авторизации
      }
      window.location.href = `#/section/${index}/0`;
    });
    return card;
  });

  mainWrapper.addChildren([pageName.element, sectionsWrapper.element]);

  return mainWrapper.element;
}

export default createBookPage;
