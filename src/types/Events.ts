export default interface IEvents {
  subscribe: (event: ObserverEvent, subscriber: ObserverCallback) => void;
  unsubscribe: (event: ObserverEvent) => void;
  notify: (event: ObserverEvent) => void;
}

export type ObserverEvent = keyof ObserverEvents;
export type ObserverCallback = (...args: string[]) => void;

interface ObserverEvents {
  testEvent: string;
}
