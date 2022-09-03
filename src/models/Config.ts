import section0 from '../assets/images/00-section.jpg';
import section1 from '../assets/images/01-section.jpg';
import section2 from '../assets/images/02-section.jpg';
import section3 from '../assets/images/03-section.jpg';
import section4 from '../assets/images/04-section.jpg';
import section5 from '../assets/images/05-section.jpg';
import section6 from '../assets/images/06-difficult.jpg';
import animal0 from '../assets/images/00-animal.png';
import animal1 from '../assets/images/01-animal.png';
import animal2 from '../assets/images/02-animal.png';
import animal3 from '../assets/images/03-animal.png';
import animal4 from '../assets/images/04-animal.png';
import animal5 from '../assets/images/05-animal.png';
import animal6 from '../assets/images/06-animal.png';
import animal7 from '../assets/images/07-animal.png';
import animal8 from '../assets/images/08-animal.png';
import animal9 from '../assets/images/09-animal.png';
import animal10 from '../assets/images/10-animal.png';
import animal11 from '../assets/images/11-animal.png';
import animal12 from '../assets/images/12-animal.png';
import animal13 from '../assets/images/13-animal.png';
import animal14 from '../assets/images/14-animal.png';

const config = {
  API: {
    URL: 'https://team5.site',
    ENDPOINTS: {
      USERS: 'users',
      SIGNIN: 'signin',
      WORDS: 'words',
    },
    QUERIES: {
      WORDS: {
        GROUP: 'group',
        PAGE: 'page',
      },
    },
  },

  BOOK: {
    maxGroup: 6,
    maxPage: 29,
  },

  WORD: {
    markAsLearned: 'Слово изучено',
    markAsUnlearned: 'Слово не изучено',
  },

  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

  SECTION_CARD: [
    {
      imgUrl: section0,
      alt: '00-section',
      sectionName: 'Очень легко',
    },
    {
      imgUrl: section1,
      alt: '01-section',
      sectionName: 'Легко',
    },
    {
      imgUrl: section2,
      alt: '02-section',
      sectionName: 'Сложнее',
    },
    {
      imgUrl: section3,
      alt: '03-section',
      sectionName: 'Еще сложнее',
    },
    {
      imgUrl: section4,
      alt: '04-section',
      sectionName: 'Сложно',
    },
    {
      imgUrl: section5,
      alt: '05-section',
      sectionName: 'Очень сложно',
    },
    {
      imgUrl: section6,
      alt: '06-difficult',
      sectionName: 'Твои сложные слова',
    },
  ],

  GAMES: {
    MAIN: [
      {
        alt: 'sprint-game',
        gameName: 'Спринт',
        gameUrl: 'sprint',
        description:
          'Это игра на время.\nТвоя задача - выбрать правильный перевод слов.\nЧем больше ты дашь правильных ответов за 60 секунд, тем больше баллов получишь.',
      },
      {
        alt: 'Audio challenge game',
        gameName: 'Аудиовызов',
        gameUrl: 'audio-challenge',
        description:
          'Это игра улучшает восприятие речи на слух.\nТвоя задача - выбрать правильный перевод слов.\nЧем больше ты дашь правильных ответов, тем больше баллов получишь.',
      },
    ],
    SPRINT: [
      {
        imgUrl: animal0,
        alt: '00-animal',
      },
      {
        imgUrl: animal1,
        alt: '01-animal',
      },
      {
        imgUrl: animal2,
        alt: '02-animal',
      },
      {
        imgUrl: animal3,
        alt: '03-animal',
      },
      {
        imgUrl: animal4,
        alt: '04-animal',
      },
      {
        imgUrl: animal5,
        alt: '05-animal',
      },
      {
        imgUrl: animal6,
        alt: '06-animal',
      },
      {
        imgUrl: animal7,
        alt: '07-animal',
      },
      {
        imgUrl: animal8,
        alt: '08-animal',
      },
      {
        imgUrl: animal9,
        alt: '09-animal',
      },
      {
        imgUrl: animal10,
        alt: '10-animal',
      },
      {
        imgUrl: animal11,
        alt: '11-animal',
      },
      {
        imgUrl: animal12,
        alt: '12-animal',
      },
      {
        imgUrl: animal13,
        alt: '13-animal',
      },
      {
        imgUrl: animal14,
        alt: '14-animal',
      },
    ],
  },
};

export default config;
