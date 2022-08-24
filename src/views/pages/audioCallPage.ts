import CustomElement from '../../utils/customElement';

async function createAudioCallPage() {
  const mainWrapper = new CustomElement('div', {
    className: 'main__wrapper section',
  });

  return mainWrapper.element;
}

export default createAudioCallPage;
