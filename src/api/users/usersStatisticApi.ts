import config from '../../models/Config';
import { UserStatisticsType } from '../../types/UserStatisticsType';

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
    if (response.status === 401) return { isUnsuccess: true };
    if (response.status === 404) return { isNotFound: true };

    const statistics = await response.json();
    return statistics;
  } catch (error) {
    return { isError: true };
  }
};

export const upsertUserStatistic = async (
  { userId, token }: { userId: string | null; token: string | null },
  { learnedWords, optional = {} }: UserStatisticsType
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
    if (response.status === 400) return { isBad: true };
    if (response.status === 401) return { isUnsuccess: true };

    const statistics = await response.json();
    return statistics;
  } catch (error) {
    return { isError: true };
  }
};
