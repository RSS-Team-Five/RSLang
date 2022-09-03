import CustomElement from '../../utils/customElement';
import arrow from '../../assets/icons/Arrow 1.png';

export default function getOuterBall(index: number) {
  const outerBall = new CustomElement('div', {
    className: `outer-ball${index}`,
  });
  outerBall.element.addEventListener('mouseover', () => {
    outerBall.element.classList.add('move');
  });
  outerBall.element.addEventListener('mouseout', () => {
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
