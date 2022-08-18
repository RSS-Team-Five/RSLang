import config from "../../models/Config";
import IWord from "../../types/IWord";

async function wordsFromAPI(group = 0, page = 0): Promise<IWord[] | unknown> {
  try {
    const response = await fetch(`${config.API.URL}?_group=${group}&_page=${page}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error: unknown) {
    return error;
  }
}

async function oneWordFromAPI(id: string): Promise<IWord | unknown> {
  try {
    const response = await fetch(`${config.API.URL}/${id}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error: unknown) {
    return error;
  }
}

export { wordsFromAPI, oneWordFromAPI };
