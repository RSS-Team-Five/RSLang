import CustomElement from '../../utils/customElement';

function createGamesPage() {
  const wrapper = new CustomElement('div', { className: 'wrapper' });
  const hi = new CustomElement('p', {
    innerText: 'Hello! I/m a games page!',
  });
  const audioChallenge = new CustomElement('a', {
    className: 'link',
    href: '#/games/audio-challenge',
    innerText: 'Аудио вызов',
  });
  wrapper.addChildren([hi.element, audioChallenge.element]);
  return wrapper.element;
}

export default createGamesPage;
