/**
 * 组件样式处理增强
 * @flow
 */

import { getConfig, selectThemePart, ThemeComponentPrefix } from './utils';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';
import ThemeEventChannelHandle from './ThemeEventChannelHandle';

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

export default class ThemeHandle extends ThemeEventChannelHandle {
  props: Object;
  context: Object;
  widgetName: string;
  svtarget: Object;
  displayName: string;
  getAttributeFromObject: Function;
  getConfig: Function;
  deepMerge: Function;
  selectThemePart: Function;
  constructor(
    props: Object,
    context: Object,
    widgetName: string,
    themeState: Object,
    svtarget: Object,
  ) {
    super(props, widgetName, themeState);
    this.svtarget = svtarget;
    this.props = props;
    this.context = context;
    this.widgetName = widgetName;
    this.selectThemePart = selectThemePart;
    this.deepMerge = deepMerge;
    this.getConfig = getConfig;
    this.getAttributeFromObject = getAttributeFromObject;
    this.displayName = packDisplayName(widgetName);
  }

  getTheme = () => {
    const { config = {}, svThemeConfigTree = {} } = this.context;
    const { viewClass, theme } = this.props;
    const result = this.getConfig(svThemeConfigTree, config, theme);
    const viewClassResult = result[viewClass];
    const widgetNameResult = result[this.widgetName];
    const currConfig = { ...widgetNameResult, ...viewClassResult };
    return Object.assign({}, { ...currConfig }, { svThemeConfigTree });
  };

  getThemeByDisplayName = (displayName: string) => {
    return this.getAttributeFromObject(
      this.getAttributeFromObject(this.getTheme(), 'svThemeConfigTree', {}),
      displayName,
      {},
    );
  };

  getThemeProps = () => {
    const themeState = this.getThemeState();
    const result: Object = {
      themeState,
      themeConfig: this.getTheme(),
      ...this.getInternalThemeProps(),
    };
    const { propsConfig = {} } = this.props;
    if (propsConfig) {
      result.propsConfig = propsConfig;
    }
    return result;
  };

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
      props?: Object,
      state?: Object,
      selector?: { index: number, count: number },
    },
  ): Object => {
    if (!childWidgetName) {
      return {};
    }
    let themeConfig = this.getPartOfThemeConfig(childWidgetName);
    let themeState = this.getThemeState() || {};
    let { propsConfig = {} } = this.props;
    if (opt) {
      const { themeConfig: mergetThemeConfig, props, state } = opt;
      if (mergetThemeConfig) {
        themeConfig = this.deepMerge(themeConfig, mergetThemeConfig);
      }
      if (props) {
        propsConfig = this.deepMerge(props, propsConfig);
      }
      if (state) {
        const { themeState: propsThemeState = {} } = this.props;
        themeState = this.deepMerge(themeState, state, propsThemeState);
      }
      const { selector } = opt;
      if (selector) {
        const { index, count } = selector;
        themeConfig = this.selectThemePart(themeConfig, index, count);
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
