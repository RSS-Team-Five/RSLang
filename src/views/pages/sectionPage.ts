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
import arrowLeft from '../../assets/icons/Arrow-left.svg';
import arrowRight from '../../assets/icons/Arrow-right.svg';

function createPagination(groupPag: GroupType, pagePag: PageType, isAllWordsLearned: boolean) {
  const navigationBetweenPages = new CustomElement('div', {
    className: 'section__pages',
  });

  const buttonLinkLeft = new CustomElement('a', {
    className: 'section__pages-link',
    href: `#/section/${groupPag}/${pagePag - 1}`,
  });

  const buttonElementLeft = new CustomElement('img', {
    className: 'section__pages-button',
    src: arrowLeft,
    alt: 'arrow',
  });
  buttonLinkLeft.addChildren([buttonElementLeft.element]);

  const text = `Страница ${pagePag + 1}`;
  const currentPage = new CustomElement('div', {
    className: 'section__pages-current',
    innerText: text.toUpperCase(),
  });

  if (isAllWordsLearned) {
    currentPage.element.classList.add('section__pages-current-learned');
  }

  const buttonLinkRight = new CustomElement('a', {
    className: 'section__pages-link',
    href: `#/section/${groupPag}/${pagePag + 1}`,
  });

  const buttonElementRight = new CustomElement('img', {
    className: 'section__pages-button',
    src: arrowRight,
    alt: 'arrow',
  });
  buttonLinkRight.addChildren([buttonElementRight.element]);

  if (pagePag === 0) {
    buttonLinkLeft.element.classList.add('inactive');
    buttonLinkLeft.element.style.pointerEvents = 'none';
  }

  if (pagePag === config.BOOK.maxPage) {
    buttonLinkRight.element.classList.add('inactive');
    buttonLinkRight.element.style.pointerEvents = 'none';
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

  // левый блок
  // navigation
  const leftWrapper = new CustomElement('div', {
    className: 'section__left',
  });
  const navigationBetweenSections = new CustomElement('div', {
    className: 'section__left-navigation',
  });

  const buttonsNames = [
    'Учебник',
    ...config.SECTION_CARD.slice(0, config.SECTION_CARD.length - 1).map((el) => el.sectionName.slice(0, 1)),
    'твои слова',
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
      className: 'section__left-button-link',
      href: `${buttonsLinks[index]}`,
    });

    buttonElement = new CustomElement('button', {
      className: `section__left-button section__left-button-${buttonsLinks[index]}`,
      type: 'button',
      innerHTML: `<nobr>${button.toUpperCase()}</nobr>`,
    });
    allButtons.push(buttonElement.element);
    if (index > 0 && index < 7) {
      buttonElement.element.classList.add('section__left-button-round');
    }

    if (
      !state.user?.isAuthorized &&
      buttonElement.element.classList.contains(`section__left-button-${buttonsLinks[7]}`)
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
    if (button === (group + 1).toString()) {
      buttonElement.element.classList.add('section__left-button-round-active');
    }
    buttonLink.addChildren([buttonElement.element]);
    navigationBetweenSections.addChildren([buttonLink.element]);
  });
  leftWrapper.addChildren([navigationBetweenSections.element]);

  // правый блок
  const rightWrapper = new CustomElement('div', {
    className: 'section__right',
  });

  // section name
  const sectionName = new CustomElement('p', {
    className: 'section__right-name',
    innerHTML: config.SECTION_CARD[group].sectionName.slice(1).toUpperCase(),
  });

  // legend
  const legend = new CustomElement('div', {
    className: 'section__right-legend',
  });

  const dataForLegend = [
    {
      color: `#224347`,
      name: 'изученное слово',
    },
    {
      color: `#d69d66`,
      name: 'твоё сложное слово',
    },
  ];

  for (let i = 0; i < 2; i += 1) {
    const legendUnit = new CustomElement('div', {
      className: 'section__right-legend-unit',
    });
    const ball = new CustomElement('div', {
      className: 'section__right-legend-unit-ball',
    });
    ball.element.style.backgroundColor = dataForLegend[i].color;
    const name = new CustomElement('p', {
      className: 'section__right-legend-unit-name',
      innerHTML: dataForLegend[i].name.toUpperCase(),
    });
    legendUnit.addChildren([ball.element, name.element]);
    legend.addChildren([legendUnit.element]);
  }

  // word cards
  const cards = new CustomElement('div', {
    className: 'section__right-cards',
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
        className: 'section__right-cards-info',
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
    mainWrapper.element.classList.add('section__right-learned');
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
  rightWrapper.addChildren([sectionName.element, legend.element, cards.element, pagination.element]);

  mainWrapper.addChildren([leftWrapper.element, rightWrapper.element]);
  return mainWrapper.element;
}

export default createSectionPage;
