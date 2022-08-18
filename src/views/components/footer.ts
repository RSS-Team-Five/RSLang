import CustomElement from "../../utils/customElement";

function footer(): HTMLElement {
  const footerElement = new CustomElement('footer',
  {
    className: 'footer',
  });

  const container = new CustomElement('div',
  {
    className: 'footer__container container',
  });
  footerElement.addChildren([container.element]);

  const footerWrapper = new CustomElement('div',
  {
    className: 'footer__wrapper'
  });
  container.addChildren([footerWrapper.element]);


  const linkToAnna = new CustomElement('a',
  {
    className: 'footer__links',
    innerText: 'Anna',
    href: 'https://github.com/muannna'
  });

  const linkToIgor = new CustomElement('a',
  {
    className: 'footer__links',
    innerText: 'Igor',
    href: 'https://github.com/Bumble-sakh'
  });

  const linkToYuliya = new CustomElement('a',
  {
    className: 'footer__links',
    innerText: 'Yuliya',
    href: 'https://github.com/YuliyaShu'
  });

  const linkToRS = new CustomElement('a',
  {
    className: 'footer__links',
    href: 'https://rs.school/js/'
  });

  const logoRS = new CustomElement('img',
  {
    src: '../../assets/icons/rs_school_js.svg',
    alt: 'rs-logo'
  });
  linkToRS.addChildren([logoRS.element]);

  footerWrapper.addChildren([linkToAnna.element, linkToIgor.element, linkToYuliya.element, linkToRS.element]);

  return footerElement.element;
}

export default footer;
