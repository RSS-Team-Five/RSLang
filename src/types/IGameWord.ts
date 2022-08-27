import IWord from './IWord';

interface IGameWord extends IWord {
  guess?: boolean | null;
}

export default IGameWord;
