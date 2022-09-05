import state from '../../models/State';
import CustomElement from '../../utils/customElement';
import createBurgerMenu from './burger';

function renderButton(rightContainer: CustomElement<'div'>) {
  if (rightContainer.element.childNodes[0]) {
    rightContainer.element.childNodes[0].remove();
  }

  if (state.user?.isAuthorized) {
    const btnSignOut = new CustomElement('button', { className: 'header__sign-in', innerText: 'Выйти'.toUpperCase() });
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
    rightContainer.element.prepend(btnSignOut.element);
  } else {
    const btnSignIn = new CustomElement('button', { className: 'header__sign-out', innerText: 'Войти'.toUpperCase() });
    btnSignIn.element.addEventListener('click', () => state.router?.view('/signIn'));
    rightContainer.element.prepend(btnSignIn.element);
  }
}

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

  headerWrapper.addChildren([linkToMainPage.element]);

  const rightContainer = new CustomElement('div', {
    className: 'header__right-container',
  });

  renderButton(rightContainer);
  state.events?.subscribe('userAuthorized', () => renderButton(rightContainer));

  const burgerIcon = new CustomElement('div', {
    className: 'header__burger burger',
  });

  const callBurger = createBurgerMenu.bind(null, burgerIcon.element);
  burgerIcon.element.addEventListener('click', callBurger);
  rightContainer.addChildren([burgerIcon.element]);
  headerWrapper.addChildren([rightContainer.element]);
  container.addChildren([headerWrapper.element]);
  return container.element;
}

export default header;
