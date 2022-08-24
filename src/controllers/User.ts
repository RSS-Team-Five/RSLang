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

    if ('id' in resultCreate) {
      this.user = Object.assign(this.user, resultCreate);
      this.userId = resultCreate.id;
      this.name = resultCreate.name;
      this.email = resultCreate.email;
    }
    return resultCreate;
  }

  async signInUser({ email, password }: { email: string; password: string }) {
    const resultSignIn = await signIn({ email, password });
    if ('userId' in resultSignIn) {
      this.user = Object.assign(this.user, resultSignIn);
      this.userId = resultSignIn.userId;
      this.name = resultSignIn.name;
      this.email = resultSignIn.email;
    }
    return resultSignIn;
  }

  async getUser({ userId, token }: { userId: string | null; token: string | null }) {
    let user = await getUser({ userId, token });
    if (user.isUnsuccess) {
      user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) user = await this.getUser({ userId: user.userId, token: user.token });
    }
    if (user.isNotFound) {
      console.log('User in not found');
      return this.user;
    }
    if (user.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async getToken({ userId, refreshToken }: { userId: string | null; refreshToken: string | null }) {
    const user = await getRefreshToken({ userId, refreshToken });
    if (user.isUnsuccess || user.isError) {
      console.log('Access token is missing, expired or invalid'); // should resignin ?
      return user;
    }
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async updateUser({
    email,
    password,
    userId,
    token,
  }: {
    email: string | null;
    password: string | null;
    userId: string | null;
    token: string | null;
  }) {
    let user = await updateUser({ email, password, userId, token });
    if (user.isIncorrect) {
      console.log('Incorrect parameters'); // dialog with message about correct params ?
      return this.user;
    }
    if (user.isUnsuccess) {
      user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        user = await this.updateUser({ email, password, userId, token: user.token });
    }
    if (user.isBad) {
      console.log('Bad request');
      return this.user;
    }
    if (user.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    user.password = password;
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async deleteUser({ userId, token }: { userId: string | null; token: string | null }) {
    let user = await deleteUser({ userId, token });
    if (user.isUnsuccess) {
      user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) user = await this.deleteUser({ userId, token: user.token });
    }
    if (user.isDeleted) {
      console.log('The user has been deleted');
      return this.user;
    }
    if (user.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    if (user.isNotFound) {
      console.log('The user is not found');
      return this.user;
    }
    this.user = Object.assign(this.user, user);
    return this.user;
  }

  async getAllUserWords({ userId, token }: { userId: string | null; token: string | null }) {
    let words = await getAllUserWords({ userId, token });
    if (words.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) words = await this.getAllUserWords({ userId, token: user.token });
    }
    if (words.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    this.user.userWords = words;
    return this.user;
  }

  async createUserWord(
    { userId, token }: { userId: string | null; token: string | null },
    wordId: string,
    { difficulty, optional = {} }: { difficulty: DifficultyType; optional: OptionalType | {} }
  ) {
    let word = await createUserWord({ userId, token }, wordId, { difficulty, optional });
    if (word.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        word = await this.createUserWord({ userId, token: user.token }, wordId, { difficulty, optional });
    }
    if (word.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    if (word.isBad) console.log('Bad request');
    if (this.user.userWords && word !== null && !this.user.userWords.includes(word)) this.user.userWords.push(word);
    return this.user;
  }

  async getUserWord({ userId, token }: { userId: string | null; token: string | null }, wordId: string) {
    let word = await getUserWord({ userId, token }, wordId);
    if (word.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) word = await this.getUserWord({ userId, token: user.token }, wordId);
    }
    if (word.isNotFound) {
      console.log('Word in not found');
      return null;
    }
    if (word.isBad) {
      console.log('Bad request');
      return null;
    }
    if (word.isError) {
      console.log('Something went wrong');
      return null;
    }
    return this.user.userWords?.filter((userWords) => userWords.wordId === word.wordId);
  }

  async updateUserWord(
    { userId, token }: { userId: string | null; token: string | null },
    wordId: string,
    { difficulty, optional = {} }: { difficulty: DifficultyType; optional: OptionalType | {} }
  ) {
    let word = await updateUserWord({ userId, token }, wordId, { difficulty, optional });
    if (word.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        word = await this.updateUserWord({ userId, token: user.token }, wordId, { difficulty, optional });
    }
    if (word.isBad) {
      console.log('Bad request');
      return this.user;
    }
    if (word.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    this.user = await this.getAllUserWords({ userId, token });
    return this.user;
  }

  async deleteUserWord({ userId, token }: { userId: string | null; token: string | null }, wordId: string) {
    let word = await deleteUserWord({ userId, token }, wordId);
    if (word.isDeleted) {
      console.log('The word has been deleted');
    }
    if (word.isNotFound) {
      console.log('The word is not found');
      return this.user;
    }
    if (word.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) word = await this.deleteUserWord({ userId, token: user.token }, wordId);
    }
    if (word.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    this.user = await this.getAllUserWords({ userId, token });
    return this.user;
  }

  async getUserAggregatedWords(
    { userId, token }: { userId: string | null; token: string | null },
    {
      group,
      page,
      wordsPerPage,
      filter,
    }: {
      group?: GroupType;
      page?: PageType;
      wordsPerPage?: number;
      filter?: object;
    }
  ) {
    this.user = await this.getAllUserWords({ userId, token });
    let words = await getUserAggregatedWords({ userId, token }, { group, page, wordsPerPage, filter });
    if (words.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        words = await this.getUserAggregatedWords({ userId, token: user.token }, { group, page, wordsPerPage, filter });
    }
    return words;
  }

  async getUserAggregatedWord({ userId, token }: { userId: string | null; token: string | null }, wordId: string) {
    this.user = await this.getAllUserWords({ userId, token });
    let word = await getUserAggregatedWord({ userId, token }, wordId);
    if (word.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        word = await this.getUserAggregatedWord({ userId, token: user.token }, wordId);
    }
    if (word.isNotFound) {
      console.log('Word in not found');
      return null;
    }
    if (word.isBad) {
      console.log('Bad request');
      return null;
    }
    if (word.isError) {
      console.log('Something went wrong');
      return null;
    }
    return word;
  }

  async getUserStatistic({ userId, token }: { userId: string | null; token: string | null }) {
    let statistic = await getUserStatistic({ userId, token });
    if (statistic.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    if (statistic.isNotFound) {
      console.log('The user statistic is not found');
      return this.user;
    }
    if (statistic.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) statistic = await this.getUserStatistic({ userId, token: user.token });
    }
    this.user.userStatistic = statistic;
    return this.user;
  }

  async upsertUserStatistic(
    { userId, token }: { userId: string | null; token: string | null },
    { learnedWords, optional = {} }: { learnedWords: number; optional: {} }
  ) {
    let statistic = await upsertUserStatistic({ userId, token }, { learnedWords, optional });
    if (statistic.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        statistic = await this.upsertUserStatistic({ userId, token: user.token }, { learnedWords, optional });
    }
    if (statistic.isBad) {
      console.log('Bad request');
      return this.user;
    }
    if (statistic.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    this.user.userStatistic = statistic;
    return this.user;
  }

  async getUserSettings({ userId, token }: { userId: string | null; token: string | null }) {
    let settings = await getUserSettings({ userId, token });
    if (settings.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    if (settings.isNotFound) {
      console.log('The user settings is not found');
      return this.user;
    }
    if (settings.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError) settings = await this.getUserSettings({ userId, token: user.token });
    }
    this.user.userSettings = settings;
    return this.user;
  }

  async upsertUserSettings(
    { userId, token }: { userId: string | null; token: string | null },
    { wordsPerDay, optional = {} }: { wordsPerDay: number; optional: {} }
  ) {
    let settings = await upsertUserSettings({ userId, token }, { wordsPerDay, optional });
    if (settings.isUnsuccess) {
      const user = await this.getToken(this.user);
      if (!user.isUnsuccess && !user.isError)
        settings = await this.upsertUserSettings({ userId, token: user.token }, { wordsPerDay, optional });
    }
    if (settings.isBad) {
      console.log('Bad request');
      return this.user;
    }
    if (settings.isError) {
      console.log('Something went wrong');
      return this.user;
    }
    this.user.userSettings = settings;
    return this.user;
  }
}
