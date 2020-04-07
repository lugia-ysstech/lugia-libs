/**
 * 组件样式处理增强
 * @flow
 */

import ThemeStateHandle from './ThemeStateHandle';
import { ThemeState } from './type';

type DispatchHandle = {
  fatherOn?: (name: string, cb: CallBack) => VoidFunction | undefined;
  fatherEmit?: (name: string, data: object) => void;
};
type EventProvider = { lugiaProvider: (name: string, data: object) => void };
type EventConsumer = { __consumer: (name: string, cb: CallBack) => void };
type ExitEventType = { [eventName: string]: boolean };
type CallBack = (...rest: any[]) => void;
export default class ThemeEventChannelHandle extends ThemeStateHandle {
  eventPrefix: number;

  constructor(props: object, widgetName: string, themeState: ThemeState) {
    super(props, widgetName, themeState);
    this.eventPrefix = 0;
  }

  dispatchEvent = (
    eventNames: string[],
    direction: 'f2c' | 'c2f',
  ): DispatchHandle => {
    if (!eventNames || !eventNames.length || !direction) {
      return {};
    }
    const hasEvent = this.getExistEvent(eventNames);

    switch (direction) {
      case 'f2c': {
        return {
          fatherOn: (name: string, cb: CallBack) => {
            const exist = hasEvent[name];
            if (exist) {
              return this.on(name, cb);
            }
          },
        };
      }

      case 'c2f':
        return {
          fatherEmit: (name: string, data: object) => {
            const exist = hasEvent[name];
            if (exist) {
              return this.emit(name, data);
            }
          },
        };
      default:
    }
    return {};
  };

  createEventChannel = (
    eventNames: string[],
  ): {
    provider?: EventProvider;
    consumer?: EventConsumer;
  } => {
    if (!eventNames || !eventNames.length) {
      return {};
    }
    const hasEvent = this.getExistEvent(eventNames);
    const parse = this.createParseEventName();
    return {
      provider: {
        lugiaProvider: (name: string, data: object) => {
          const exist = hasEvent[name];
          if (exist) {
            return this.emit(parse(name), data);
          }
        },
      },
      consumer: {
        __consumer: (name: string, cb: CallBack) => {
          const exist = hasEvent[name];
          if (exist) {
            return this.on(parse(name), (data: any) => {
              cb(data);
            });
          }
        },
      },
    };
  };

  createParseEventName() {
    const eventPrefix = this.eventPrefix++;
    return (name: string): string => {
      return `p${eventPrefix}:${name}`;
    };
  }

  getExistEvent(eventNames: string[]): ExitEventType {
    if (!eventNames || !eventNames.length) {
      return {};
    }
    return eventNames.reduce((exist: { [key: string]: boolean }, name) => {
      exist[name] = true;
      return exist;
    }, {});
  }
}
