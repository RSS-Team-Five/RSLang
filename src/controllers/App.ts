import IState from '../types/State';
import { updateHeader } from '../views/components/header';
import MainLayout from '../views/MainLayout';
import View from '../views/View';
import Events from './Events';
import Router from './Router';
import User from './User';

export default class App {
  state: IState;

  constructor(state: IState) {
    this.state = state;
  }

  start() {
    this.state.events = new Events();
    this.state.events.subscribe('userAuthorized', updateHeader);

    // TODO проверять id и token перед созданием юзера
    const userId = null;
    const token = null;
    this.state.user = new User({ userId }, { token });

    const router = new Router();

    MainLayout.renderMainLayout();
    const view = new View();
    router.route('/', view.renderMain.bind(view));
    router.route('/book', view.renderBook.bind(view));
    router.route('/section/:group/:page', view.renderSection.bind(view));
    router.route('/games', view.renderGames.bind(view));
    router.route('/promo', view.renderPromo.bind(view));
    router.route('/statistics', view.renderStatistics.bind(view));

    router.view('/');

    window.addEventListener('load', () => router.resolve());
    window.addEventListener('hashchange', () => router.resolve());
  }
}
