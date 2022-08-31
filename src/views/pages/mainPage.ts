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

  const about = new CustomElement('p', {
    className: 'main__about',
    innerHTML: `Дорогой друг! Добро пожаловать в невероятно интересную страну английского языка!
    Здесь ты можешь учиться в УЧЕБНИКЕ на разных уровнях сложности, играть в ИГРАХ, наблюдать за своим ростом в СТАТИСТИКЕ и получать удовольствие от жизни!
    Рады, что ты с нами! А познакомиться с нами поближе можно на странице О НАС.`,
  });

  mainWrapper.addChildren([about.element]);

  return mainWrapper.element;
}

export default createMainPage;
