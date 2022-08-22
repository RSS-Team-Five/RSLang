import { createUser, getUser, getRefreshToken, signIn, updateUser, deleteUser } from '../api/users/usersApi';
import { getUserStatistic, upsertUserStatistic } from '../api/users/usersStatisticApi';
import IUser from '../types/IUser';
import { GroupType, PageType } from '../types/SectionTypes';
import { DifficultyType, OptionalType } from '../types/UserWordParameters';
import {
  createUserWord,
  deleteUserWord,
  getAllUserWords,
  getUserAggregatedWord,
  getUserAggregatedWords,
  getUserWord,
  updateUserWord,
} from '../api/users/usersWordsApi';
import { getUserSettings, upsertUserSettings } from '../api/users/usersSettingsApi';

export default class User {
  name: Pick<IUser, 'name'>;
  email: Pick<IUser, 'email'>;
  userId: Pick<IUser, 'userId'>;
  token: Pick<IUser, 'token'>;
  isAuthorized: boolean;
  user: IUser;

  constructor(userId: Pick<IUser, 'userId'>, token: Pick<IUser, 'token'>) {
    this.name = { name: null };
    this.email = { email: null };
    this.userId = userId;
    this.token = token;
    this.isAuthorized = false;

    this.user = {
      name: null,
      email: null,
      password: null,
      userId: null,
      token: null,
      refreshToken: null,
      message: null,
      isAuthorized: false,
      userWords: null,
      userStatistic: null,
      userSettings: null,
    };
  }

  async createUser({ name, email, password }: { name: string; email: string; password: string }) {
    const resultCreate = await createUser({ name, email, password });
    const isError: boolean = resultCreate.hasOwnProperty('error');

    if (!isError) {
      this.user = Object.assign(this.user, resultCreate);
      this.userId = resultCreate.id;
      this.name = resultCreate.name;
      this.email = resultCreate.email;
      this.user = resultCreate;

      const resultSignIn = await this.signInUser({ email, password });
      console.log(resultSignIn);

      console.warn('USER', this);

      return true;
    }
    console.warn('ERR', isError, this);
    return resultCreate;
  }

  async signInUser({ email, password }: { email: string; password: string }) {
    const user = await signIn({ email, password });
    this.user = Object.assign(this.user, user);
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

  async getUserAggregatedWords(
    { userId, token }: { userId: string | null; token: string | null },
    group: GroupType | null = null,
    page: PageType | null = null,
    wordsPerPage: number | null = null,
    filter: string | null = null
  ) {
    this.user = await this.getAllUserWords({ userId, token });
    const words = await getUserAggregatedWords({ userId, token }, group, page, wordsPerPage, filter);
    return words;
  }

  async getUserAggregatedWord({ userId, token }: { userId: string | null; token: string | null }, wordId: string) {
    this.user = await this.getAllUserWords({ userId, token });
    const word = await getUserAggregatedWord({ userId, token }, wordId);
    return word;
  }

  async getUserStatistic({ userId, token }: { userId: string | null; token: string | null }) {
    const statistic = await getUserStatistic({ userId, token });
    this.user.userStatistic = statistic;
    return this.user;
  }

  async upsertUserStatistic(
    { userId, token }: { userId: string | null; token: string | null },
    { learnedWords, optional = {} }: { learnedWords: number; optional: {} }
  ) {
    const statistic = await upsertUserStatistic({ userId, token }, { learnedWords, optional });
    this.user.userStatistic = statistic;
    return this.user;
  }

  async getUserSettings({ userId, token }: { userId: string | null; token: string | null }) {
    const settings = await getUserSettings({ userId, token });
    this.user.userSettings = settings;
    return this.user;
  }

  async upsertUserSettings(
    { userId, token }: { userId: string | null; token: string | null },
    { wordsPerDay, optional = {} }: { wordsPerDay: number; optional: {} }
  ) {
    const settings = await upsertUserSettings({ userId, token }, { wordsPerDay, optional });
    this.user.userSettings = settings;
    return this.user;
  }
}
