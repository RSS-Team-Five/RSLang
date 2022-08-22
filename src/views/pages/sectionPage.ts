import Section from '../../controllers/Section';
import state from '../../models/State';
import { GroupType, PageType } from '../../types/SectionTypes';
import CustomElement from '../../utils/customElement';
import createWordCard from '../components/wordCard';

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
  const allWordsOnPage = await section.getWordsOnPage();

  allWordsOnPage.forEach((word) => {
    const wordCardElement = createWordCard(word);
    cards.addChildren([wordCardElement]);
  });

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

  if (page === 0) {
    buttonLinkLeft.element.classList.add('inactive');
    buttonElementLeft.element.setAttribute('disabled', '');
  }

  if (page === 29) {
    buttonLinkRight.element.classList.add('inactive');
    buttonElementRight.element.setAttribute('disabled', '');
  }

  navigationBetweenPages.addChildren([buttonLinkLeft.element, currentPage.element, buttonLinkRight.element]);

  mainWrapper.addChildren([navigationBetweenSections.element, cards.element, navigationBetweenPages.element]);

  return mainWrapper.element;
}

export default createSectionPage;
