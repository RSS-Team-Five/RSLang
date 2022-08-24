import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function header(): HTMLElement {
  const container = new CustomElement('div', {
    className: 'header__container container',
  });

  const headerWrapper = new CustomElement('div', {
    className: 'header__wrapper',
  });
  container.addChildren([headerWrapper.element]);

  const linkToMainPage = new CustomElement('a', {
    className: 'header__links',
    innerHTML: 'Тут будет наш логотип',
    href: '#/',
  });

  const userIconLink = new CustomElement('a', {
    className: 'header__links',
    href: '#/statistics',
  });

  const userIcon = !state.user?.isAuthorized
    ? new CustomElement('img', {
        className: 'header__links-img',
        src: '',
        alt: 'unauthorized icon',
      })
    : new CustomElement('img', {
        className: 'header__links-img',
        src: '',
        alt: 'authorized icon',
      });

  userIconLink.addChildren([userIcon.element]);

  const burger = new CustomElement('div', {
    className: 'header__burger',
    innerText: 'future-burger',
  });

  headerWrapper.addChildren([linkToMainPage.element, userIconLink.element, burger.element]);
  if (state.user?.isAuthorized) {
    const btnSignOut = new CustomElement('button', { className: 'header__sign-in', innerText: 'Выйти' });
    btnSignOut.element.addEventListener('click', () => {
      if (state.user) {
        localStorage.clear();
        state.user.name = { name: null };
        state.user.email = { email: null };
        state.user.isAuthorized = false;
        state.events?.notify('userAuthorized');
      }
    });
    headerWrapper.addChildren([btnSignOut.element]);
  } else {
    const btnSignIn = new CustomElement('button', { className: 'header__sign-out', innerText: 'Войти' });
    btnSignIn.element.addEventListener('click', () => state.router?.view('/signIn'));
    headerWrapper.addChildren([btnSignIn.element]);
  }

  return container.element;
}

export default header;
