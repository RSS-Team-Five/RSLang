import IEvents, { ObserverCallback, ObserverEvent } from '../types/Events';

export default class Events implements IEvents {
  private observers: Record<string, ObserverCallback[]>;

  constructor() {
    this.observers = {};
  }

  subscribe(event: ObserverEvent, subscriber: ObserverCallback) {
    this.observers[event] = this.observers[event] ?? [];
    this.observers[event].push(subscriber);
  }

  unsubscribe(event: ObserverEvent) {
    delete this.observers[event];
  }

  notify(event: ObserverEvent) {
    if (this.observers[event]) {
      this.observers[event].forEach((subscriber) => subscriber());
    }
  }
}
