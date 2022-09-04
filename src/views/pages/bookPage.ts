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
      className: `section-book__wrapper section-book section-book__${card.alt}`,
    });

    if (!state.user?.isAuthorized && card.sectionName === config.SECTION_CARD[config.BOOK.maxGroup].sectionName) {
      cardWrapper.element.classList.add('inactive');
    }

    const cardName = new CustomElement('p', {
      className: 'section-book__wrapper-name wrapper-name',
      innerText: card.sectionName.toUpperCase(),
    });
    cardWrapper.addChildren([cardName.element]);

    cardWrapper.element.addEventListener('click', () => {
      if (index === config.BOOK.maxGroup && !state.user?.isAuthorized) {
        state.router?.view('/signUp');
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
