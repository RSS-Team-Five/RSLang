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

  const teamMembers = [
    {memberName: 'Igor',  memberGithub: "Bumble-sakh"},
    {memberName: 'Anna',  memberGithub: "muannna"},
    {memberName: 'Yuliya',  memberGithub: "YuliyaShu"}
  ]

  const membersLink = teamMembers.map(elem => new CustomElement('a',
  {
    className: 'footer__links',
    innerText: elem.memberName,
    href: `https://github.com/${elem.memberGithub}`
  }).element)

  const dateOfProject = new CustomElement('p',
  {
    className: 'footer__links',
    innerHTML: 'august 2022'
  })

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
  footerWrapper.addChildren([...membersLink, dateOfProject.element, linkToRS.element]);

  return footerElement.element;
}

export default footer;
