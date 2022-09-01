import { wordsFromAPI } from '../../api/words/wordsApi';
import config from '../../models/Config';
import state from '../../models/State';
import IGameWord from '../../types/IGameWord';
import IWord from '../../types/IWord';
import shuffle from '../../utils/shuffleArray';

async function getSprintWords(level: number, pageLevel: number | undefined) {
  const pagesSet = new Set<number>();
  let userLearnedWords: IWord[] = [];

  if (state.user?.isAuthorized && pageLevel !== undefined) {
    const words = await state.user.getUserAggregatedWords(state.user.user, {
      filter: { 'userWord.optional.learned': true },
    });
    userLearnedWords = words[0].paginatedResults;
  }

  if (pageLevel === undefined) {
    while (pagesSet.size < 3) {
      const page = Math.floor(Math.random() * (config.BOOK.maxPage + 1));
      pagesSet.add(page);
    }
  } else {
    pagesSet.add(pageLevel);
    let page = pageLevel;
    while (page - 1 > -1 && pagesSet.size < 3) {
      pagesSet.add(page - 1);
      page -= 1;
    }
  }
  const pagesArr = Array.from(pagesSet);

  let wordsArray: IWord[] = [];

  await Promise.all(
    pagesArr.map(async (page) => {
      let wordsFromPage = (await wordsFromAPI(level, page)) as IWord[];
      if (userLearnedWords.length > 0) {
        userLearnedWords.forEach((word) => {
          wordsFromPage = wordsFromPage.filter((e) => e.word !== word.word);
        });
      }
      wordsArray = wordsArray.concat(wordsFromPage);
    })
  );

  wordsArray = shuffle(wordsArray);

  const correctWords = JSON.parse(JSON.stringify(wordsArray.slice(0, wordsArray.length / 2))) as IGameWord[];
  const incorrectWords = JSON.parse(JSON.stringify(wordsArray.slice(wordsArray.length / 2))) as IGameWord[];

  incorrectWords.forEach((word) => {
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    word.wordTranslate = wordsArray[randomIndex].wordTranslate;
  });

  let gameWords = correctWords.concat(incorrectWords);
  gameWords = shuffle(gameWords);
  gameWords.forEach((word) => {
    word.guess = null;
  });

  return { gameWords, wordsArray };
}

export default getSprintWords;
