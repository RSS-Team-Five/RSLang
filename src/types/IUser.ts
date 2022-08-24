import { UserSettingsType } from './UserSettingsType';
import { UserStatisticsType } from './UserStatisticsType';
import { UserWordsType } from './UserWordParameters';

export default interface IUser {
  name: UserProperties;
  email: UserProperties;
  userId: UserProperties;
  token: UserProperties;
  refreshToken: UserProperties;
  message: UserProperties;
  userWords: UserWordsType[] | null;
  userStatistic: UserStatisticsType | null;
  userSettings: UserSettingsType | null;
  isAuthorized: boolean;
}

export type UserProperties = string | null;
