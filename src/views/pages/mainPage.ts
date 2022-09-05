import state from '../../models/State';
import CustomElement from '../../utils/customElement';
import photo from '../../assets/images/happy-girl.png';

function createMainPage() {
  const mainPanels = new CustomElement('div', {
    className: 'main__panels panel',
  });
  const introPanel = new CustomElement('div', {
    className: 'panel__intro',
  });
  const cardsPanel = new CustomElement('div', {
    className: 'panel__cards',
  });
  mainPanels.addChildren([introPanel.element, cardsPanel.element]);

  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper main-page',
  });

  const menuWrapper = new CustomElement('div', {
    className: 'main__menu-wrapper',
  });
  const menu = new CustomElement('div', { className: 'main__menu menu' });

  const mainFuncCalls = [{ name: 'book' }, { name: 'games' }, { name: 'aboutUs' }, { name: 'statistics' }];
  const names = [{ name: 'УЧЕБНИК' }, { name: 'ИГРЫ' }, { name: 'О НАС' }, { name: 'СТАТИСТИКА' }];
  mainFuncCalls.forEach((item, i) => {
    const menuBall = new CustomElement('div', { className: 'menu__ball' });
    const linkElement = new CustomElement('a', {
      className: 'menu__link',
      href: `#/${item.name}`,
      innerText: `${names[i].name}   `,
    });
    if (!state.user?.isAuthorized && linkElement.element.innerHTML === 'СТАТИСТИКА   ') {
      linkElement.element.classList.add('inactive');
      linkElement.element.style.cursor = 'pointer';
      linkElement.element.onclick = (e) => {
        e.preventDefault();
        state.router?.view('/signUp');
      };
    }
    menuBall.addChildren([linkElement.element]);
    menu.addChildren([menuBall.element]);
  });

  menuWrapper.element.addEventListener('mouseover', () => {
    menu.element.classList.add(`animate`);
  });

  menuWrapper.element.addEventListener('mouseout', () => {
    menu.element.classList.remove(`animate`);
  });

  const aboutWrapper = new CustomElement('div', {
    className: 'main__about-wrapper',
  });
  const about = new CustomElement('div', {
    className: 'main__about about',
  });

  const aboutHeader = new CustomElement('div', {
    className: 'about__header',
    innerHTML: 'English',
  });

  const aboutPhotoBlock = new CustomElement('div', {
    className: 'about__photo-block',
  });
  const aboutPhoto = new CustomElement('img', {
    className: 'about__photo',
    src: photo,
    alt: 'photo',
  });
  aboutPhotoBlock.addChildren([aboutPhoto.element]);

  const aboutContent = new CustomElement('div', {
    className: 'about__content',
    innerHTML: `<p>Дорогой друг!</p>
    <p>Добро пожаловать в невероятно интересную страну английского языка!</p>
    <p>Здесь ты можешь учиться в Учебнике на разных уровнях сложности, играть в Игры, наблюдать за своим ростом в Статистике и получать удовольствие от жизни.</p>
    <p>Мы, команда молодых разработчиков, будем рады познакомиться с тобой поближе на странице О нас.</p>
    <p>Удачи в учебе!</p>`,
  });

  about.addChildren([aboutHeader.element, aboutPhotoBlock.element, aboutContent.element]);

  aboutWrapper.addChildren([about.element]);
  menuWrapper.addChildren([menu.element]);
  mainWrapper.addChildren([aboutWrapper.element, menuWrapper.element]);

  const fragment = document.createDocumentFragment();
  fragment.append(mainPanels.element, mainWrapper.element);
  return fragment;
}

export default createMainPage;
