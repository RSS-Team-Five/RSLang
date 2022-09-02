import state from '../../models/State';
import CustomClickableElement from '../../utils/customClickableElement';
import CustomElement from '../../utils/customElement';
import createBurgerMenu from './burger';

function header(): HTMLElement {
  const container = new CustomElement('div', {
    className: 'header__container container',
  });

  const headerWrapper = new CustomElement('div', {
    className: 'header__wrapper',
  });

  const linkToMainPage = new CustomElement('a', {
    className: 'header__links',
    innerHTML: 'RS Lang 5',
    href: '#/',
  });

  // const userIconLink = new CustomElement('a', {
  //   className: 'header__links',
  //   href: '#/statistics',
  // });

  // const userIcon = !state.user?.isAuthorized
  //   ? new CustomElement('img', {
  //       className: 'header__links-img',
  //       src: '',
  //       alt: 'unauthorized icon',
  //     })
  //   : new CustomElement('img', {
  //       className: 'header__links-img',
  //       src: '',
  //       alt: 'authorized icon',
  //     });

  // userIconLink.addChildren([userIcon.element]);
  headerWrapper.addChildren([linkToMainPage.element]);

  const rightContainer = new CustomElement('div', {
    className: 'header__right-container',
  });

  if (state.user?.isAuthorized) {
    const btnSignOut = new CustomElement('button', { className: 'header__sign-in', innerText: 'Выйти' });
    btnSignOut.element.addEventListener('click', () => {
      if (state.user) {
        localStorage.clear();
        state.user.name = null;
        state.user.email = null;
        state.user.userId = null;
        state.user.token = null;
        state.user.refreshToken = null;
        state.user.isAuthorized = false;
        state.events?.notify('userAuthorized');
      }
    });
    rightContainer.addChildren([btnSignOut.element]);
  } else {
    const btnSignIn = new CustomElement('button', { className: 'header__sign-out', innerText: 'Войти' });
    btnSignIn.element.addEventListener('click', () => state.router?.view('/signIn'));
    rightContainer.addChildren([btnSignIn.element]);
  }

  const burgerIcon = new CustomClickableElement('div', 'click', createBurgerMenu, {
    className: 'header__burger burger',
  });
  rightContainer.addChildren([burgerIcon.element]);
  headerWrapper.addChildren([rightContainer.element]);
  container.addChildren([headerWrapper.element]);
  return container.element;
}

export default header;
