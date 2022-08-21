export default interface IUser {
  name: string | null;
  email: string | null;
  password: string | null;
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  message: string | null;
  isAuthorized: boolean;
}
