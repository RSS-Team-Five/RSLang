import CustomElement from '../../utils/customElement';

function createBookPage() {
  const hi = new CustomElement('p', {
    innerText: 'Hello! I/m a book page!',
  });
  return hi.element;
}

export default createBookPage;
