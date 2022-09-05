import Router from '../controllers/Router';
import User from '../controllers/User';
import IEvents from './Events';
import { GroupType, PageType } from './SectionTypes';

export default interface IState {
  events?: IEvents;
  user?: User;
  group?: GroupType;
  page?: PageType;
  router?: Router;
}
