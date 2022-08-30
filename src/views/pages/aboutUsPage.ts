import CustomElement from '../../utils/customElement';

function createAboutUsPage() {
  const aboutUsWrapper = new CustomElement('div', {
    className: 'aboutUs__wrapper',
  });

  return aboutUsWrapper.element;
}

export default createAboutUsPage;
