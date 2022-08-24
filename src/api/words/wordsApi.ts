import config from '../../models/Config';
import IWord from '../../types/IWord';

async function wordsFromAPI(group = 0, page = 0): Promise<IWord[] | unknown> {
  try {
    const response = await fetch(`${config.API.URL}/${config.API.ENDPOINTS.WORDS}?group=${group}&page=${page}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    return { isError: true };
  }
}

async function oneWordFromAPI(id: string): Promise<IWord | unknown> {
  try {
    const response = await fetch(`${config.API.URL}/${config.API.ENDPOINTS.WORDS}/${id}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    return { isError: true };
  }
}

export { wordsFromAPI, oneWordFromAPI };
