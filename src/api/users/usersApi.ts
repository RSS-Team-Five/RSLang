import config from '../../models/Config';

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;
const signinUrl = `${config.API.URL}/${config.API.ENDPOINTS.SIGNIN}`;

export const createUser = async <T extends String>({ name, email, password }: { name: T; email: T; password: T }) => {
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

export const signIn = async <T extends String>({ email, password }: { email: T; password: T }) => {
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

export const getUser = async <T extends String>({ userId, token }: { userId: T | null; token: T | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false };
  }
};

export const updateUser = async <T extends String>({
  email,
  password,
  userId,
  token,
}: {
  email: T;
  password: T;
  userId: T | null;
  token: T | null;
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
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false };
  }
};

export const deleteUser = async <T extends String>({ userId, token }: { userId: T | null; token: T | null }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false };
  }
};

export const getRefreshToken = async <T extends String>({
  userId,
  refreshToken,
}: {
  userId: T | null;
  refreshToken: T | null;
}) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}/tokens`, {
      method: 'GET',
      body: JSON.stringify({ refreshToken }),
      headers: {
        ...config.DEFAULT_HEADERS,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false }; // Access token is missing, expired or invalid
  }
};
