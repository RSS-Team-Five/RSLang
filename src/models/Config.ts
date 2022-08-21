import section0 from '../assets/images/00-section.jpg';
import section1 from '../assets/images/01-section.jpg';
import section2 from '../assets/images/02-section.jpg';
import section3 from '../assets/images/03-section.jpg';
import section4 from '../assets/images/04-section.jpg';
import section5 from '../assets/images/05-section.jpg';
import section6 from '../assets/images/06-difficult.jpg';

const config = {
  API: {
    URL: 'http://host1836051.hostland.pro',
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
    maxPage: 30,
  },

  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },

  SECTION_CARD: [
    {
      imgUrl: section0,
      alt: '00-section',
      sectionName: 'Stage 1 - the easiest',
    },
    {
      imgUrl: section1,
      alt: '01-section',
      sectionName: 'Stage 2 - easy',
    },
    {
      imgUrl: section2,
      alt: '02-section',
      sectionName: 'Stage 3 - intermediate',
    },
    {
      imgUrl: section3,
      alt: '03-section',
      sectionName: 'Stage 4 - upper-intermediate',
    },
    {
      imgUrl: section4,
      alt: '04-section',
      sectionName: 'Stage 5 - difficult',
    },
    {
      imgUrl: section5,
      alt: '05-section',
      sectionName: 'Stage 7 - the most difficult',
    },
    {
      imgUrl: section6,
      alt: '06-difficult',
      sectionName: 'Your challenging words',
    },
  ],
};

export default config;
