import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function createMainPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper',
  });

  const mainFuncCalls = [{ name: 'book' }, { name: 'games' }, { name: 'aboutUs' }, { name: 'statistics' }];
  const names = [{ name: 'УЧЕБНИК' }, { name: 'ИГРЫ' }, { name: 'О НАС' }, { name: 'СТАТИСТИКА' }];

  mainFuncCalls.map((item, i) => {
    const link = `#/${item.name}`;
    const linkElement = new CustomElement('a', {
      className: 'main__link',
      href: link,
      innerText: `${names[i].name}   `,
    });
    if (!state.user?.isAuthorized && linkElement.element.innerHTML === 'СТАТИСТИКА   ') {
      linkElement.element.classList.add('inactive');
      linkElement.element.style.cursor = 'pointer';
      linkElement.element.onclick = (e) => {
        e.preventDefault();
        window.location.href = `#/signUp`;
      };
    }
    mainWrapper.addChildren([linkElement.element]);
    return mainWrapper.element;
  });

  return mainWrapper.element;
}

export default createMainPage;
