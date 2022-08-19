import Props from '../../types/HeaderTypes';
import CustomElement from '../../utils/customElement';

function header(props: Props): HTMLElement {
  const { userState } = props;
  const container = new CustomElement('div', {
    className: 'header__container container',
  });

  const headerWrapper = new CustomElement('div', {
    className: 'header__wrapper',
  });
  container.addChildren([headerWrapper.element]);

  const linkToMainPage = new CustomElement('a', {
    className: 'header__links',
    innerHTML: 'OUR INCREDIBLE LOGO',
    href: '#/',
  });

  const userIconLink = new CustomElement('a', {
    className: 'header__links',
    href: '#/statistics',
  });

  let userIcon;
  if (!userState) {
    userIcon = new CustomElement('img', {
      className: 'header__links-img',
      src: '',
      alt: 'unauthorized icon',
    });
  } else {
    userIcon = new CustomElement('img', {
      className: 'header__links-img',
      src: '',
      alt: 'authorized icon',
    });
  }
  userIconLink.addChildren([userIcon.element]);

  const burger = new CustomElement('div', {
    className: 'header__burger',
    innerText: 'future-burger',
  });

  headerWrapper.addChildren([linkToMainPage.element, userIconLink.element, burger.element]);
  return container.element;
}

function updateHeader() {
  // !!!!!!!!!!connect with state.user.isAuthorized
  const userState = true;
  const headerElement = document.querySelector('header');
  if (headerElement) {
    headerElement.innerHTML = '';
  }
  const newContent: HTMLElement = header({ userState });
  headerElement?.append(newContent);
}

export { header, updateHeader };
