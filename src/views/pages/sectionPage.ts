import { oneWordFromAPI } from '../../api/words/wordsApi';
import Section from '../../controllers/Section';
import config from '../../models/Config';
import state from '../../models/State';
import IWord from '../../types/IWord';
import { GroupType, PageType } from '../../types/SectionTypes';
import { UserWordsType } from '../../types/UserWordParameters';
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

  // navigation
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

  // word cards
  const cards = new CustomElement('div', {
    className: 'section__cards',
  });

  const section = new Section(group, page);
  let allWordsOnPage: IWord[] = [];
  let allUserWordsOnPage: UserWordsType[] | null = [];
  if (group !== config.BOOK.maxGroup) {
    allWordsOnPage = await section.getWordsOnPage();
  } else if (state.user?.isAuthorized) {
    await state.user?.getAllUserWords(state.user?.user);
    allUserWordsOnPage = state.user.user.userWords;
  }
  if (!allWordsOnPage.length) {
    const infoForUser = new CustomElement('p', {
      className: 'section__cards-info',
      innerHTML: `Добро пожаловать, ${state.user?.user.name}!
      В этом разделе будут находиться твои сложные слова. Чтобы добавить слово в этот раздел, тебе следует нажать на специальный значок на карточке слова из любого раздела. Добавив слова, ты сможешь их усиленно тренировать, чтобы выучить! 
      Давай попробуем сделать это прямо сейчас! Удачи!`,
    });
    cards.addChildren([infoForUser.element]);
  } else if (group === config.BOOK.maxGroup && allUserWordsOnPage) {
    allUserWordsOnPage.forEach(async (word: UserWordsType) => {
      const userWord: IWord | unknown = await oneWordFromAPI(word.wordId);
      if (userWord) {
        const userWordForRes = userWord as IWord;
        allWordsOnPage.push(userWordForRes);
      } else {
        throw new Error('Error during getting word');
      }
    });
    allWordsOnPage.forEach((word: IWord) => {
      const wordCardElement = createWordCard(word);
      cards.addChildren([wordCardElement]);
    });
  }

  // pagination
  const pagination = createPagination(group, page);
  if (group === config.BOOK.maxGroup) {
    pagination.element.style.display = 'none';
  }

  mainWrapper.addChildren([navigationBetweenSections.element, cards.element, pagination.element]);

  return mainWrapper.element;
}

export default createSectionPage;
