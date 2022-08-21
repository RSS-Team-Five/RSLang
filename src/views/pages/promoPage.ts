import CustomElement from '../../utils/customElement';

function createPromoPage() {
  const hi = new CustomElement('p', {
    innerText: 'Hello! I/m a promo page!',
  });
  return hi.element;
}

export default createPromoPage;
