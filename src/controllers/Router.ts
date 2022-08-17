import IRoute, { RouterCallback } from '../types/Router';

export default class Router {
  routes: IRoute[];

  constructor() {
    this.routes = [];
  }

  route(path: string, view: RouterCallback) {
    if (typeof view === 'function') {
      const route: IRoute = {
        pattern: new RegExp(`^${path.replace(/:\w+/g, '(\\w+)')}$`),
        callback: view,
      };
      this.routes.push(route);
    } else {
      console.error('The view is not a function');
    }
  }

  view(path: string) {
    let route = this.routes.length - 1;

    while (route >= 0) {
      const args = path.match(this.routes[route].pattern);
      if (args) {
        this.routes[route].callback.apply(this, args.slice(1));
      }
      route -= 1;
    }
  }

  resolve() {
    const url = window.location.hash.slice(1);
    this.view(url);
  }
}
