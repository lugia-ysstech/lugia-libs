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

export default class ThemeProviderHandler {
  event: Object;
  eventId: number;
  eventPrefix: number;
  hover: boolean;
  active: boolean;
  props: Object;
  context: Object;
  widgetName: string;
  themeState: Object;
  svtarget: Object;
  displayName: string;
  constructor(
    props: Object,
    context: Object,
    widgetName: string,
    themeState: Object,
    svtarget: Object,
  ) {
    this.event = {};
    this.svtarget = svtarget;
    this.eventId = 0;
    this.eventPrefix = 0;
    this.props = props;
    this.context = context;
    this.widgetName = widgetName;
    this.displayName = packDisplayName(widgetName);
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
    const { toggleActiveState } = this.props;
    toggleActiveState && toggleActiveState(state);
  };

  toggleHoverState = (state: boolean) => {
    const { hover } = this;
    if (hover === state || this.props.disabled) {
      return;
    }
    this.hover = state;
    this.emit('hover', { hover: state });
    const { toggleHoverState } = this.props;
    toggleHoverState && toggleHoverState(state);
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

  getTheme = () => {
    const { config = {}, svThemeConfigTree = {} } = this.context;
    const { viewClass, theme } = this.props;
    const result = getConfig(svThemeConfigTree, config, theme);
    const viewClassResult = result[viewClass];
    const widgetNameResult = result[this.widgetName];
    const currConfig = { ...widgetNameResult, ...viewClassResult };
    return Object.assign({}, { ...currConfig }, { svThemeConfigTree });
  };

  getThemeByDisplayName = (displayName: string) => {
    console.info('this.getTheme()', this.getTheme());
    return getAttributeFromObject(
      getAttributeFromObject(this.getTheme(), 'svThemeConfigTree', {}),
      displayName,
      {},
    );
  };

  getThemeState() {
    const { disabled, themeState: pThemeState = {} } = this.props;
    const { themeState } = this;
    return { ...themeState, ...pThemeState, disabled };
  }

  getThemeProps = () => {
    const themeState = this.getThemeState();
    const result: Object = {
      themeState,
      themeConfig: this.getTheme(),
      ...this.getInternalThemeProps(),
    };
    const { propsConfig } = this.props;
    if (propsConfig) {
      result.propsConfig = propsConfig;
    }
    return result;
  };

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

  getInternalThemeProps = () => {
    return {
      onLugia: this.on,
    };
  };

  getThemeTarget = () => {
    let target = this.svtarget;
    while (target && target.svtarget && target.svtarget.current) {
      target = target.svtarget.current;
    }
    return target.current;
  };

  getDisplayName() {
    return this.displayName;
  }

  getPartOfThemeHocProps = (partName: string): Object => {
    const viewClass = `${this.displayName}_${partName}`;
    const targetTheme = this.getPartOfThemeConfig(partName);
    let result = this.createThemeHocProps(viewClass, targetTheme);
    result.__partName = partName;
    return result;
  };
  createThemeHocProps = (viewClass: string, targetTheme: Object): Object => {
    if (!viewClass) {
      console.error('viewClass can not be empty!');
      return {};
    }
    if (!targetTheme) {
      return {};
    }
    return {
      viewClass,
      theme: {
        [viewClass]: targetTheme,
      },
    };
  };

  getPartOfThemeConfig = (partName: string): Object => {
    if (!partName) {
      return {};
    }
    const theme = this.getTheme() || {};
    const { [partName]: targetTheme } = theme;
    if (!targetTheme) {
      return {};
    }
    if (!targetTheme.__partName) {
      targetTheme.__partName = partName;
    }
    return targetTheme;
  };

  getPartOfThemeProps = (
    childWidgetName: string,
    opt?: {
      themeConfig: ?Object,
      props: ?Object,
      state?: Object,
      selector?: { index: number, count: number },
    },
  ): Object => {
    if (!childWidgetName) {
      return {};
    }
    let themeConfig = this.getPartOfThemeConfig(childWidgetName);
    let themeState = this.getThemeState() || {};
    let propsConfig = {};
    if (opt) {
      const { themeConfig: mergetThemeConfig, props, state } = opt;
      if (mergetThemeConfig) {
        themeConfig = deepMerge(themeConfig, mergetThemeConfig);
      }
      if (props) {
        propsConfig = deepMerge(propsConfig, props);
      }
      const { propsConfig: hocPropsConfig } = this.props;
      if (hocPropsConfig) {
        propsConfig = deepMerge(hocPropsConfig, propsConfig);
      }
      if (state) {
        themeState = deepMerge(themeState, state);
      }
      const { selector } = opt;
      if (selector) {
        const { index, count } = selector;
        themeConfig = selectThemePart(themeConfig, index, count);
      }
    }
    return {
      themeConfig,
      propsConfig,
      themeState,
      ...this.getInternalThemeProps(),
    };
  };
}
