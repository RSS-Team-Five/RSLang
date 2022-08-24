import CustomElement from '../../utils/customElement';

function createMainPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper',
  });

  const mainFuncCalls = [{ name: 'Учебник' }, { name: 'Игры' }, { name: 'О приложении' }, { name: 'Статистика' }];

  mainFuncCalls.map((item) => {
    const link = `#/${item.name}`;
    const linkElement = new CustomElement('a', {
      className: 'main__link',
      href: link,
      innerText: `${item.name}   `,
    });
    mainWrapper.addChildren([linkElement.element]);
    return mainWrapper.element;
  });

  return mainWrapper.element;
}

export default createMainPage;
