import { createUser, getUser, getRefreshToken, signIn, updateUser, deleteUser } from '../api/users/usersApi';
import {
  createUserWord,
  deleteUserWord,
  getAllUserWords,
  getUserWord,
  updateUserWord,
} from '../api/users/usersWordsApi';
import IUser from '../types/IUser';
import { DifficultyType, OptionalType } from '../types/UserWordParameters';

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
      userWords: null,
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

  async getAllUserWords({ userId, token }: { userId: string | null; token: string | null }) {
    const words = await getAllUserWords({ userId, token });
    this.user.userWords = words;
    return this.user;
  }

  async createUserWord(
    { userId, token }: { userId: string | null; token: string | null },
    wordId: string,
    { difficulty, optional = {} }: { difficulty: DifficultyType; optional: OptionalType | {} }
  ) {
    const word = await createUserWord({ userId, token }, wordId, { difficulty, optional });
    if (this.user.userWords && !this.user.userWords.includes(word)) this.user.userWords.push(word);
    return this.user;
  }

  async getUserWord({ userId, token }: { userId: string | null; token: string | null }, wordId: string) {
    const word = await getUserWord({ userId, token }, wordId);
    return this.user.userWords?.filter((userWords) => userWords.wordId === word.wordId);
  }

  async updateUserWord(
    { userId, token }: { userId: string | null; token: string | null },
    wordId: string,
    { difficulty, optional = {} }: { difficulty: DifficultyType; optional: OptionalType | {} }
  ) {
    await updateUserWord({ userId, token }, wordId, { difficulty, optional });
    this.user = await this.getAllUserWords({ userId, token });
    return this.user;
  }

  async deleteUserWord({ userId, token }: { userId: string | null; token: string | null }, wordId: string) {
    await deleteUserWord({ userId, token }, wordId);
    this.user = await this.getAllUserWords({ userId, token });
    return this.user;
  }
}
