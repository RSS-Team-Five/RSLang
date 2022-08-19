export default interface IUser {
  name: string,
  email: string,
  password: string,
  userId: string | null,
  token: string | null,
  refreshToken: string | null,
  message: string | null,
}
