/**
 *
 * create by ligx
 *
 * @flow
 */
import type { CSSConfig, CSSProps } from '@lugia/theme-css-hoc';
import {
  CSSComponentContainerDisplayName,
  CSSComponentDisplayName,
  hasThemeStateEvent,
  injectThemeStateEvent,
  ThemeStateHandle,
} from '@lugia/theme-core';
import React, { useEffect, useRef, useState } from 'react';
import { deepMerge, isEmptyObject } from '@lugia/object-utils';
import { css, keyframes } from 'styled-components';
import {
  filterRepeatCSSConfigSelectNames,
  getStyledComponent,
} from './extractor/cssconfig';

import {
  createGetStyleInThemeMeta,
  getStateTypes,
} from './extractor/themeprops/common';
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

function useInitHandle(
  props: Object,
  widgetName: string,
  hasThemeStateEvent: boolean,
) {
  let handle: Object = useRef(null);

  const [themeState, setThemeState] = useState({
    hover: false,
    focus: false,
    active: false,
    disabled: false,
  });

  const { themeProps } = props;
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
  if (hasThemeStateEvent && !handle.current) {
    handle.current = new ThemeStateHandle(props, widgetName, themeState);
  }
  if (handle.current) {
    handle.current.setProps(props);
  }

  return {
    handle: handle.current || {},
    themeState: [themeState, setThemeState],
  };
}

function extendCSSComponent(cssConfig: CSSConfig) {
  const { extend } = cssConfig;
  if (extend) {
    if (extend.__OrginalWidget__) {
      throw new Error('Not support extend ThemeHoc Component!');
    }
    const extendCSSConfig = CSSComponent2CSSConfig.get(extend);
    if (extendCSSConfig) {
      cssConfig = deepMerge(extendCSSConfig, cssConfig);
      filterRepeatCSSConfigSelectNames(cssConfig);
      const newExtendConfig = { ...cssConfig };
      delete newExtendConfig.extend;
      return CSSComponent(newExtendConfig);
    }
  }
}

/**
 * @return {undefined}
 */
export default function CSSComponent(cssConfig: CSSConfig) {
  const { className } = cssConfig;
  if (!className) {
    console.trace('className is empty!');
  }
  const extendResult = extendCSSComponent(cssConfig);
  if (extendResult) {
    return extendResult;
  }
  const styledElement = getStyledComponent(cssConfig);
  const getCSSInCSSConfig = createGetCSSInCSSConfig(cssConfig);
  const getStyleInCSSConfig = createGetStyleInCSSConfig(cssConfig);
  const getStyleInCSSConfigDefaultTheme = createGetDefaultThemeInCSSConfig(
    cssConfig,
  );
  const getRenderTargetByGetCSSInThemeMeta = createGetRenderTargetByGetCSSInThemeMeta();
  const getDefaultStyle = getStyleInCSSConfigDefaultTheme
    ? getStyleInCSSConfigDefaultTheme
    : undefined;

  const getStyleByThemeMeta = createGetStyleInThemeMeta(cssConfig);

  const computeInLineStyle = (props: CSSProps): Object => {
    return {
      styleInCSSConfig: getStyleInCSSConfig(props),
      ...getStyleByThemeMeta(props),
    };
  };

  const {
    css,
    option = { hover: false, focus: false, active: false },
  } = cssConfig;
  const isHasThemeStateEvent = hasThemeStateEvent(option);

  function getTargetComponent(targetStyleComponent: Function): Function {
    const result = targetStyleComponent`
    ${css}
    ${createGetCSSByStyleTranslate(getDefaultStyle)}
    ${getCSSInCSSConfig}
    ${getRenderTargetByGetCSSInThemeMeta}
  `;
    result.displayName = CSSComponentDisplayName;
    return result;
  }

  let Target = getTargetComponent(styledElement);
  const hasStaticHover = !isEmptyObject(cssConfig.hover);
  const hasStaticFocus = !isEmptyObject(cssConfig.focus);
  const hasStaticActive = !isEmptyObject(cssConfig.active);

  const ResultForward = (props: Object, ref: any) => {
    const {
      handle,
      themeState: [themeState, setThemeState],
    } = useInitHandle(props, className, isHasThemeStateEvent);

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
      let { onLugia } = themeProps;
      if (isHasThemeStateEvent) {
        onLugia = handle.on;
      }
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
        unsubscribeHover && unsubscribeHover();
        unsubscribeFocus && unsubscribeFocus();
        unsubscribeActive && unsubscribeActive();
      };
    }, [handle.on, props, setThemeState, themeState]);

    const targetStyle = deepMerge(
      normal,
      hover,
      focus,
      active,
      disabled,
      styleInCSSConfig,
    );

    const { themeProps } = targetProps;
    return (
      <Target
        {...props}
        {...injectThemeStateEvent(option, handle)}
        themeProps={themeProps}
        __themeMeta={themeMeta}
        style={targetStyle}
        ref={props.innerRef}
        __cssName={className}
        className={getClassName(className, props)}
        ref={ref}
      />
    );
  };
  const Result: Object = React.forwardRef(ResultForward);

  CSSComponent2CSSConfig.set(Result, cssConfig);
  Result.displayName = CSSComponentContainerDisplayName;
  return Result;
}

function createGetRenderTargetByGetCSSInThemeMeta() {
  return (cssProps: CSSProps) => {
    const { themeProps } = cssProps;

    const { themeConfig = {} } = themeProps;
    const css = [];
    const { themeState } = themeProps;

    getStateTypes(themeState).map(stateType => {
      const { [stateType]: themeMeta } = themeConfig;
      if (!themeMeta) {
        return;
      }
      const { getCSS } = themeMeta;
      if (getCSS) {
        css.push(getCSS(themeMeta, themeProps));
      }
    });
    return css;
  };
}

function packClassName(Target: Function, className: string) {
  return React.forwardRef((props: any, ref: any) => (
    <Target {...props} className={getClassName(className, props)} ref={ref} />
  ));
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
