export default interface IUser {
  name: string,
  email: string,
  password: string,
  userId?: string,
  token?: string,
  refreshToken?: string,
  message?: string,
}
