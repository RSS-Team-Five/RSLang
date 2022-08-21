import { UserSettingsType } from './UserSettingsType';
import { UserStatisticsType } from './UserStatisticsType';
import { UserWordsType } from './UserWordParameters';

export default interface IUser {
  name: string | null;
  email: string | null;
  password: string | null;
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  message: string | null;
  userWords: UserWordsType[] | null;
  userStatistic: UserStatisticsType | null;
  userSettings: UserSettingsType | null;
  isAuthorized: boolean;
}
