/**
 *
 * create by ligx
 *
 * @flow
 */
import { fromEvent } from 'rxjs';
import { bufferTime, first, take } from 'rxjs/operators';
import { EventEmitter } from 'events';
type EventListener = (...args: any[]) => void;
export default class Listener<T extends string> {
  events: EventEmitter;
  silenceEvent: { [eventName: string]: boolean };

  constructor() {
    this.silenceEvent = {};
    this.events = new EventEmitter();
    this.events.setMaxListeners(5000);
  }

  private toSilence = (eventName: string): void => {
    this.silenceEvent[eventName] = true;
  };

  silenceBlock = (eventName: string | string[], cb: () => void) => {
    try {
      for (const event of this.toArray(eventName)) {
        this.toSilence(event);
      }
      if (cb) {
        cb();
      }
    } finally {
      for (const event of this.toArray(eventName)) {
        this.outSilence(event);
      }
    }
  };

  private toArray(eventName: string | string[]): string[] {
    if (Array.isArray(eventName)) {
      return eventName;
    }
    return [eventName];
  }

  private outSilence = (eventName: string): void => {
    delete this.silenceEvent[eventName];
  };

  on(eventName: T, cb: EventListener) {
    this.events.on(eventName, cb);
    const removeListener = () => {
      this.events.removeListener(eventName, cb);
    };
    return {
      removeListener,
    };
  }

  once(eventName: T, cb: EventListener) {
    this.events.once(eventName, cb);
    const removeListener = () => {
      this.events.removeListener(eventName, cb);
    };
    return {
      removeListener,
    };
  }

  emit(eventName: T, param: any) {
    if (this.silenceEvent[eventName]) {
      return;
    }
    this.events.emit(eventName, param);
  }

  async takeEventData(eventName: T, time: number) {
    return this.fromEvent(eventName)
      .pipe(
        bufferTime(time),
        first(),
      )
      .toPromise();
  }

  fromEvent(eventName: T) {
    return fromEvent(this.events, eventName);
  }

  delegate(eventName: T, listener: Listener<any>) {
    return listener.on(eventName, (param: any) => {
      this.emit(eventName, param);
    });
  }

  async take(eventName: T, count: number) {
    return this.fromEvent(eventName)
      .pipe(take(count))
      .toPromise();
  }

  async awaitEvent(eventName: T): Promise<any> {
    return new Promise(res => {
      this.once(eventName, (...param: any) => {
        res(...param);
      });
    });
  }
}
