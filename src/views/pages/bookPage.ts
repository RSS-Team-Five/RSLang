import config from '../../models/Config';
import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function createBookPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper book',
  });

  const pageName = new CustomElement('h2', {
    className: 'book__name',
    innerText: 'УЧЕБНИК',
  });

  const sectionsWrapper = new CustomElement('div', {
    className: 'book__sections-wrapper',
  });

  config.SECTION_CARD.forEach((card, index) => {
    const cardWrapper = new CustomElement('div', {
      className: 'section__wrapper section',
    });

    if (!state.user?.isAuthorized && card.sectionName === config.SECTION_CARD[config.BOOK.maxGroup].sectionName) {
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

    cardWrapper.element.addEventListener('click', () => {
      if (index === config.BOOK.maxGroup && !state.user?.isAuthorized) {
        window.location.href = `#/signUp`;
      } else {
        window.location.href = `#/section/${index}/0`;
      }
    });
    if (index === config.BOOK.maxGroup) {
      state.events?.subscribe('userAuthorized', () => {
        cardWrapper.element.classList.toggle('inactive');
      });
    }

    sectionsWrapper.addChildren([cardWrapper.element]);
  });

  mainWrapper.addChildren([pageName.element, sectionsWrapper.element]);

  return mainWrapper.element;
}

export default createBookPage;
