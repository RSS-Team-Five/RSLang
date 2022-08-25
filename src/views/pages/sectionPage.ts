import { oneWordFromAPI } from '../../api/words/wordsApi';
import Section from '../../controllers/Section';
import config from '../../models/Config';
import state from '../../models/State';
import IWord from '../../types/IWord';
import { GroupType, PageType } from '../../types/SectionTypes';
import { UserWordsType } from '../../types/UserWordParameters';
import CustomElement from '../../utils/customElement';
import WordCard from '../components/WordCardClass';

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

  if (page === 0) {
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

  const buttonsNames = ['Учебник', ...config.SECTION_CARD.map((el) => el.sectionName), 'Игра 1', 'Игра 2'];
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
      innerHTML: `${button}`,
    });

    if (
      !state.user?.isAuthorized &&
      (buttonElement.element.innerHTML === `${config.SECTION_CARD[6].sectionName}` ||
        buttonElement.element.innerHTML === 'Игра 1' ||
        buttonElement.element.innerHTML === 'Игра 2')
    ) {
      buttonElement.element.classList.add('inactive');
      buttonElement.element.onclick = (e) => {
        e.preventDefault();
        if (!state.user?.isAuthorized) {
          window.location.href = `#/signUp`;
        } else {
          window.location.href = `#/section/${index}/0`;
        }
      };
    }

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
  await state.user?.getAllUserWords(state.user?.user);
  if (group !== config.BOOK.maxGroup) {
    allWordsOnPage = await section.getWordsOnPage();
  } else if (state.user?.isAuthorized) {
    allUserWordsOnPage = state.user.user.userWords;
    if (allUserWordsOnPage?.length === 0) {
      const infoForUser = new CustomElement('p', {
        className: 'section__cards-info',
        innerHTML: `Добро пожаловать!
        В этом разделе будут находиться твои сложные слова. Чтобы добавить слово в этот раздел, тебе следует нажать на специальный значок на карточке слова из любого раздела. Добавив слова, ты сможешь их усиленно тренировать, чтобы выучить! 
        Давай попробуем сделать это прямо сейчас! Удачи!`,
      });
      cards.addChildren([infoForUser.element]);
    } else if (group === config.BOOK.maxGroup && allUserWordsOnPage) {
      allUserWordsOnPage.forEach(async (word: UserWordsType) => {
        const userWord = (await oneWordFromAPI(word.wordId)) as IWord;
        if ('id' in word) {
          const wordCardElement = new WordCard(userWord).createCard();
          cards.addChildren([wordCardElement]);
        } else {
          throw new Error('Error during getting word');
        }
      });
    }
  }
  allWordsOnPage.forEach(async (word: IWord) => {
    const wordCardElement = new WordCard(word).createCard();
    cards.addChildren([wordCardElement]);
  });

  // pagination
  const pagination = createPagination(group, page);
  if (group === config.BOOK.maxGroup) {
    pagination.element.style.display = 'none';
  }

  mainWrapper.addChildren([navigationBetweenSections.element, cards.element, pagination.element]);

  return mainWrapper.element;
}

export default createSectionPage;
