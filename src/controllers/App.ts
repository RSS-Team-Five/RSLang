import IState from '../types/State';
import Events from './Events';
import Router from './Router';

export default class App {
  state: IState;

  constructor(state: IState) {
    this.state = state;
  }

  start() {
    this.state.events = new Events();

    const router = new Router();
    router.route('/', () => console.log('Main'));

    router.view('/');
  }
}
