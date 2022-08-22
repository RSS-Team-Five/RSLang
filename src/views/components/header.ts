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
    innerHTML: 'OUR INCREDIBLE LOGO',
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
  return container.element;
}

export default header;
