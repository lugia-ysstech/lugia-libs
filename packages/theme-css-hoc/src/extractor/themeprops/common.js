/**
 *
 * create by ligx
 *
 * @flow
 */

import type {
  CSSConfig,
  CSSProps,
  StateType,
  ThemeState,
} from '@lugia/theme-css-hoc';
import type { ThemeMeta } from '@lugia/theme-core';
import { filterSelector } from '@lugia/theme-core';

import { Active, Disabled, Focus, Hover, Normal } from '../../consts';
import { translateToCSStyle } from '../../translate/css';
import { deepMerge } from '@lugia/object-utils';

export function getStateTypes(themeState: ThemeState = {}): StateType[] {
  const res = [Normal];

  const {
    hover = false,
    disabled = false,
    active = false,
    focus = false,
  } = themeState;

  if (hover) {
    res.push(Hover);
  }
  if (focus) {
    res.push(Focus);
  }
  if (active) {
    res.push(Active);
  }
  if (disabled) {
    res.push(Disabled);
  }
  return res;
}

const allState = [Normal, Hover, Active, Disabled];

export function createGetStyleForThemeConfig(cssConfig: CSSConfig) {
  const stateType2Getter: {
    [key: StateType]: (themeMeta: ThemeMeta) => Object,
  } = {
    normal: translateToCSStyle(cssConfig, Normal),
    active: translateToCSStyle(cssConfig, Active),
    hover: translateToCSStyle(cssConfig, Hover),
    focus: translateToCSStyle(cssConfig, Focus),
    disabled: translateToCSStyle(cssConfig, Disabled),
  };
  return function(props: CSSProps) {
    const { themeProps } = props;
    const { themeState, themeConfig } = themeProps;
    const stateTypes = getStateTypes(themeState);

    const themeMetaForDesign = { current: {} };

    function getDefaultTheme(
      cssConfig: CSSConfig,
      stateType: StateType,
    ): Object {
      const { [stateType]: config = {} } = cssConfig;
      const { defaultTheme = {} } = config;
      return defaultTheme;
    }

    function getTargetThemeMeta(stateType: StateType) {
      let { [stateType]: themeMeta = {} } = themeConfig;

      const { [stateType]: cssConfigThemeMeta = {} } = cssConfig;
      const { getThemeMeta } = cssConfigThemeMeta;
      if (getThemeMeta) {
        let getThemeMetaRes = getThemeMeta(themeMeta, themeProps) || {};
        themeMeta = deepMerge(getThemeMetaRes, themeMeta);
      }
      const { getThemeMeta: getThemeMetaByUserDef } = themeMeta;
      if (getThemeMetaByUserDef) {
        themeMeta = deepMerge(
          themeMeta,
          getThemeMetaByUserDef(themeMeta, themeProps),
        );
      }
      return themeMeta;
    }

    allState.reduce((result: Object, stateType: StateType) => {
      const themeMeta = getTargetThemeMeta(stateType);
      const defaultTheme = getDefaultTheme(cssConfig, stateType);
      const curThemeMeta = (result[stateType] = deepMerge(
        defaultTheme,
        themeMeta,
      ));
      const selectors = filterSelector(themeMeta);

      if (selectors.length > 0) {
        const excludeSelectorMeta = selectors.reduce(
          (res: Object, selector: string) => {
            delete res[selector];
            return res;
          },
          deepMerge({}, curThemeMeta),
        );
        selectors.forEach((selector: string) => {
          curThemeMeta[selector] = deepMerge(
            excludeSelectorMeta,
            curThemeMeta[selector],
          );
        });
      }
      return result;
    }, themeMetaForDesign);

    return stateTypes.reduce(
      (result: Object, stateType: StateType) => {
        const getter = stateType2Getter[stateType];
        const themeMeta = getTargetThemeMeta(stateType);
        result[stateType] = getter(themeMeta);
        result.themeMeta.current = deepMerge(
          getDefaultTheme(cssConfig, stateType),
          result.themeMeta.current,
          themeMeta,
        );
        return result;
      },
      {
        themeMeta: themeMetaForDesign,
      },
    );
  };
}

/**
 * 根据配置获取最终计算出最终的结果 可以是CSS或者inline-style
 * @param cssConfig
 * @param props
 * @param opt
 * @param source
 * @return {StateType|*}
 */
export function computeFinalThemeOutResult(
  cssConfig: CSSConfig,
  props: CSSProps,
  opt: {
    createTranslate: (cssConfig: CSSConfig, stateType: StateType) => Function,
    initVal: any,
    reduceResult: (beforeValue: any, nextValue: any) => any,
  },
  source: any,
) {
  const { createTranslate, initVal, reduceResult } = opt;

  const { themeProps } = props;

  const { themeState } = themeProps;
  const stateTypes = getStateTypes(themeState);

  const { themeConfig = {} } = themeProps;

  return stateTypes.reduce((beforeValue: any, stateType: StateType) => {
    const { [stateType]: themeMeta = {} } = themeConfig;
    const translate = createTranslate(cssConfig, stateType);
    return reduceResult(beforeValue, translate(themeMeta, themeProps));
  }, initVal);
}
