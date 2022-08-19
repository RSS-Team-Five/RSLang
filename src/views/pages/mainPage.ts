import Router from '../../controllers/Router';
import CustomElement from '../../utils/customElement';
import View from '../View';


function createMainPage() {
  const router = new Router();
  const view = new View();
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper',
  });

  const mainFuncCalls = [
    { name: 'book', func: view.renderBook },
    { name: 'games', func: view.renderGames },
    { name: 'promo', func: view.renderPromo },
    { name: 'statistics', func: view.renderStatistics },
  ];

  mainFuncCalls.map((item) => {
    const link = `#/${item.name}`;
    const linkElement = new CustomElement('a', {
      className: 'main__link',
      href: link,
    });
    router.route(link, item.func.bind(view));
    mainWrapper.addChildren([linkElement.element]);
    return mainWrapper.element;
  });

  return mainWrapper.element;
}

export default createMainPage;
