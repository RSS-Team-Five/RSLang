export default class CustomElement<Tag extends keyof HTMLElementTagNameMap> {
  element: HTMLElementTagNameMap[Tag];

  constructor(tagName: Tag, options?: Partial<HTMLElementTagNameMap[Tag]>) {
    this.element = document.createElement(tagName);
    if (options) {
      Object.assign(this.element, options);
    }
  }

  addChildren(children: (Node | string)[]) {
    this.element.append(...children);
  }
}
