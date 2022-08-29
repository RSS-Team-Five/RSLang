import CustomElement from '../../utils/customElement';

function createBurgerMenu(): void {
  const burgerWrapper = new CustomElement('div', {
    className: 'burger__wrapper',
  });
  const allLinks = [
    { name: 'book' },
    { name: 'games/sprint' },
    { name: 'games/audio-challenge' },
    { name: 'promo' },
    { name: 'statistics' },
  ];
  const names = [
    { name: 'УЧЕБНИК' },
    { name: 'ИГРА СПРИНТ' },
    { name: 'ИГРА АУДИОВЫЗОВ' },
    { name: 'О ПРИЛОЖЕНИИ' },
    { name: 'СТАТИСТИКА' },
  ];

  allLinks.map((item, i) => {
    const link = `#/${item.name}`;
    const linkElement = new CustomElement('a', {
      className: 'burger__link',
      href: link,
      innerText: `${names[i].name}   `,
    });
    linkElement.element.addEventListener('click', () => {
      burgerWrapper.element.style.display = 'none';
      return burgerWrapper;
    });
    burgerWrapper.addChildren([linkElement.element]);
    return burgerWrapper.element;
  });

  document.body.prepend(burgerWrapper.element);
}

export default createBurgerMenu;
