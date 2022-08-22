import config from '../../models/Config';

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;
const signinUrl = `${config.API.URL}/${config.API.ENDPOINTS.SIGNIN}`;

export const createUser = async ({
  name,
  email,
  password,
}: {
  name: string | null;
  email: string | null;
  password: string | null;
}) => {
  try {
    const response = await fetch(`${usersUrl}`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false }; // Incorrect e-mail or password
  }
};

export const signIn = async ({ email, password }: { email: string | null; password: string | null }) => {
  try {
    const response = await fetch(`${signinUrl}`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false }; // Incorrect e-mail or password
  }
};

export const getUser = async ({ userId, token }: { userId: string | null; token: string | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    if (response.status === 401) return { isUnsuccess: true };
    if (response.status === 404) return { isNotFound: true };

    const user = await response.json();
    return user;
  } catch (error) {
    return { isError: true };
  }
};

export const updateUser = async ({
  email,
  password,
  userId,
  token,
}: {
  email: string | null;
  password: string | null;
  userId: string | null;
  token: string | null;
}) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    if (response.status === 400) return { isBad: true };
    if (response.status === 401) return { isUnsuccess: true };
    if (response.status === 422) return { isIncorrect: true };

    const user = await response.json();
    return user;
  } catch (error) {
    return { isError: true };
  }
};

export const deleteUser = async ({ userId, token }: { userId: string | null; token: string | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    console.log(response.status);
    if (response.status === 204) return { isDeleted: true };
    if (response.status === 401) return { isUnsuccess: true };
    if (response.status === 404) return { isNotFound: true };

    const user = await response.json();
    return user;
  } catch (error) {
    return { isError: true };
  }
};

export const getRefreshToken = async ({
  userId,
  refreshToken,
}: {
  userId: string | null;
  refreshToken: string | null;
}) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/tokens`, {
      method: 'GET',
      body: JSON.stringify({ refreshToken }),
      headers: {
        ...config.DEFAULT_HEADERS,
      },
    });
    if (response.status === 403) return { isUnsuccess: true };

    const user = await response.json();
    return user;
  } catch (error) {
    return { isError: true };
  }
};
