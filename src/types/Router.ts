export default interface IRoute {
  pattern: RegExp;
  callback: RouterCallback;
}

export type RouterCallback = (...args: string[]) => void;
