import { wordsFromAPI } from '../api/words/wordsApi';
import IWord from '../types/IWord';
import { GroupType, PageType } from '../types/SectionTypes';

class Section {
  group: GroupType;
  page: PageType;

  constructor(group: GroupType = 0, page: PageType = 0) {
    this.group = group;
    this.page = page;
  }

  async getWordsOnPage(): Promise<IWord[]> {
    const words = (await wordsFromAPI(this.group, this.page)) as IWord[];
    return words;
  }
}

export default Section;
