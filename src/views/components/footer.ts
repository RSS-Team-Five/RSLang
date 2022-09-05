import CustomElement from '../../utils/customElement';
import dots from '../../assets/icons/dots.svg';

function footer(): HTMLElement {
  const footerElement = new CustomElement('footer', {
    className: 'footer',
  });

  const footerDots = new CustomElement('img', {
    className: 'footer__dots',
    src: dots,
    alt: 'footer-dots',
  });

  const footerTriangle = new CustomElement('div', {
    className: 'footer__triangle',
  });

  const container = new CustomElement('div', {
    className: 'footer__container container',
  });
  footerElement.addChildren([footerDots.element, container.element]);

  const footerWrapper = new CustomElement('div', {
    className: 'footer__wrapper',
  });
  container.addChildren([footerWrapper.element]);

  const teamMembers = [
    { memberName: 'Игорь', memberGithub: 'Bumble-sakh' },
    { memberName: 'Аня', memberGithub: 'muannna' },
    { memberName: 'Юля', memberGithub: 'YuliyaShu' },
  ];

  const membersContainer = new CustomElement('div', {
    className: 'footer__members',
  });

  const membersLink = teamMembers.map(
    (elem) =>
      new CustomElement('a', {
        className: 'footer__links',
        innerText: elem.memberName.toUpperCase(),
        href: `https://github.com/${elem.memberGithub}`,
      }).element
  );

  membersContainer.addChildren([footerTriangle.element, ...membersLink]);

  const dateOfProject = new CustomElement('p', {
    className: 'footer__date',
    innerHTML: 'август 2022'.toUpperCase(),
  });

  const linkToRS = new CustomElement('a', {
    className: 'footer__links',
    href: 'https://rs.school/js/',
    innerText: 'rs school'.toUpperCase(),
  });

  footerWrapper.addChildren([membersContainer.element, dateOfProject.element, linkToRS.element]);

  return footerElement.element;
}

export default footer;
