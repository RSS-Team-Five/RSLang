import { oneWordFromAPI } from "../api/words/wordsApi";
import IWord from "../types/IWord";

class Word {
  id: string;

  constructor(id: string, ) {
    this.id = id;
  }

  async getOneWord(): Promise<IWord> {
    const word = await oneWordFromAPI(this.id) as IWord;
    return word;
  }
}

export default Word;
