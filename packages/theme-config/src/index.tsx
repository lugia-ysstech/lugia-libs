/**
 * 用于进行原始配置的组件
 * create by ligx
 *
 * @flow
 */
import { ThemeConfig } from '@lugia/theme-core/lib/type';
import { getConfig, ThemeContext } from '@lugia/theme-core';

import { ThemeConfigProps } from './type';

import * as React from 'react';

type StateType = {};

export type ContextType = {
  config: ThemeConfig;
  svThemeConfigTree: ThemeConfig;
};

class Theme extends React.Component<Partial<ThemeConfigProps>, StateType> {
  static defaultProps = {
    config: {},
  };
  static contextType = ThemeContext;
  static displayName = 'lugia_theme_wrap';
  svThemeConfigTree: object;
  context: ContextType;

  constructor(props: ThemeConfigProps, context: ContextType) {
    super(props);
    this.updateTreeConfig(props, context);
  }

  componentWillReceiveProps(nextProps: ThemeConfigProps, context: ContextType) {
    const nowContext = this.context;
    if (
      nextProps.config !== this.props.config ||
      nowContext.config !== context.config ||
      nowContext.svThemeConfigTree !== context.svThemeConfigTree
    ) {
      this.updateTreeConfig(nextProps, context);
    }
  }

  updateTreeConfig(props: ThemeConfigProps, context: ContextType) {
    const { config, svThemeConfigTree } = context;
    this.svThemeConfigTree = getConfig(svThemeConfigTree, config, props.config);
  }

  getContextValue(): object {
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
