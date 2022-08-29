import state from '../models/State';
import IWord from '../types/IWord';

function isAllLearned(allWordsOnPage: IWord[]): { isTrue: boolean; countLearned: number } {
  let count: number = 0;
  if (state.user?.isAuthorized) {
    const userWordsForCheck = state.user?.user.userWords;
    allWordsOnPage.forEach(async (word: IWord) => {
      userWordsForCheck?.forEach((uWord) => {
        if (word.id === uWord.wordId && uWord.optional.learned) {
          count += 1;
        }
      });
    });
  }
  return {
    isTrue: count === allWordsOnPage.length,
    countLearned: count,
  };
}

export default isAllLearned;
