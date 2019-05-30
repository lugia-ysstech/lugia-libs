/**
 * 组件样式处理增强
 * @flow
 */
import type { ProviderComponent, ThemeHocOption } from '@lugia/theme-hoc';

import * as React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@lugia/theme-core';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';

const ThemeProvider = (
  Target: ProviderComponent,
  widgetName: string,
  opt?: ThemeHocOption = { hover: false, actived: false },
): Function => {
  const { hover = false, actived = false } = opt;

  function needProcessThemeState() {
    return hover == true || actived == true;
  }

  const displayName = `lugia_t_hoc_${widgetName}`;

  class ThemeWrapWidget extends React.Component<any, any> {
    svtarget: Object;

    constructor(props: any) {
      super(props);
      let initState: Object = {
        svThemVersion: 0,
      };
      if (needProcessThemeState()) {
        const themeState = {};
        initState.themeState = {};
        if (hover) {
          themeState.hover = false;
        }
        if (actived) {
          themeState.actived = false;
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
      const { themeState } = this.state;
      const { actived } = themeState;
      if (actived === false) {
        return;
      }
      this.setState({
        themeState: { ...themeState, actived: true },
      });
    };

    onMouseUp = () => {
      const { themeState } = this.state;
      const { actived } = themeState;
      if (actived === true) {
        return;
      }
      this.setState({
        themeState: { ...themeState, actived: false },
      });
    };

    onMouseEnter = () => {
      const { themeState } = this.state;
      const { hover } = themeState;
      if (hover === true) {
        return;
      }
      this.setState({
        themeState: { ...themeState, hover: true },
      });
    };

    onMouseLeave = () => {
      const { themeState } = this.state;
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

    mergeChildThemeProps = (childWidgetName: string): Object => {
      const themeMeta = this.getChildThemeMeta(childWidgetName);
      return deepMerge(
        { themeState: this.state.themeState },
        {
          themeConfig: themeMeta,
        },
      );
    };

    mergeThemePropsConfig = (propsConfig: Object): Object => {
      return deepMerge(this.getThemeProps(), {
        propsConfig,
      });
    };

    getChildTheme = (childWidgetName: string): Object => {
      const targetTheme = this.getChildThemeMeta(childWidgetName);
      if (!targetTheme) {
        return {};
      }
      const viewClass = `${displayName}_${childWidgetName}`;
      return {
        viewClass,
        theme: {
          [viewClass]: targetTheme,
        },
      };
    };

    getChildThemeMeta = (childWidgetName: string): Object => {
      if (!childWidgetName) {
        return {};
      }
      const { children = {} } = this.getTheme();
      const { [childWidgetName]: targetTheme } = children;
      if (!targetTheme) {
        return {};
      }
      return targetTheme;
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
    getThemeProps = () => {
      const { disabled } = this.props;
      const { themeState } = this.state;

      return {
        themeState: { ...themeState, disabled },
        themeConfig: this.getTheme(),
      };
    };

    render() {
      const { svThemVersion } = this.state;
      const themeProps = this.getThemeProps();

      const themeStateEventConfig = {};
      if (actived) {
        themeStateEventConfig.onMouseDown = this.onMouseDown;
        themeStateEventConfig.onMouseUp = this.onMouseUp;
      }
      if (hover) {
        themeStateEventConfig.onMouseEnter = this.onMouseEnter;
        themeStateEventConfig.onMouseLeave = this.onMouseLeave;
      }
      return (
        <span {...themeStateEventConfig}>
          <Target
            {...this.props}
            themeProps={themeProps}
            getChildTheme={this.getChildTheme}
            mergeChildThemeProps={this.mergeChildThemeProps}
            mergeThemePropsConfig={this.mergeThemePropsConfig}
            getTheme={this.getTheme}
            getWidgetThemeName={() => widgetName}
            getThemeByDisplayName={this.getThemeByDisplayName}
            svThemVersion={svThemVersion}
            ref={(cmp: Object) => {
              this.svtarget = cmp;
            }}
          />
        </span>
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
