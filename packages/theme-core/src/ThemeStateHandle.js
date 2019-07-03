/**
 * 组件样式处理增强
 * @flow
 */

import React from 'react';
import {
  getBridge,
  getReactNodeInfo,
  getReactNodeInfoByThemeId,
} from '@lugia/theme-hoc-devtools';
import { getConfig, selectThemePart, ThemeComponentPrefix } from './utils';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';

window.getBridge = getBridge;
window.getReactNodeInfo = getReactNodeInfo;
window.getReactNodeInfoByThemeId = getReactNodeInfoByThemeId;

const ThemeComponentPrefixLen = ThemeComponentPrefix.length;

export function unPackDisplayName(widgetName: string): string {
  if (!widgetName) {
    return '';
  }
  const prefixIndex = widgetName.indexOf(ThemeComponentPrefix);
  return prefixIndex !== 0
    ? widgetName
    : widgetName.substr(ThemeComponentPrefixLen);
}

export function packDisplayName(widgetName: string): string {
  return `${ThemeComponentPrefix}${widgetName}`;
}

export default class ThemeStateHandle {
  event: Object;
  eventId: number;
  eventPrefix: number;
  hover: boolean;
  active: boolean;
  focus: boolean;
  props: Object;
  themeState: Object;

  constructor(props: Object, widgetName: string, themeState: Object) {
    this.event = {};
    this.eventId = 0;
    this.eventPrefix = 0;
    this.props = props;
    this.themeState = themeState;
  }

  getEventId() {
    return this.eventId++;
  }

  createParseEventName() {
    const eventPrefix = this.eventPrefix++;
    return (name: string): string => {
      return `p${eventPrefix}:${name}`;
    };
  }

  onMouseDown = (...rest: any[]) => {
    this.toggleActiveState(true);
    const { onMouseDown } = this.props;
    onMouseDown && onMouseDown(...rest);
  };

  onMouseUp = (...rest: any[]) => {
    this.toggleActiveState(false);
    const { onMouseUp } = this.props;
    onMouseUp && onMouseUp(...rest);
  };

  onFocus = (...rest: any[]) => {
    this.toggleFocusState(true);
    const { onFocus } = this.props;
    onFocus && onFocus(...rest);
  };

  onBlur = (...rest: any[]) => {
    this.toggleFocusState(false);
    const { onBlur } = this.props;
    onBlur && onBlur(...rest);
  };

  toggleFocusState = (state: boolean) => {
    const { focus } = this;
    if (focus === state || this.props.disabled) {
      return;
    }
    this.focus = state;
    this.emit('focus', { focus: state });
  };

  onMouseEnter = (...rest: any[]) => {
    this.toggleHoverState(true);
    const { onMouseEnter } = this.props;
    onMouseEnter && onMouseEnter(...rest);
  };

  onMouseLeave = (...rest: any[]) => {
    this.toggleHoverState(false);
    const { onMouseLeave } = this.props;
    onMouseLeave && onMouseLeave(...rest);
  };

  toggleActiveState = (state: boolean) => {
    const { active } = this;
    if (active === state || this.props.disabled) {
      return;
    }
    this.active = state;

    this.emit('active', { active: state });
  };

  toggleHoverState = (state: boolean) => {
    const { hover } = this;
    if (hover === state || this.props.disabled) {
      return;
    }
    this.hover = state;
    this.emit('hover', { hover: state });
  };

  on = (name: string, cb: Function) => {
    let { lugiaConsumers } = this.props;
    if (lugiaConsumers && !Array.isArray(lugiaConsumers)) {
      lugiaConsumers = [lugiaConsumers];
    }
    lugiaConsumers &&
      lugiaConsumers.forEach(({ __consumer }) => {
        __consumer && __consumer(name, cb);
      });

    const { fatherOn } = this.props;
    if (fatherOn) {
      const exist = fatherOn(name, cb);
      if (exist) {
        return exist;
      }
    }

    let eventHandler = this.event[name];
    if (!eventHandler) {
      eventHandler = this.event[name] = {};
    }
    let eventId = this.getEventId();
    eventHandler[eventId] = cb;

    return () => {
      delete eventHandler[eventId];
    };
  };

  emit = (name: string, data: any) => {
    const { fatherEmit, lugiaProvider } = this.props;
    fatherEmit && fatherEmit(name, data);
    lugiaProvider && lugiaProvider(name, data);
    const handler = this.event[name];
    if (!handler) {
      return;
    }
    Object.values(handler).forEach((cb: Function) => {
      cb(data);
    });
  };

  getThemeState() {
    const { disabled, themeState: pThemeState = {} } = this.props;
    const { themeState } = this;
    return { ...themeState, ...pThemeState, disabled };
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
            return;
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
