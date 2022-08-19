import { createUser, getUser, getRefreshToken, signIn, updateUser, deleteUser } from '../api/users/usersApi';
import IUser from '../types/IUser';

export default class User {
  user: IUser;

  constructor({ name, email, password }: { name: string; email: string; password: string }) {
    this.user = {
      name,
      email,
      password,
      userId: null,
      token: null,
      refreshToken: null,
      message: null,
    };
  }

  async createUser({ name, email, password }: { name: string; email: string; password: string }) {
    const user = await createUser({ name, email, password });
    this.user = user;
    return this.user;
  }

  async signInUser({ email, password }: { email: string; password: string }) {
    const user = await signIn({ email, password });
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async getUser({ userId, token }: { userId: string | null; token: string | null }) {
    const user = await getUser({ userId, token });
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async getToken({ userId, refreshToken }: { userId: string | null; refreshToken: string | null }) {
    const user = await getRefreshToken({ userId, refreshToken });
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async updateUser(
    { email, password }: { email: string; password: string },
    userId: string | null,
    token: string | null
  ) {
    const user = await updateUser({ email, password, userId, token });
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async deleteUser({ userId, token }: { userId: string | null; token: string | null }) {
    const user = await deleteUser({ userId, token });
    this.user = Object.assign(this.user, user);
    return this.user;
  }
}
