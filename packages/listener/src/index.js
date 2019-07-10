/**
 *
 * create by ligx
 *
 * @flow
 */
import { fromEvent } from 'rxjs';
import { bufferTime, first, take } from 'rxjs/operators';

const EventEmitter = require('events');

export default class Listener<T> {
  events: Object;

  constructor() {
    this.events = new EventEmitter();
    this.events.setMaxListeners(5000);
  }

  on(eventName: T, cb: Function) {
    this.events.on(eventName, cb);
    const removeListener = () => {
      this.events.removeListener(eventName, cb);
    };
    return {
      removeListener,
    };
  }

  once(eventName: T, cb: Function) {
    this.events.once(eventName, cb);
    const removeListener = () => {
      this.events.removeListener(eventName, cb);
    };
    return {
      removeListener,
    };
  }

  emit(eventName: string, param: Object) {
    this.events.emit(eventName, param);
  }

  async takeEventData(eventName: string, time: number) {
    const take = this.fromEvent(eventName).pipe(
      bufferTime(time),
      first(),
    );
    return take.toPromise();
  }

  fromEvent(eventName: string) {
    return fromEvent(this.events, eventName);
  }

  delegate(eventName: string, listener: Listener<any>) {
    return listener.on(eventName, (param: any) => {
      this.emit(eventName, param);
    });
  }
  async take(eventName: string, count: number) {
    return this.fromEvent(eventName)
      .pipe(take(count))
      .toPromise();
  }
}
