import CustomElement from '../../utils/customElement';

function createStatisticPage() {
  const hi = new CustomElement('p', {
    innerText: 'Hello! I/m a statistics page!',
  });
  return hi.element;
}

export default createStatisticPage;
