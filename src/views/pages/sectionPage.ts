import { getAllUserWords } from '../../api/users/usersWordsApi';
import Section from '../../controllers/Section';
import config from '../../models/Config';
import state from '../../models/State';
import IWord from '../../types/IWord';
import { GroupType, PageType } from '../../types/SectionTypes';
import CustomElement from '../../utils/customElement';
import createWordCard from '../components/wordCard';

function createPagination(group: GroupType, page: PageType) {
  const navigationBetweenPages = new CustomElement('div', {
    className: 'section__pages',
  });

  const buttonLinkLeft = new CustomElement('a', {
    className: 'section__pages-link',
    href: `#/section/${group}/${page - 1}`,
  });

  const buttonElementLeft = new CustomElement('button', {
    className: 'section__pages-button',
    type: 'button',
    innerText: 'Previous page',
  });
  buttonLinkLeft.addChildren([buttonElementLeft.element]);

  const currentPage = new CustomElement('p', {
    className: 'section__pages-current',
    innerText: `Page ${page + 1}`,
  });

  const buttonLinkRight = new CustomElement('a', {
    className: 'section__pages-link',
    href: `#/section/${group}/${page + 1}`,
  });

  const buttonElementRight = new CustomElement('button', {
    className: 'section__pages-button',
    type: 'button',
    innerText: 'Next page',
  });
  buttonLinkRight.addChildren([buttonElementRight.element]);

  if (page === config.BOOK.maxPage) {
    buttonLinkLeft.element.classList.add('inactive');
    buttonElementLeft.element.setAttribute('disabled', '');
  }

  if (page === config.BOOK.maxPage) {
    buttonLinkRight.element.classList.add('inactive');
    buttonElementRight.element.setAttribute('disabled', '');
  }

  navigationBetweenPages.addChildren([buttonLinkLeft.element, currentPage.element, buttonLinkRight.element]);
  return navigationBetweenPages;
}

async function createSectionPage(group: GroupType = 0, page: PageType = 0) {
  state.group = group;
  state.page = page;
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper section',
  });

  const navigationBetweenSections = new CustomElement('div', {
    className: 'section__navigation',
  });

  const buttonsNames = [
    'Textbook',
    'The easiest',
    'Easy',
    'Intermediate',
    'Upper-intermediate',
    'Difficult',
    'The most difficult',
    'Your words',
    'Game 1',
    'Game 2',
  ];
  const buttonsLinks = [
    '#/book',
    '#/section/0/0',
    '#/section/1/0',
    '#/section/2/0',
    '#/section/3/0',
    '#/section/4/0',
    '#/section/5/0',
    '#/section/6/0',
    '#/games',
    '#/games',
  ];

  buttonsNames.forEach((button, index) => {
    const buttonLink = new CustomElement('a', {
      className: 'section__button-link',
      href: `${buttonsLinks[index]}`,
    });

    const buttonElement = new CustomElement('button', {
      className: 'section__button',
      type: 'button',
      innerText: `${button}`,
    });

    buttonLink.addChildren([buttonElement.element]);
    navigationBetweenSections.addChildren([buttonLink.element]);
  });

  const cards = new CustomElement('div', {
    className: 'section__cards',
  });

  const section = new Section(group, page);
  let allWordsOnPage = [];
  if (group !== config.BOOK.maxGroup + 1) {
    allWordsOnPage = await section.getWordsOnPage();
  } else if (state.user?.user.userId && state.user?.user.token) {
    allWordsOnPage = await getAllUserWords({ userId: state.user?.user.userId ?? null, token: state.user?.user.token });
  }
  if (allWordsOnPage instanceof Error) {
    throw new Error('Invalid data from API');
  } else {
    allWordsOnPage.forEach((word: IWord) => {
      const wordCardElement = createWordCard(word);
      cards.addChildren([wordCardElement]);
    });
  }

  const pagination = createPagination(group, page);
  if (group === config.BOOK.maxGroup + 1) {
    pagination.element.style.display = 'none';
  }

  mainWrapper.addChildren([navigationBetweenSections.element, cards.element, pagination.element]);

  return mainWrapper.element;
}

export default createSectionPage;
