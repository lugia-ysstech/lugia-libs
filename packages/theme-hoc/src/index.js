/**
 * 组件样式处理增强
 * @flow
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@lugia/theme-core';
import { getAttributeFromObject } from '@lugia/object-utils';

type ProviderComponent = React.ComponentType<any>;
const ThemeProvider = (
  Target: ProviderComponent,
  widgetName: string,
): Function => {
  class ThemeWrapWidget extends React.Component<any, any> {
    svtarget: Object;

    constructor(props: any) {
      super(props);
      this.state = {
        svThemVersion: 0,
        themeState: {
          clicked: false,
          disabled: false,
          hover: false,
        },
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
    }

    onClick = () => {
      const { themeState } = this.state;
      const { clicked } = themeState;
      if (clicked === true) {
        return;
      }
      this.setState({
        themeState: { ...themeState, clicked: true },
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

    render() {
      const getTheme = () => {
        const { config = {}, svThemeConfigTree = {} } = this.context;
        const { viewClass } = this.props;

        const result = getConfig({}, svThemeConfigTree, config);
        const viewClassResult = result[viewClass];
        const widgetNameResult = result[widgetName];
        const currConfig = { ...widgetNameResult, ...viewClassResult };
        return Object.assign({}, { ...currConfig }, { svThemeConfigTree });
      };

      const getThemeByDisplayName = (displayName: string) => {
        return getAttributeFromObject(
          getAttributeFromObject(getTheme(), 'svThemeConfigTree', {}),
          displayName,
          {},
        );
      };

      const { disabled } = this.props;
      const { themeState, svThemVersion } = this.state;
      const themeProps = {
        themeState: { ...themeState, disabled },
        themeConfig: getTheme(),
      };
      return (
        <span
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        >
          <Target
            {...this.props}
            themeProps={themeProps}
            getTheme={getTheme}
            getWidgetThemeName={() => widgetName}
            getThemeByDisplayName={getThemeByDisplayName}
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
  ThemeWrapWidget.displayName = `lugia_t_hoc_${widgetName}`;
  return ThemeWrapWidget;
};
export default ThemeProvider;
