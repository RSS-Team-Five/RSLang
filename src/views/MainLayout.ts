import Props from "../types/HeaderTypes";
import CustomElement from "../utils/customElement";
import { header } from "./components/header";

class MainLayout {
  static userState: Props['userState'];
  constructor(userState = false) {
    MainLayout.userState = userState;
  }

  static renderMainLayout() {
    const { userState } = this;
    const headerElement = new CustomElement('header',
    {
      className: 'header',
    });
    const headerContent = header({ userState });
    headerElement.addChildren([headerContent]);

    const main = new CustomElement('main',
    {
      className: 'main',
    });
    const container = new CustomElement('div',
    {
      className: 'main__container container content',
    });
    main.addChildren([container.element]);
    // const footerElement = footer();
    document.querySelector('body')?.append(headerElement.element, main.element/* , footerElement */);
  }
}


export default MainLayout;
