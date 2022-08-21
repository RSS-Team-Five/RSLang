import User from '../controllers/user';
import IEvents from './Events';

export default interface IState {
  events?: IEvents;
  user?: User;
}
