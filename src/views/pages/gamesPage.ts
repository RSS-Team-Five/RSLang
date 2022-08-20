import CustomElement from '../../utils/customElement';

function createGamesPage() {
  const hi = new CustomElement('p', {
    innerText: 'Hello! I/m a games page!',
  });
  return hi.element;
}

export default createGamesPage;
