/**
 * 用于进行原始配置的组件
 * create by ligx
 *
 * @flow
 */
import type { ThemeConfigProps } from '@lugia/theme-config';
import { getConfig, ThemeContext } from '@lugia/theme-core';

import * as React from 'react';

type StateType = {};

class Theme extends React.Component<ThemeConfigProps, StateType> {
  static defaultProps = {
    config: {},
  };
  static contextType = ThemeContext;
  static displayName = 'lugia_theme_wrap';
  svThemeConfigTree: Object;

  constructor(props: ThemeConfigProps, context: Object) {
    super(props);
    this.updateTreeConfig(props, context);
  }

  componentWillReceiveProps(nextProps: ThemeConfigProps, context: Object) {
    const nowContext = this.context;
    const { toJSONString } = this;
    const isSame =
      toJSONString(nextProps.config) === toJSONString(this.props.config) &&
      toJSONString(nowContext.config) === toJSONString(context.config) &&
      toJSONString(nowContext.svThemeConfigTree) ===
        toJSONString(context.svThemeConfigTree);
    if (isSame) return;

    if (
      nextProps.config !== this.props.config ||
      nowContext.config !== context.config ||
      nowContext.svThemeConfigTree !== context.svThemeConfigTree
    ) {
      this.updateTreeConfig(nextProps, context);
    }
  }

  toJSONString(target: Object) {
    return JSON.stringify(target);
  }

  updateTreeConfig(props: ThemeConfigProps, context: Object) {
    const { config, svThemeConfigTree } = context;
    this.svThemeConfigTree = getConfig(svThemeConfigTree, config, props.config);
  }

  getContextValue(): Object {
    const { props } = this;
    const { config } = props;
    return {
      config,
      svThemeConfigTree: this.svThemeConfigTree,
    };
  }

  render() {
    const { children } = this.props;
    return (
      <ThemeContext.Provider value={this.getContextValue()}>
        {children}
      </ThemeContext.Provider>
    );
  }
}

export default Theme;
