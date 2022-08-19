import config from "../../models/Config";

const usersUrl = `${config.API.URL}/${config.API.ENDPOINTS.USERS}`;
const signinUrl = `${config.API.URL}/${config.API.ENDPOINTS.SIGNIN}`;

export const createUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
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
}

export const signIn = async ({ email, password }: { email: string; password: string }) => {
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
}

export const getUser = async ({ userId, token }: { userId: string; token: string }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false };
  }
}

export const updateUser = async ({ email, password, userId, token }: { email: string; password: string, userId: string, token: string }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ email, password }),
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false };
  }
}

export const deleteUser = async ({ userId, token }: { userId: string, token: string }) => {
  try {
    const response = await fetch(`${usersUrl}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.DEFAULT_HEADERS,
      },
    });
    const user = await response.json();

    return user;
  } catch (error) {
    return { isSuccess: false };
  }
}

export const getRefreshToken = async ({ userId, refreshToken }: { userId: string; refreshToken: string }) => {
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
}
