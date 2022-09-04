import state from '../../models/State';
import CustomElement from '../../utils/customElement';

let count: number = 1;

function createBurgerMenu(burger: HTMLElement): void {
  if (burger.firstElementChild?.classList.contains('burger__wrapper')) {
    burger.firstElementChild?.remove();
  }

  const burgerWrapper = new CustomElement('div', {
    className: 'burger__wrapper',
  });

  const clickOutsideMenu = (e: MouseEvent) => {
    if (e.target !== burgerWrapper.element && e.target !== burger && burgerWrapper.element.style.display === 'flex') {
      burgerWrapper.element.style.display = 'none';
      count += 1;
    }
  };

  const allLinks = [
    { name: 'book' },
    { name: 'games/sprint' },
    { name: 'games/audio-challenge' },
    { name: 'aboutUs' },
    { name: 'statistics' },
  ];
  const names = [
    { name: 'УЧЕБНИК' },
    { name: 'ИГРА СПРИНТ' },
    { name: 'ИГРА АУДИОВЫЗОВ' },
    { name: 'О НАС' },
    { name: 'СТАТИСТИКА' },
  ];

  allLinks.map((item, i) => {
    const link = `#/${item.name}`;
    const linkElement = new CustomElement('a', {
      className: 'burger__wrapper-link',
      href: link,
      innerHTML: `${names[i].name}   `,
    });
    if (!state.user?.isAuthorized && linkElement.element.innerHTML === 'СТАТИСТИКА   ') {
      linkElement.element.classList.add('inactive');
      linkElement.element.style.cursor = 'pointer';
      linkElement.element.onclick = (e) => {
        e.preventDefault();
        state.router?.view('/signUp');
      };
    }
    linkElement.element.addEventListener('click', () => {
      burgerWrapper.element.remove();
      count += 1;
      document.body.removeEventListener('click', clickOutsideMenu);
      return burgerWrapper;
    });

    burgerWrapper.addChildren([linkElement.element]);
    return burgerWrapper.element;
  });

  if (count % 2) {
    burgerWrapper.element.style.display = 'flex';
    count += 1;
    document.body.addEventListener('click', clickOutsideMenu);
  } else {
    burgerWrapper.element.style.display = 'none';
    count += 1;
    document.body.removeEventListener('click', clickOutsideMenu);
  }

  burger.prepend(burgerWrapper.element);
}

export default createBurgerMenu;
