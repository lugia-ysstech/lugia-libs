/**
 * 组件样式处理增强
 * @flow
 */

import ThemeStateHandle from './ThemeStateHandle';

export default class ThemeEventChannelHandle extends ThemeStateHandle {
  eventPrefix: number;
  constructor(props: Object, widgetName: string, themeState: Object) {
    super(props, widgetName, themeState);
    this.eventPrefix = 0;
  }

  dispatchEvent = (eventNames: string[], direction: 'f2c' | 'c2f'): Object => {
    if (!eventNames || !eventNames.length || !direction) {
      return {};
    }
    const hasEvent = this.getExistEvent(eventNames);

    switch (direction) {
      case 'f2c': {
        return {
          fatherOn: (name: string, cb: Function) => {
            const exist = hasEvent[name];
            if (exist) {
              return this.on(name, cb);
            }
          },
        };
      }

      case 'c2f':
        return {
          fatherEmit: (name: string, data: Object) => {
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

  createEventChannel = (eventNames: string[]): Object => {
    if (!eventNames || !eventNames.length) {
      return {};
    }
    const hasEvent = this.getExistEvent(eventNames);
    const parse = this.createParseEventName();
    return {
      provider: {
        lugiaProvider: (name: string, data: Object) => {
          const exist = hasEvent[name];
          if (exist) {
            return this.emit(parse(name), data);
          }
        },
      },
      consumer: {
        __consumer: (name: string, cb: Function) => {
          const exist = hasEvent[name];
          if (exist) {
            return this.on(parse(name), data => {
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

  getExistEvent(eventNames: string[]): Object {
    if (!eventNames || !eventNames.length) {
      return {};
    }
    return eventNames.reduce((exist, name) => {
      exist[name] = true;
      return exist;
    }, {});
  }
}
