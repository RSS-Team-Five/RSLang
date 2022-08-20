import config from '../../models/Config';

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;

export const getUserStatistic = async ({ userId, token }: { userId: string | null; token: string | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const statistics = await response.json();

    return statistics;
  } catch (error) {
    return { isSuccess: false };
  }
};

export const upsertUserStatistic = async (
  { userId, token }: { userId: string | null; token: string | null },
  { learnedWords, optional = {} }: { learnedWords: number; optional: {} }
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/statistics`, {
      method: 'PUT',
      body: JSON.stringify({ learnedWords, optional }),
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const statistics = await response.json();

    return statistics;
  } catch (error) {
    return { isSuccess: false };
  }
};
