// import { getAllUserWords } from '../api/users/usersWordsApi';
import { wordsFromAPI } from '../api/words/wordsApi';
// import state from '../models/State';
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

  // async getUserWordsOnPage() {
  //   const words = (await getAllUserWords(state.user?.userId, state.user?.token)) as IWord[];
  //   return words;
  // }
}

export default Section;
