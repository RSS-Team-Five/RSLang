import IWord from './IWord';

interface IGameWord extends IWord {
  guess?: boolean | null;
  learned?: boolean | null;
  win?: number | null;
  lose?: number | null;
  new?: boolean | null;
}

export default IGameWord;
