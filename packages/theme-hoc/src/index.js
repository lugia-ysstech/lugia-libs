/**
 * 组件样式处理增强
 * @flow
 */
import type {
  AddMouseEventOption,
  ProviderComponent,
  ThemeHocOption,
} from '@lugia/theme-hoc';

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  getBridge,
  getReactNodeInfo,
  getReactNodeInfoByThemeId,
} from '@lugia/theme-hoc-devtools';
import {
  CSSComponentDisplayName,
  getConfig,
  selectThemePart,
  ThemeComponentPrefix,
} from '@lugia/theme-core';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';

let cnt = 0;

function uuid() {
  return `hoc_${cnt++}`;
}

window.getBridge = getBridge;
window.getReactNodeInfo = getReactNodeInfo;
window.getReactNodeInfoByThemeId = getReactNodeInfoByThemeId;

const OptNames = {
  onMouseDown: 'down',
  onMouseUp: 'up',
  onMouseEnter: 'enter',
  onMouseLeave: 'leave',
};

function isCSSComponent(name: string): boolean {
  return name === CSSComponentDisplayName;
}

const ThemeComponentPrefixLen = ThemeComponentPrefix.length;

function isThemeComponent(name: string): boolean {
  return name.startsWith(ThemeComponentPrefix);
}

export function addMouseEvent(
  self: Object,
  opt?: AddMouseEventOption = { after: {} },
): Object {
  const result = {};

  if (!self) {
    return result;
  }

  const { props } = self;
  if (!props) {
    return result;
  }

  const { after = {} } = opt;

  Object.keys(OptNames).forEach((name: string) => {
    const { [name]: cb } = props;
    const optName = OptNames[name];
    const { [optName]: optCb } = opt;

    if (cb || optCb) {
      const cbs = [];
      if (cb) {
        cbs.push(cb);
      }
      if (optCb) {
        const { [optName]: isAfter } = after;
        if (isAfter) {
          cbs.push(optCb);
        } else {
          cbs.unshift(optCb);
        }
      }
      result[name] = (...rest: any[]) => {
        cbs.forEach(cb => cb(...rest));
      };
    }
  });

  return result;
}

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

const ThemeProvider = (
  Target: ProviderComponent,
  widgetName: string,
  opt?: ThemeHocOption = { hover: false, active: false },
): Function => {
  const { hover = false, active = false } = opt;

  function needProcessThemeState() {
    return hover == true || active == true;
  }

  const displayName = packDisplayName(widgetName);

  class ThemeWrapWidget extends React.Component<any, any> {
    svtarget: Object;

    event: Object;
    eventId: number;
    eventPrefix: number;
    hover: boolean;
    active: boolean;

    constructor(props: any) {
      super(props);
      let initState: Object = {
        svThemVersion: 0,
        id: uuid(),
      };
      if (needProcessThemeState()) {
        initState.themeState = {};
        if (hover) {
          this.hover = false;
        }
        if (active) {
          this.active = false;
        }
      }
      this.event = {};
      this.eventId = 0;
      this.eventPrefix = 0;
      this.state = initState;
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

    componentWillReceiveProps(props: any, context: any) {
      const nowContext = this.context;
      if (
        nowContext.config !== context.config ||
        nowContext.svThemeConfigTree !== context.svThemeConfigTree
      ) {
        const {
          state: { svThemVersion },
        } = this;
        this.setState({
          svThemVersion: svThemVersion + 1,
        });
      }
      if ('themeState' in props) {
        const { themeState = {} } = props;
        this.setState({ themeState });
      }
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

    toggleActiveState = (state: boolean) => {
      const { active } = this;
      if (active === state) {
        return;
      }
      this.active = state;

      this.emit('active', { active: state });
      const { toggleActiveState } = this.props;
      toggleActiveState && toggleActiveState(state);
    };

    onMouseEnter = (...rest: any[]) => {
      this.toggleHoverState(true);
      const { onMouseEnter } = this.props;
      onMouseEnter && onMouseEnter(...rest);
    };

    toggleHoverState = (state: boolean) => {
      const { hover } = this;
      if (hover === state) {
        return;
      }
      this.hover = state;
      this.emit('hover', { hover: state });
      const { toggleHoverState } = this.props;
      toggleHoverState && toggleHoverState(state);
    };

    onMouseLeave = (...rest: any[]) => {
      this.toggleHoverState(false);
      const { onMouseLeave } = this.props;
      onMouseLeave && onMouseLeave(...rest);
    };

    getThemeTarget = () => {
      let target = this.svtarget;
      while (target && target.svtarget) {
        target = target.svtarget;
      }
      return target;
    };

    getPartOfThemeHocProps = (partName: string): Object => {
      const viewClass = `${displayName}_${partName}`;
      const targetTheme = this.getPartOfThemeConfig(partName);
      let result = this.createThemeHocProps(viewClass, targetTheme);
      result.__partName = partName;
      return result;
    };
    createThemeHocProps = (viewClass: string, targetTheme: Object): Object => {
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
      targetTheme.__partName = partName;
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

    on = (name: string, cb) => {
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
      const widgetNameResult = result[widgetName];
      const currConfig = { ...widgetNameResult, ...viewClassResult };
      return Object.assign({}, { ...currConfig }, { svThemeConfigTree });
    };

    getThemeByDisplayName = (displayName: string) => {
      return getAttributeFromObject(
        getAttributeFromObject(this.getTheme(), 'svThemeConfigTree', {}),
        displayName,
        {},
      );
    };

    getThemeMetaInfo = (fields: string[] = ['themeMeta', 'widgetName']) => {
      let id2Path = {};
      let node = getReactNodeInfoByThemeId(this.state.id);
      if (node) {
        id2Path['root'] = '';
        this.getChildren(node, 'root', id2Path);
        const filterOnlyThemeOrCSS = id => {
          let reactNodeInfo = getReactNodeInfo(id);
          if (reactNodeInfo) {
            let name = reactNodeInfo.name;
            return name && (isThemeComponent(name) || isCSSComponent(name));
          }
          return false;
        };

        let themeOrCSSId2Path = Object.keys(id2Path)
          .filter(filterOnlyThemeOrCSS)
          .reduce((res, id) => {
            res[id] = id2Path[id];
            return res;
          }, {});

        Object.keys(themeOrCSSId2Path).forEach(id => {
          const path = themeOrCSSId2Path[id];
          themeOrCSSId2Path[id] = path.split('/').filter(filterOnlyThemeOrCSS);
        });

        let paths: any = Object.values(themeOrCSSId2Path).sort(
          (a: Object, b: Object) => {
            return a.length - b.length;
          },
        );
        // for (let i = 0; i < paths.length; i++) {
        //   const path = paths[ i ];
        //   if (path && path.length === 0) {
        //     continue;
        //   }
        //   const result = [ path[ 0 ] ];
        //   for (let j = 1; j < path.length; j++) {
        //     const id = path[ j ];
        //     let reactNodeInfo = getReactNodeInfo(id);
        //     if (reactNodeInfo) {
        //       let name = reactNodeInfo.name;
        //       if (isCSSComponent(name)) {
        //         result.push(id);
        //       }
        //     }
        //   }
        //   paths[i] = result;
        // }

        const id2Node = {};
        const nodes = [];
        paths.forEach((path: any) => {
          let level = path.length - 1;
          const nodeId = path[level];
          if (id2Node[nodeId]) {
            return;
          }
          id2Node[nodeId] = {
            ...this.getNodeInfo(nodeId, fields),
          };
          id2Node[nodeId].path = path;
          let father = nodes;
          if (level > 0) {
            father = id2Node[path[level - 1]].children;
          }
          father.push(id2Node[nodeId]);
        });
        return nodes;
      }
      return {};
    };

    getNodeInfo(id: string, fields: string[]) {
      const reactNodeInfo = getReactNodeInfo(id);
      const { name } = reactNodeInfo;
      const isCSSCmp = isCSSComponent(name);
      const isThemeCmp = isThemeComponent(name);
      const lugiaBridge = getBridge();
      let themeMeta;
      let widgetName;
      let themeProps;
      let props;
      if (lugiaBridge) {
        const { _inspectables } = lugiaBridge;
        const inspectVal = _inspectables.get(id);
        if (inspectVal) {
          props = inspectVal.props;
          if (props) {
            themeMeta = props.__themeMeta;
            widgetName = isCSSCmp ? props.__cssName : unPackDisplayName(name);
            themeProps = props.themeProps;
          }
        } else {
          console.error(`not found ${id} props info`);
        }
        if (isThemeCmp) {
          const { children } = reactNodeInfo;
          if (children && children.length === 1) {
            const inspectVal = _inspectables.get(children[0]);
            const { props = {} } = inspectVal;
            themeProps = props.themeProps;
          }
        }
      }

      const result = {};
      if (~fields.indexOf('id')) {
        result.id = id;
      }

      result.widgetName = widgetName;

      if (isCSSCmp) {
        result.themeMeta = themeMeta;
      }

      if (themeProps) {
        result.themeProps = themeProps;
        const { themeConfig = {} } = themeProps;
        const { __partName, __index, __count } = themeConfig;
        if (__partName) {
          result.partName = __partName;
        }
        if (__index !== undefined) {
          result.index = __index;
        }
        if (__count) {
          result.count = __count;
        }
      }

      if (~fields.indexOf('name')) {
        result.name = name;
      }
      if (~fields.indexOf('props')) {
        result.props = props;
      }
      result.children = [];
      return result;
    }

    getChildren(root: Object, father: string, id2Path) {
      const { children, id: fatherId } = root;
      const result = {};
      result.id = fatherId;
      result.path = `${id2Path[father]}/${fatherId}`;
      id2Path[fatherId] = result.path;
      if (Array.isArray(children)) {
        children.forEach(id => {
          this.getChildren(getReactNodeInfo(id), fatherId, id2Path);
        });
      }
    }

    getThemeState() {
      const { disabled, themeState: pThemeState = {} } = this.props;
      const { themeState } = this.state;
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

    dispatchEvent = (
      eventNames: string[],
      direction: 'f2c' | 'c2f',
    ): Object => {
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

    render() {
      const { svThemVersion } = this.state;

      const themeStateEventConfig = {};
      if (active) {
        themeStateEventConfig.onMouseDown = this.onMouseDown;
        themeStateEventConfig.onMouseUp = this.onMouseUp;
      }
      if (hover) {
        themeStateEventConfig.onMouseEnter = this.onMouseEnter;
        themeStateEventConfig.onMouseLeave = this.onMouseLeave;
      }

      return (
        <Target
          dispatchEvent={this.dispatchEvent}
          createEventChannel={this.createEventChannel}
          {...this.props}
          {...themeStateEventConfig}
          themeProps={this.getThemeProps()}
          getInternalThemeProps={this.getInternalThemeProps}
          getPartOfThemeHocProps={this.getPartOfThemeHocProps}
          getPartOfThemeConfig={this.getPartOfThemeConfig}
          getPartOfThemeProps={this.getPartOfThemeProps}
          createThemeHocProps={this.createThemeHocProps}
          getTheme={this.getTheme}
          getWidgetThemeName={() => widgetName}
          getThemeByDisplayName={this.getThemeByDisplayName}
          svThemVersion={svThemVersion}
          ref={(cmp: Object) => {
            this.svtarget = cmp;
          }}
        />
      );
    }

    mouseupHandler: any;

    componentDidMount() {
      this.mouseupHandler = () => {
        if (this.active) {
          this.toggleActiveState(false);
        }
      };
      document.addEventListener('mouseup', this.mouseupHandler);
    }

    componentWillUnmount() {
      document.removeEventListener('mouseup', this.mouseupHandler);
    }
  }

  ThemeWrapWidget.contextTypes = {
    config: PropTypes.object,
    svThemeConfigTree: PropTypes.object,
  };
  ThemeWrapWidget.displayName = displayName;
  return ThemeWrapWidget;
};
export default ThemeProvider;
