import CustomElement from './customElement';

export default class CustomClickableElement<Tag extends keyof HTMLElementTagNameMap> extends CustomElement<Tag> {
  element: HTMLElementTagNameMap[Tag];

  constructor(
    tagName: Tag,
    type: keyof WindowEventMap,
    listener: (event?: Event) => void,
    options?: Partial<HTMLElementTagNameMap[Tag]>
  ) {
    super(tagName, options);
    this.element = document.createElement(tagName);
    if (options) {
      Object.assign(this.element, options);
    }
    this.element.addEventListener(type, listener);
  }

  addChildren(children: (Node | string)[]) {
    super.addChildren(children);
  }
}
