import CustomElement from './customElement';

export default class CustomClickableElement<Tag extends keyof HTMLElementTagNameMap> extends CustomElement<Tag> {
  element: HTMLElementTagNameMap[Tag];
  func: EventListener;

  constructor(
    tagName: Tag,
    event: keyof WindowEventMap,
    func: EventListener,
    options?: Partial<HTMLElementTagNameMap[Tag]>
  ) {
    super(tagName, options);
    this.element = document.createElement(tagName);
    if (options) {
      Object.assign(this.element, options);
    }
    this.func = func;
    this.element.addEventListener(event, func);
  }

  addChildren(children: (Node | string)[]) {
    super.addChildren(children);
  }
}
