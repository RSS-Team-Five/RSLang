import config from '../../models/Config';
import { DifficultyType, OptionalType } from '../../types/UserWordParameters';

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;
const wordsUrl = `${config.API.ENDPOINTS.WORDS}`;

export const getAllUserWords = async ({ userId, token }: { userId: string | null; token: string | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/${wordsUrl}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const words = await response.json();

    return words;
  } catch (error) {
    return { isSuccess: false };
  }
};

export const createUserWord = async (
  { userId, token }: { userId: string | null; token: string | null },
  wordId: string,
  { difficulty, optional }: { difficulty: DifficultyType; optional: OptionalType }
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/${wordsUrl}/${wordId}`, {
      method: 'POST',
      body: JSON.stringify({ difficulty, optional }),
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const word = await response.json();

    return word;
  } catch (error) {
    return { isSuccess: false };
  }
};
