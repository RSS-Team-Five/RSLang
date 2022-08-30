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
    mainWrapper.addChildren([linkElement.element]);
    return mainWrapper.element;
  });

  return mainWrapper.element;
}

export default createMainPage;
