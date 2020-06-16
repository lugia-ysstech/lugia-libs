/**
 * 组件样式处理增强
 * @flow
 */
import {
  AnyFunction,
  OnLugia,
  ThemeComponentConfig,
  ThemeConfig,
  ThemePart,
} from './type';
import { getConfig, selectThemePart, ThemeComponentPrefix } from './utils';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';
import ThemeEventChannelHandle from './ThemeEventChannelHandle';
import { ThemeProps } from './type';

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
type ThemeContext = {
  config: object;
  svThemeConfigTree: object;
};
export type SvTarget = {
  svtarget?: {
    current?: SvTarget;
    setPopupVisible?: AnyFunction;
  };
  current?: SvTarget;
  setPopupVisible?: AnyFunction;
};
export default class ThemeHandle extends ThemeEventChannelHandle {
  context: { [key: string]: any };
  widgetName: string;
  svtarget: SvTarget;
  displayName: string;
  getAttributeFromObject: (
    object: object,
    attribute: string,
    defaultValue?: any,
  ) => any;
  getConfig: (
    svThemeConfigTree: ThemeComponentConfig,
    contextConfig: ThemeComponentConfig,
    propsConfig: ThemeComponentConfig,
  ) => ThemeComponentConfig;
  deepMerge: (...objects: any[]) => any;
  selectThemePart: (
    themePart: ThemePart,
    index: number,
    total: number,
  ) => ThemePart;
  cacheTheme: any;

  constructor(
    props: object,
    context: object,
    widgetName: string,
    themeState: object,
    svtarget: SvTarget,
  ) {
    super(props, widgetName, themeState);
    this.svtarget = svtarget;
    this.context = context;
    this.widgetName = widgetName;
    this.selectThemePart = selectThemePart;
    this.deepMerge = deepMerge;
    this.getConfig = getConfig;
    this.getAttributeFromObject = getAttributeFromObject;
    this.displayName = packDisplayName(widgetName);
  }

  setContext(context: object) {
    this.context = context;
  }

  getTheme = (): ThemeConfig => {
    if (!this.cacheTheme) {
      this.updateTheme();
      return this.cacheTheme;
    }
    return this.cacheTheme;
  };

  updateTheme() {
    const { config = {}, svThemeConfigTree = {} } = this.context;
    const { viewClass, theme } = this.props;
    const result = this.getConfig(svThemeConfigTree, config, theme);
    const clazzNames = viewClass ? viewClass.split(' ') : [];
    let viewClassResult = {};

    for (const clazzName of clazzNames) {
      const viewConfig = result[clazzName];
      if (viewConfig) {
        viewClassResult = deepMerge(viewClassResult, viewConfig);
      }
    }
    const widgetNameResult = result[this.widgetName];
    const currConfig = deepMerge(widgetNameResult, viewClassResult);
    this.cacheTheme = Object.assign(
      {},
      { ...currConfig },
      { svThemeConfigTree },
    );
  }

  getThemeByDisplayName = (displayName: string) => {
    return this.getAttributeFromObject(
      this.getAttributeFromObject(this.getTheme(), 'svThemeConfigTree', {}),
      displayName,
      {},
    );
  };

  getThemeProps = () => {
    const themeState = this.getThemeState();
    const { propsConfig = {} } = this.props;
    const result: object = {
      themeState,
      themeConfig: this.getTheme(),
      ...this.getInternalThemeProps(),
      propsConfig: propsConfig ? propsConfig : undefined,
    };

    return result;
  };

  getInternalThemeProps = (): { onLugia: OnLugia } => {
    return {
      onLugia: this.on,
    };
  };

  getThemeTarget = (): SvTarget | undefined => {
    let target = this.svtarget;
    while (target && target.svtarget && target.svtarget.current) {
      target = target.svtarget.current;
    }
    return target.current;
  };

  setPopupVisible(...rest: any[]) {
    const target = this.getThemeTarget();
    if (!target) {
      return;
    }
    if (target.setPopupVisible) {
      target.setPopupVisible(...rest);
    }
  }

  getDisplayName() {
    return this.displayName;
  }

  getPartOfThemeHocProps = (partName: string): object => {
    const viewClass = `${this.displayName}_${partName}`;
    const targetTheme = this.getPartOfThemeConfig(partName);
    const result = this.createThemeHocProps(viewClass, targetTheme);
    result.__partName = partName;
    return result;
  };

  createThemeHocProps = (
    viewClass: string,
    targetTheme: object,
  ): { viewClass?: string; theme?: object; __partName?: string } => {
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

  getPartOfThemeConfig = (
    partName: string,
    sign: boolean = false,
  ): ThemePart => {
    function fillSign(result: any) {
      if (sign) {
        result.__sign = true;
      }
      return result;
    }
    if (!partName) {
      return fillSign(this.packPartName({}, partName, {}, null));
    }
    const theme = this.getTheme() || {};
    const { [partName]: targetTheme } = theme;
    const themePartName = theme.__partName;
    if (!targetTheme) {
      return fillSign(this.packPartName({}, partName, theme, themePartName));
    }
    return fillSign(
      this.packPartName(targetTheme, partName, theme, themePartName),
    );
  };

  packPartName(
    result: { [key: string]: any },
    partName: string,
    fatherTheme: ThemeConfig = {},
    themePartName: string | null | undefined,
  ): ThemePart {
    const partNameResult: string[] = [];
    if (fatherTheme) {
      const father = fatherTheme[partName];
      if (father && father.__partName) {
        partNameResult.push(father.__partName);
      }
    }
    if (themePartName) {
      partNameResult.push(themePartName);
    }
    partNameResult.push(partName);
    result.__partName = partNameResult.join('.');
    return result;
  }

  getPartOfThemeProps = (
    childWidgetName: string,
    opt?: {
      themeConfig?: object;
      props?: object;
      state?: object;
      selector?: { index: number; count: number };
    },
  ): ThemeProps => {
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
