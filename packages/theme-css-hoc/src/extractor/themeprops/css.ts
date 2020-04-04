/**
 *
 * create by ligx
 *
 * @flow
 */

import {
  CSSConfig,
  CSSProps,
  StateType,
  StyleType,
  TranslateCSSFunction,
  TranslateFunction,
} from '../../type';

import { Active, Disabled, Focus, Hover } from '../../consts';
import { themeMeta2Style } from '../../translate/css';
import { css } from 'styled-components';
import { always, alwaysEmptyString } from '@lugia/ramada';
import { style2css } from '@lugia/css';
import { computeFinalThemeOutResult } from './common';

/**
 * 计算CSSConfig中配置getCSS样式
 * @param cssConfig
 * @return {string|(function(CSSProps))}
 */
export function createGetCSSInCSSConfig(cssConfig: CSSConfig) {
  const {
    normal = {},
    hover = {},
    active = {},
    disabled = {},
    focus = {},
  } = cssConfig;
  if (
    !normal.getCSS &&
    !hover.getCSS &&
    !active.getCSS &&
    !disabled.getCSS &&
    !focus.getCSS
  ) {
    return '';
  }
  return (props: CSSProps): StyleType => {
    return computeFinalThemeOutResult(
      cssConfig,
      props,
      {
        createTranslate(
          translateCssConfig: CSSConfig,
          stateType: StateType,
        ): TranslateCSSFunction {
          if (!translateCssConfig) {
            return alwaysEmptyString;
          }
          const cssMeta = translateCssConfig[stateType];
          if (!cssMeta) {
            return alwaysEmptyString;
          }
          const { getCSS } = cssMeta;
          if (!getCSS) {
            return alwaysEmptyString;
          }
          return getCSS;
        },

        initVal: '',

        reduceResult: getCSSValue,
      },
      'CSSConfig.css',
    );
  };
}

/**
 * 计算CSSConfig中配置getStyle返回的样式
 * @param cssConfig
 * @return {function(CSSProps)}
 */
export function createGetStyleInCSSConfig(cssConfig: CSSConfig) {
  return (props: CSSProps): object => {
    return computeFinalThemeOutResult(
      cssConfig,
      props,
      {
        createTranslate(
          translateCssConfig: CSSConfig,
          stateType: StateType,
        ): TranslateFunction {
          const alwaysEmptyObject = always({});
          if (!translateCssConfig) {
            return alwaysEmptyObject;
          }
          const cssMeta = translateCssConfig[stateType];
          if (!cssMeta) {
            return alwaysEmptyObject;
          }
          const { getStyle } = cssMeta;
          if (!getStyle) {
            return alwaysEmptyObject;
          }
          return getStyle;
        },
        initVal: {},
        reduceResult: getStyleValue,
      },
      'CSSConfig.getStyle',
    );
  };
}

/**
 * 获取CSSConfig中配置defaultTheme
 * @param cssConfig
 * @return {(function(CSSProps))|undefined}
 */
export function createGetDefaultThemeInCSSConfig(cssConfig: CSSConfig) {
  const { normal = {}, active = {}, disabled = {} } = cssConfig;

  if (!normal.defaultTheme && !active.defaultTheme && !disabled.defaultTheme) {
    return undefined;
  }
  return (props: CSSProps): StyleType => {
    return computeFinalThemeOutResult(
      cssConfig,
      props,
      {
        createTranslate(
          translateCssConfig: CSSConfig,
          stateType: StateType,
        ): TranslateFunction {
          const alwaysEmptyObject = always({});
          if (
            !translateCssConfig ||
            stateType === Hover ||
            stateType === Focus ||
            stateType === Active ||
            stateType === Disabled
          ) {
            return alwaysEmptyObject;
          }
          const cssMeta = translateCssConfig[stateType];
          if (!cssMeta) {
            return alwaysEmptyObject;
          }
          const { defaultTheme } = cssMeta;
          if (!defaultTheme) {
            return alwaysEmptyObject;
          }
          return always(themeMeta2Style(defaultTheme));
        },
        initVal: {},
        reduceResult: getStyleValue,
      },
      'CSSConfig.defaultTheme',
    );
  };
}

/**
 * 根据传入的themeMeta2Style的转换器生成对应的CSS字符串
 * @param getStyle
 * @return {(function(CSSProps): *)|undefined}
 */
export function createGetCSSByStyleTranslate(
  getStyle: (props: CSSProps) => object,
) {
  if (!getStyle) {
    return undefined;
  }
  return function(props: CSSProps) {
    const style = getStyle(props);
    return css`
      ${style2css(style)}
    `;
  };
}

export function getStyleValue(beforeValue: any, nextValue: any) {
  return Object.assign({}, beforeValue, nextValue);
}

export function getCSSValue(beforeValue: any, nextValue: any) {
  return css`${beforeValue}${nextValue}`;
}
