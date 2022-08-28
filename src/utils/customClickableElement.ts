import CustomElement from './customElement';

export default class CustomClickableElement<Tag extends keyof HTMLElementTagNameMap> extends CustomElement<Tag> {
  constructor(
    tagName: Tag,
    event: keyof WindowEventMap,
    func: EventListener,
    options?: Partial<HTMLElementTagNameMap[Tag]>
  ) {
    super(tagName, options);
    this.element.addEventListener(event, func);
  }
}
