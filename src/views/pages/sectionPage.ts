import Section from '../../controllers/Section';
import Word from '../../controllers/Word';
import config from '../../models/Config';
import state from '../../models/State';
import IWord from '../../types/IWord';
import { GroupType, PageType } from '../../types/SectionTypes';
import { UserWordsType } from '../../types/UserWordParameters';
import CustomElement from '../../utils/customElement';
import isAllLearned from '../../utils/isAllLearned';
import WordCard from '../components/WordCardClass';

function createPagination(groupPag: GroupType, pagePag: PageType, isAllWordsLearned: boolean) {
  const navigationBetweenPages = new CustomElement('div', {
    className: 'section__pages',
  });

  const buttonLinkLeft = new CustomElement('a', {
    className: 'section__pages-link',
    href: `#/section/${groupPag}/${pagePag - 1}`,
  });

  const buttonElementLeft = new CustomElement('button', {
    className: 'section__pages-button',
    type: 'button',
    innerText: 'Previous page',
  });
  buttonLinkLeft.addChildren([buttonElementLeft.element]);

  const currentPage = new CustomElement('p', {
    className: 'section__pages-current',
    innerText: `Page ${pagePag + 1}`,
  });

  if (isAllWordsLearned) {
    currentPage.element.classList.add('section__pages-current-learned');
  }

  const buttonLinkRight = new CustomElement('a', {
    className: 'section__pages-link',
    href: `#/section/${groupPag}/${pagePag + 1}`,
  });

  const buttonElementRight = new CustomElement('button', {
    className: 'section__pages-button',
    type: 'button',
    innerText: 'Next page',
  });
  buttonLinkRight.addChildren([buttonElementRight.element]);

  if (pagePag === 0) {
    buttonLinkLeft.element.classList.add('inactive');
    buttonElementLeft.element.setAttribute('disabled', '');
  }

  if (pagePag === config.BOOK.maxPage) {
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
    'Учебник',
    ...config.SECTION_CARD.map((el) => el.sectionName),
    `${config.GAMES.MAIN[0].gameName}`,
    `${config.GAMES.MAIN[1].gameName}`,
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
    `#/games/${config.GAMES.MAIN[0].gameUrl}/${group}/${page}`,
    `#/games/${config.GAMES.MAIN[1].gameUrl}/${group}/${page}`,
  ];

  let buttonElement: CustomElement<'button'>;
  const allButtons: HTMLButtonElement[] = [];
  buttonsNames.forEach((button, index) => {
    const buttonLink = new CustomElement('a', {
      className: 'section__button-link',
      href: `${buttonsLinks[index]}`,
    });

    buttonElement = new CustomElement('button', {
      className: `section__button section__button-${buttonsLinks[index]}`,
      type: 'button',
      innerHTML: `${button}`,
    });
    allButtons.push(buttonElement.element);

    if (!state.user?.isAuthorized && buttonElement.element.innerHTML === `${config.SECTION_CARD[6].sectionName}`) {
      buttonElement.element.classList.add('inactive');
      buttonElement.element.onclick = (e) => {
        e.preventDefault();
        if (!state.user?.isAuthorized) {
          state.router?.view('/signUp');
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
  if (group !== config.BOOK.maxGroup) {
    allWordsOnPage = await section.getWordsOnPage();
  } else if (state.user?.isAuthorized) {
    let allUserWordsOnPage: UserWordsType[] | null = [];
    await state.user?.getAllUserWords(state.user?.user);
    if (state.user.user.userWords) {
      allUserWordsOnPage = state.user.user.userWords?.filter((word) => word.difficulty === 'hard');
    }
    if (allUserWordsOnPage?.length === 0) {
      const infoForUser = new CustomElement('p', {
        className: 'section__cards-info',
        innerHTML: `Добро пожаловать!
        В этом разделе будут находиться твои сложные слова. Чтобы добавить слово в этот раздел, тебе следует нажать на специальный значок на карточке слова из любого раздела. Добавив слова, ты сможешь их усиленно тренировать, чтобы выучить! 
        Давай попробуем сделать это прямо сейчас! Удачи!`,
      });
      cards.addChildren([infoForUser.element]);
    } else if (allUserWordsOnPage) {
      allUserWordsOnPage.forEach(async (word: UserWordsType) => {
        const userWord = await new Word(word.wordId).getOneWord();
        if ('id' in word) {
          const wordCardElement = await new WordCard(userWord).createCard();
          cards.addChildren([wordCardElement]);
        } else {
          throw new Error('Error during getting word');
        }
      });
    }
  }

  if (state.user?.isAuthorized) {
    await state.user?.getAllUserWords(state.user?.user);
  }
  allWordsOnPage.forEach(async (word: IWord) => {
    const wordCardElement = await new WordCard(word).createCard();
    cards.addChildren([wordCardElement]);
  });

  let isAllWordsLearned: boolean = false;
  if (state.group !== config.BOOK.maxGroup && isAllLearned(allWordsOnPage).isTrue) {
    isAllWordsLearned = true;
    mainWrapper.element.classList.add('section__learned');
    const gamesButtons = allButtons.slice(-2);
    gamesButtons.forEach((button) => {
      button.classList.add('inactive');
      button.setAttribute('disabled', '');
    });
  }

  // pagination
  const pagination = createPagination(group, page, isAllWordsLearned);
  if (group === config.BOOK.maxGroup) {
    pagination.element.style.display = 'none';
  }

  mainWrapper.addChildren([navigationBetweenSections.element, cards.element, pagination.element]);

  return mainWrapper.element;
}

export default createSectionPage;
