/**
 *
 * create by ligx
 *
 * @flow
 */
import type { CSSConfig, CSSProps } from '@lugia/theme-css-hoc';
import {
  CSSComponentDisplayName,
  CSSComponentContainerDisplayName,
} from '@lugia/theme-core';
import React, { useEffect, useState } from 'react';
import { deepMerge, isEmptyObject } from '@lugia/object-utils';
import { css, keyframes } from 'styled-components';
import {
  filterRepeatCSSConfigSelectNames,
  getStyledComponent,
} from './extractor/cssconfig';

import { createGetStyleForThemeConfig } from './extractor/themeprops/common';
import {
  createGetCSSByStyleTranslate,
  createGetCSSInCSSConfig,
  createGetDefaultThemeInCSSConfig,
  createGetStyleInCSSConfig,
} from './extractor/themeprops/css';

function getClassName(cssConfigClassName: string, props: Object): string {
  const { className } = props;
  cssConfigClassName = window.__lugia__enabledClassNameBool__
    ? cssConfigClassName
    : '';

  if (className) {
    return `${className} ${cssConfigClassName}`;
  }
  return cssConfigClassName;
}

const CSSComponent2CSSConfig = new WeakMap();

export default function CSSComponent(cssConfig: CSSConfig) {
  let { extend, className } = cssConfig;
  if (!className) {
    console.trace('className is empty!');
  }

  if (extend) {
    if (extend.__OrginalWidget__) {
      throw new Error('Not support extend ThemeHoc Component!');
    }
    const extendCSSConfig = CSSComponent2CSSConfig.get(extend);
    if (extendCSSConfig) {
      cssConfig = deepMerge(extendCSSConfig, cssConfig);
      delete cssConfig.extend;
      filterRepeatCSSConfigSelectNames(cssConfig);
    }
  }
  const styledElement = getStyledComponent(cssConfig);
  const getCSSInCSSConfig = createGetCSSInCSSConfig(cssConfig);
  const getStyleInCSSConfig = createGetStyleInCSSConfig(cssConfig);
  const getStyleInCSSConfigDefaultTheme = createGetDefaultThemeInCSSConfig(
    cssConfig,
  );
  const getDefaultStyle = getStyleInCSSConfigDefaultTheme
    ? getStyleInCSSConfigDefaultTheme
    : undefined;

  const getStyleByThemeMeta = createGetStyleForThemeConfig(cssConfig);

  const computeInLineStyle = (props: CSSProps): Object => {
    return {
      styleInCSSConfig: getStyleInCSSConfig(props),
      ...getStyleByThemeMeta(props),
    };
  };

  const { css } = cssConfig;

  function getTargetComponent(targetStyleComponent: Function): Function {
    const result = targetStyleComponent`
    ${css}
    ${createGetCSSByStyleTranslate(getDefaultStyle)}
    ${getCSSInCSSConfig}
  `;
    result.displayName = CSSComponentDisplayName;
    return result;
  }

  const Target = getTargetComponent(styledElement);
  const hasStaticHover = !isEmptyObject(cssConfig.hover);
  const hasStaticFocus = !isEmptyObject(cssConfig.focus);
  const hasStaticActive = !isEmptyObject(cssConfig.active);
  const Result = (props: Object) => {
    const { themeProps } = props;
    const [themeState, setThemeState] = useState({
      hover: false,
      focus: false,
      active: false,
      disabled: false,
    });
    let propsThemeState = themeProps.themeState;
    if (propsThemeState) {
      const finalState = { ...themeState, ...propsThemeState };
      const { disabled, hover, focus, active } = finalState;
      const {
        disabled: sDisabled,
        hover: sHover,
        focus: sFocus,
        active: sActive,
      } = themeState;
      if (
        disabled !== sDisabled ||
        hover !== sHover ||
        focus !== sFocus ||
        sActive !== active
      ) {
        setThemeState(finalState);
      }
    }

    const targetProps = deepMerge(props, { themeProps: { themeState } });

    const {
      normal = {},
      hover = {},
      focus = {},
      active = {},
      disabled = {},
      styleInCSSConfig = {},
      themeMeta = {},
    } = computeInLineStyle(targetProps);

    useEffect(() => {
      const { themeProps } = props;
      const { onLugia } = themeProps;
      const unsubscribeHover =
        onLugia &&
        onLugia('hover', data => {
          if (hasStaticHover || !isEmptyObject(themeProps.themeConfig.hover)) {
            setThemeState({ ...themeState, ...data });
          }
        });
      const unsubscribeFocus =
        onLugia &&
        onLugia('focus', data => {
          if (hasStaticFocus || !isEmptyObject(themeProps.themeConfig.focus)) {
            setThemeState({ ...themeState, ...data });
          }
        });
      const unsubscribeActive =
        onLugia &&
        onLugia('active', data => {
          if (
            hasStaticActive ||
            !isEmptyObject(themeProps.themeConfig.active)
          ) {
            setThemeState({ ...themeState, ...data });
          }
        });
      if (!onLugia) {
        console.error(`${cssConfig.className} onLugia is not found ！`);
      }
      return () => {
        onLugia && unsubscribeHover();
        onLugia && unsubscribeFocus();
        onLugia && unsubscribeActive();
      };
    }, [props, themeState]);

    const targetStyle = deepMerge(
      normal,
      hover,
      focus,
      active,
      disabled,
      styleInCSSConfig,
    );
    return (
      <Target
        {...props}
        themeProps={targetProps.themeProps}
        __themeMeta={themeMeta}
        style={targetStyle}
        ref={props.innerRef}
        __cssName={className}
        className={getClassName(className, props)}
      />
    );
  };

  CSSComponent2CSSConfig.set(Result, cssConfig);
  Result.displayName = CSSComponentContainerDisplayName;
  return Result;
}

function packClassName(Target: Function, className: string) {
  return (props: any) => (
    <Target {...props} className={getClassName(className, props)} />
  );
}

export function StaticComponent(cssConfig: CSSConfig): Function {
  const styledElement = getStyledComponent(cssConfig);
  const { css, className } = cssConfig;
  return packClassName(
    styledElement`
    ${css}
  `,
    className,
  );
}

export { css, keyframes };
