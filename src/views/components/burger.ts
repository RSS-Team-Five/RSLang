import state from '../../models/State';
import CustomClickableElement from '../../utils/customClickableElement';
import CustomElement from '../../utils/customElement';

let count: number = 1;
function createBurgerMenu(): void {
  if (document.body.firstElementChild?.classList.contains('burger__wrapper')) {
    document.body.firstElementChild?.remove();
  }

  const burgerWrapper = new CustomElement('div', {
    className: 'burger__wrapper',
  });

  const blurLayout = new CustomClickableElement(
    'div',
    'click',
    () => {
      burgerWrapper.element.style.display = 'none';
      count += 1;
      blurLayout.element.remove();
    },
    {
      className: 'burger__layout',
    }
  );

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
      className: 'burger__link',
      href: link,
      innerHTML: `${names[i].name}   `,
    });
    if (!state.user?.isAuthorized && linkElement.element.innerHTML === 'СТАТИСТИКА   ') {
      linkElement.element.classList.add('inactive');
      linkElement.element.style.cursor = 'pointer';
      linkElement.element.onclick = (e) => {
        e.preventDefault();
        blurLayout.element.remove();
        window.location.href = `#/signUp`;
      };
    }
    linkElement.element.addEventListener('click', () => {
      burgerWrapper.element.remove();
      count += 1;
      blurLayout.element.remove();
      return burgerWrapper;
    });

    burgerWrapper.addChildren([linkElement.element]);
    return burgerWrapper.element;
  });
  if (count % 2) {
    burgerWrapper.element.style.display = 'flex';
    count += 1;
  } else {
    burgerWrapper.element.style.display = 'none';
    count += 1;
  }

  document.body.append(blurLayout.element);
  document.body.prepend(burgerWrapper.element);
}

export default createBurgerMenu;
