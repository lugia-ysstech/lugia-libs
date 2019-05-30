/**
 * 组件样式处理增强
 * @flow
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@lugia/theme-core';
import { getAttributeFromObject } from '@lugia/object-utils';

type ThemeHocOption = {
  enabledState: {
    hover: boolean,
    actived: boolean,
  },
};
type ProviderComponent = React.ComponentType<any>;
const ThemeProvider = (
  Target: ProviderComponent,
  widgetName: string,
  opt?: ThemeHocOption = { hover: false, actived: false },
): Function => {
  const { hover = false, actived = false } = opt;

  function needProcessThemeState() {
    return hover == true || actived == true;
  }

  class ThemeWrapWidget extends React.Component<any, any> {
    svtarget: Object;

    constructor(props: any) {
      super(props);
      let initState = {
        svThemVersion: 0,
      };
      if (needProcessThemeState()) {
        const themeState = (initState.themeState = {});
        if (hover) {
          themeState.hover = true;
        }
        if (actived) {
          themeState.actived = true;
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
