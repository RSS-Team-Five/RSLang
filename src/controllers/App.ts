import IState from '../types/State';
import { updateHeader } from '../views/components/header';
import MainLayout from '../views/MainLayout';
import View from '../views/View';
import Events from './Events';
import Router from './Router';

export default class App {
  state: IState;

  constructor(state: IState) {
    this.state = state;
  }

  start() {
    this.state.events = new Events();
    this.state.events.subscribe('userAuthorized', updateHeader);

    const router = new Router();
    router.route('/', () => {
      MainLayout.renderMainLayout();
      new View().renderMain();
    });

    router.view('/');
  }
}
