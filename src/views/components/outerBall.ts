import CustomElement from '../../utils/customElement';
import arrow from '../../assets/icons/Arrow 1.png';

export default function getOuterBall(index: number, target: HTMLElement | null = null) {
  const outerBall = new CustomElement('div', {
    className: `outer-ball${index}`,
  });
  const animateTarget = target !== null ? target : outerBall.element;

  animateTarget.addEventListener('mouseover', () => {
    if (!animateTarget.classList.contains('inactive')) outerBall.element.classList.add('move');
  });
  animateTarget.addEventListener('mouseout', () => {
    outerBall.element.classList.remove('move');
  });

  const InnerBall = new CustomElement('div', {
    className: `inner-ball${index}_first`,
  });

  const secondInnerBall = new CustomElement('div', {
    className: `inner-ball${index}_second`,
  });

  const innerArrow = new CustomElement('img', {
    className: `inner-arrow${index}`,
    src: arrow,
    alt: 'arrow-icon',
  });

  outerBall.addChildren([InnerBall.element, secondInnerBall.element, innerArrow.element]);
  return outerBall.element;
}
