import CustomElement from '../utils/customElement';
import footer from './components/footer';
import { header } from './components/header';

class MainLayout {
  userState: boolean;
  constructor(userState = false) {
    this.userState = userState;
  }

  renderMainLayout() {
    const headerElement = new CustomElement('header', {
      className: 'header',
    });
    const headerContent = header(this.userState);
    headerElement.addChildren([headerContent]);

    const main = new CustomElement('main', {
      className: 'main',
    });
    const container = new CustomElement('div', {
      className: 'main__container container content',
    });
    main.addChildren([container.element]);
    const footerElement = footer();
    document.querySelector('body')?.append(headerElement.element, main.element, footerElement);
  }
}

export default MainLayout;
