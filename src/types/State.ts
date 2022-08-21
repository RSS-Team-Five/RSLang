import User from '../controllers/User';
import IEvents from './Events';

export default interface IState {
  events?: IEvents;
  user?: User;
}
