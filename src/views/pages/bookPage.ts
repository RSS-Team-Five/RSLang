import { SectionCard } from '../../types/SectionTypes';
import CustomElement from '../../utils/customElement';

const sectionCards: SectionCard[] = [
  {
    imgUrl: '../../assets/images/00-section.jpg',
    alt: '00-section',
    sectionName: 'Stage 1 - the easiest',
    active: true,
  },
  {
    imgUrl: '../../assets/images/01-section.jpg',
    alt: '01-section',
    sectionName: 'Stage 2 - easy',
    active: true,
  },
  {
    imgUrl: '../../assets/images/02-section.jpg',
    alt: '02-section',
    sectionName: 'Stage 3 - intermediate',
    active: true,
  },
  {
    imgUrl: '../../assets/images/03-section.jpg',
    alt: '03-section',
    sectionName: 'Stage 4 - upper-intermediate',
    active: true,
  },
  {
    imgUrl: '../../assets/images/04-section.jpg',
    alt: '04-section',
    sectionName: 'Stage 5 - difficult',
    active: true,
  },
  {
    imgUrl: '../../assets/images/05-section.jpg',
    alt: '05-section',
    sectionName: 'Stage 7 - the most difficult',
    active: true,
  },
  {
    imgUrl: '../../assets/images/06-difficult.jpg',
    alt: '06-difficult',
    sectionName: 'Your challenging words',
    // !!!!!!!!!!connect with state.user.isAuthorized
    active: false,
  },
];

function createBookPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper book',
  });

  const pageName = new CustomElement('h2', {
    className: 'book__name',
    innerText: 'TEXTBOOK',
  });

  const sectionsWrapper = new CustomElement('div', {
    className: 'book__sections-wrapper',
  });

  sectionCards.forEach((card) => {
    const cardWrapper = new CustomElement('div', {
      className: 'section__wrapper section',
    });

    if (!card.active) {
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

    sectionsWrapper.addChildren([cardWrapper.element]);
  });

  mainWrapper.addChildren([pageName.element, sectionsWrapper.element]);

  return mainWrapper.element;
}

export default createBookPage;
