/**
 * 组件样式处理增强
 * @flow
 */
import type { ProviderComponent, ThemeHocOption } from '@lugia/theme-hoc';

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  getBridge,
  getReactNodeInfo,
  getThemeReactNodeInfo,
} from '@lugia/theme-hoc-devtools';
import { getConfig, selectThemePart } from '@lugia/theme-core';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';

import styled from 'styled-components';

let cnt = 0;

function uuid() {
  return `hoc_${cnt++}`;
}
window.getBridge = getBridge;
window.getReactNodeInfo = getReactNodeInfo;
window.getThemeReactNodeInfo = getThemeReactNodeInfo;
const ThemeContainer = styled.span`
  display: inline-block;
`;
const ThemeProvider = (
  Target: ProviderComponent,
  widgetName: string,
  opt?: ThemeHocOption = { hover: false, active: false },
): Function => {
  const { hover = false, active = false } = opt;

  function needProcessThemeState() {
    return hover == true || active == true;
  }

  const displayName = `lugia_t_hoc_${widgetName}`;

  class ThemeWrapWidget extends React.Component<any, any> {
    svtarget: Object;

    constructor(props: any) {
      super(props);
      let initState: Object = {
        svThemVersion: 0,
        id: uuid(),
      };
      if (needProcessThemeState()) {
        const themeState = {};
        initState.themeState = {};
        if (hover) {
          themeState.hover = false;
        }
        if (active) {
          themeState.active = false;
        }
      }
      this.state = initState;
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

    onMouseDown = () => {
      const themeState = this.getThemeState();
      const { active } = themeState;
      if (active === true) {
        return;
      }
      this.setState({
        themeState: { ...themeState, active: true },
      });
    };

    onMouseUp = () => {
      const themeState = this.getThemeState();
      const { active } = themeState;
      if (active === false) {
        return;
      }
      this.setState({
        themeState: { ...themeState, active: false },
      });
    };

    onMouseEnter = () => {
      const themeState = this.getThemeState();
      const { hover } = themeState;
      if (hover === true) {
        return;
      }
      this.setState({
        themeState: { ...themeState, hover: true },
      });
    };

    onMouseLeave = () => {
      const themeState = this.getThemeState();
      const { hover } = themeState;
      if (hover === false) {
        return;
      }
      this.setState({
        themeState: { ...themeState, hover: false },
      });
    };

    getThemeTarget = () => {
      let target = this.svtarget;
      while (target && target.svtarget) {
        target = target.svtarget;
      }
      return target;
    };

    getPartOfThemeHocProps = (childWidgetName: string): Object => {
      const viewClass = `${displayName}_${childWidgetName}`;
      const targetTheme = this.getPartOfThemeConfig(childWidgetName);
      return this.createThemeHocProps(viewClass, targetTheme);
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

    getPartOfThemeConfig = (childWidgetName: string): Object => {
      if (!childWidgetName) {
        return {};
      }
      const theme = this.getTheme() || {};
      const { [childWidgetName]: targetTheme } = theme;
      if (!targetTheme) {
        return {};
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
        if (state) {
          themeState = deepMerge(themeState, state);
        }
        const { selector } = opt;
        if (selector) {
          const { index, count } = selector;
          themeConfig = selectThemePart(themeConfig, index, count);
        }
      }
      return { themeConfig, propsConfig, themeState };
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

    getThemeMetaInfo = () => {
      let id2Path = {};
      let node = getThemeReactNodeInfo(this.state.id);
      if (node) {
        id2Path['root'] = '';
        this.getChildren(node, 'root', id2Path);
        let filterOnlyThemeOrCSS = id => {
          let reactNodeInfo = getReactNodeInfo(id);
          if (reactNodeInfo) {
            let name = reactNodeInfo.name;
            return (
              name && (name.startsWith('lugia_t_hoc') || name == 'lugia_c_t')
            );
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
        let paths = Object.values(themeOrCSSId2Path).sort(
          (a: Object, b: Object) => {
            return a.length - b.length;
          },
        );

        const id2Node = {};
        const nodes = [];
        paths.forEach((path: any) => {
          let level = path.length - 1;
          const nodeId = path[level];
          id2Node[nodeId] = {
            ...this.getNodeInfo(nodeId),
            path,
          };
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

    getNodeInfo(id) {
      const reactNodeInfo = getReactNodeInfo(id);
      const { name } = reactNodeInfo;
      const lugiaBridge = getBridge();
      let props;
      if (lugiaBridge) {
        const { _inspectables } = lugiaBridge;
        const inspectVal = _inspectables.get(id);
        if (inspectVal) {
          props = inspectVal.props;
        } else {
          console.error(`not found ${id} props info`);
        }
      }
      return {
        id,
        props,
        name,
        children: [],
      };
    }

    getChildren(root: Object, father: string, id2Path) {
      const { children, id: fatherId } = root;
      const result = {};
      result.id = fatherId;
      result.path = `${id2Path[father]}/${fatherId}`;
      id2Path[fatherId] = result.path;
      children &&
        children.forEach(id => {
          this.getChildren(getReactNodeInfo(id), fatherId, id2Path);
        });
    }

    getThemeState() {
      const { disabled } = this.props;
      const { themeState } = this.state;
      return { ...themeState, disabled };
    }

    getThemeProps = () => {
      const themeState = this.getThemeState();
      return {
        themeState,
        themeConfig: this.getTheme(),
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
        <ThemeContainer {...themeStateEventConfig}>
          <Target
            {...this.props}
            themeProps={this.getThemeProps()}
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
        </ThemeContainer>
      );
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
