import config from '../../models/Config';
import { DifficultyType, OptionalType } from '../../types/UserWordParameters';
import { GroupType, PageType } from '../../types/SectionTypes';

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;
const wordsUrl = `${config.API.ENDPOINTS.WORDS}`;
const groupQuire = `${config.API.QUERIES.WORDS.GROUP}`;
const pageQuire = `${config.API.QUERIES.WORDS.PAGE}`;

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
  { difficulty, optional = {} }: { difficulty: DifficultyType; optional: OptionalType | {} }
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

export const getUserWord = async (
  { userId, token }: { userId: string | null; token: string | null },
  wordId: string
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/${wordsUrl}/${wordId}`, {
      method: 'GET',
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

export const updateUserWord = async (
  { userId, token }: { userId: string | null; token: string | null },
  wordId: string,
  { difficulty, optional = {} }: { difficulty: DifficultyType; optional: OptionalType | {} }
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/${wordsUrl}/${wordId}`, {
      method: 'PUT',
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

export const deleteUserWord = async (
  { userId, token }: { userId: string | null; token: string | null },
  wordId: string
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/${wordsUrl}/${wordId}`, {
      method: 'DELETE',
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

export const getUserAggregatedWords = async (
  { userId, token }: { userId: string | null; token: string | null },
  group: GroupType | null = null,
  page: PageType | null = null,
  wordsPerPage: number | null = null,
  filter: string | null = null
) => {
  const groupUrl = group ? `?${groupQuire}=${group}` : '';
  const pageUrl = page ? `&${pageQuire}=${page}` : '';
  const wordsPerPageUrl = wordsPerPage ? `&wordsPerPage=${wordsPerPage}` : '';
  const filterUrl = filter ? `&filter=${filter}` : '';
  try {
    const response = await fetch(
      `${usersUrl}/${userId}/aggregatedWords${groupUrl}${pageUrl}${wordsPerPageUrl}${filterUrl}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.DEFAULT_HEADERS,
        },
      }
    );
    const words = await response.json();

    return words;
  } catch (error) {
    return { isSuccess: false };
  }
};

export const getUserAggregatedWord = async (
  { userId, token }: { userId: string | null; token: string | null },
  wordId: string
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
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
