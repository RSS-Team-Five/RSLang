import config from '../../models/Config';

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;

export const getUserSettings = async ({ userId, token }: { userId: string | null; token: string | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    if (response.status === 401) return { isUnsuccess: true };
    if (response.status === 404) return { isNotFound: true };

    const settings = await response.json();
    return settings;
  } catch (error) {
    return { isError: true };
  }
};

export const upsertUserSettings = async (
  { userId, token }: { userId: string | null; token: string | null },
  { wordsPerDay, optional = {} }: { wordsPerDay: number; optional: {} }
) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ wordsPerDay, optional }),
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    if (response.status === 400) return { isBad: true };
    if (response.status === 401) return { isUnsuccess: true };

    const settings = await response.json();
    return settings;
  } catch (error) {
    return { isError: true };
  }
};
