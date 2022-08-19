function cleanElement(element: HTMLElement) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

export default cleanElement;
