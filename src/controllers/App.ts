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

    this.state.router = new Router();
    this.state.router.route('/', view.renderMain.bind(view));
    this.state.router.route('/book', view.renderBook.bind(view));
    this.state.router.route('/section/:group/:page', view.renderSection.bind(view));
    this.state.router.route('/games', view.renderGames.bind(view));
    this.state.router.route('/promo', view.renderPromo.bind(view));
    this.state.router.route('/statistics', view.renderStatistics.bind(view));

    this.state.router.view('/');

    window.addEventListener('load', () => this.state.router?.resolve());
    window.addEventListener('hashchange', () => this.state.router?.resolve());
  }
}
