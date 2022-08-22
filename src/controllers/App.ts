import IState from '../types/State';
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

    // TODO проверять id и token перед созданием юзера
    const userId = null;
    const token = null;
    this.state.user = new User({ userId }, { token });

    const view = new View();
    view.renderLayout();

    const router = new Router();
    router.route('/', view.renderMain.bind(view));
    router.route('/book', view.renderBook.bind(view));
    router.route('/games', view.renderGames.bind(view));
    router.route('/promo', view.renderPromo.bind(view));
    router.route('/statistics', view.renderStatistics.bind(view));

    router.view('/');

    window.addEventListener('load', () => router.resolve());
    window.addEventListener('hashchange', () => router.resolve());
  }
}
