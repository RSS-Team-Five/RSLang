import Section from '../../controllers/Section';
import { GroupType, PageType } from '../../types/SectionTypes';
import CustomElement from '../../utils/customElement';
import createWordCard from '../components/wordCard';

async function createSectionPage(group: GroupType = 0, page: PageType = 0) {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper section',
  });

  const navigationBetweenSections = new CustomElement('div', {
    className: 'section__navigation',
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

  mainWrapper.addChildren([navigationBetweenSections.element, cards.element, navigationBetweenPages.element]);

  return mainWrapper.element;
}

export default createSectionPage;
