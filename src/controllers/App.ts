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

  async start() {
    this.state.events = new Events();

    const userId = localStorage.getItem('userId') ?? null;
    const token = localStorage.getItem('token') ?? null;
    const refreshToken = localStorage.getItem('refreshToken') ?? null;
    this.state.user = new User(userId, token, refreshToken);
    const resultGetToken = await this.state.user.getToken({ userId, refreshToken });
    if ('userId' in resultGetToken) {
      console.log(resultGetToken);

      this.state.user.isAuthorized = true;
    } else {
      console.log(resultGetToken);
    }

    const view = new View();
    view.renderLayout();

    this.state.router = new Router();
    this.state.router.route('/', view.renderMain.bind(view));
    this.state.router.route('/book', view.renderBook.bind(view));
    this.state.router.route('/section/:group/:page', view.renderSection.bind(view));
    this.state.router.route('/games', view.renderGames.bind(view));
    this.state.router.route('/promo', view.renderPromo.bind(view));
    this.state.router.route('/statistics', view.renderStatistics.bind(view));
    this.state.router.route('/404', view.render404.bind(view));
    this.state.router.route('/signUp', view.renderSignUp.bind(view));
    this.state.router.route('/signIn', view.renderSignIn.bind(view));

    this.state.router.view('/');

    window.addEventListener('load', () => this.state.router?.resolve());
    window.addEventListener('hashchange', () => this.state.router?.resolve());
    window.addEventListener('beforeunload', () => {
      if (this.state.user && this.state.user.userId && this.state.user.token && this.state.user.refreshToken) {
        localStorage.setItem('userId', this.state.user.userId);
        localStorage.setItem('token', this.state.user.token);
        localStorage.setItem('refreshToken', this.state.user.refreshToken);
      }
    });
  }
}
