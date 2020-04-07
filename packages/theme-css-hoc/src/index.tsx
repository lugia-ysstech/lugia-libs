/**
 *
 * create by ligx
 *
 * @flow
 */
import { CSSConfig, CSSProps, ThemeStyle } from './type';
import {
  CSSComponentContainerDisplayName,
  CSSComponentDisplayName,
  hasThemeStateEvent,
  injectThemeStateEvent,
  ThemeStateHandle,
} from '@lugia/theme-core';
import React, {
  FunctionComponent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  deepMerge,
  deepMergeForArrayMerge,
  isEmptyObject,
} from '@lugia/object-utils';
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
import { ThemeState } from '../../theme-core/lib/type';

type ComponentProps = { [propsName: string]: any };

function getClassName(
  cssConfigClassName: string,
  props: ComponentProps,
): string {
  const { className } = props;
  // @ts-ignore
  cssConfigClassName = !window.__lugia__enabledClassNameBool__
    ? ''
    : cssConfigClassName;

  if (className) {
    return `${className} ${cssConfigClassName}`;
  }
  return cssConfigClassName;
}

const CSSComponent2CSSConfig: WeakMap<any, CSSConfig> = new WeakMap();
type InitHandle = {
  handle?: ThemeStateHandle;
  themeState: [ThemeState, (state: ThemeState) => void];
};

function useInitHandle(
  props: CSSProps,
  widgetName: string,
  isHasThemeStateEvent: boolean,
): InitHandle {
  const handle: { current?: ThemeStateHandle } = useRef(undefined);

  const [themeState, setThemeState] = useState<ThemeState>({
    hover: false,
    focus: false,
    active: false,
    disabled: false,
  });

  const { themeProps } = props;
  const propsThemeState = themeProps.themeState;
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
  if (isHasThemeStateEvent && !handle.current) {
    handle.current = new ThemeStateHandle(props, widgetName, themeState);
  }
  if (handle.current) {
    handle.current.setProps(props);
  }

  return {
    handle: handle.current,
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
      const { className } = cssConfig;
      cssConfig = {
        className,
        ...deepMergeForArrayMerge(extendCSSConfig, cssConfig),
      };
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
export default function CSSComponent(
  cssConfig: CSSConfig,
): FunctionComponent<any> {
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

  const computeInLineStyle = (props: CSSProps): ThemeStyle => {
    return {
      styleInCSSConfig: getStyleInCSSConfig(props),
      ...getStyleByThemeMeta(props),
    };
  };

  const {
    css: cssVal,
    option = { hover: false, focus: false, active: false },
  } = cssConfig;
  const isHasThemeStateEvent = hasThemeStateEvent(option);

  function getTargetComponent(
    targetStyleComponent: any,
  ): FunctionComponent<any> {
    const result = targetStyleComponent`
    ${cssVal}
    ${createGetCSSByStyleTranslate(getDefaultStyle)}
    ${getCSSInCSSConfig}
    ${getRenderTargetByGetCSSInThemeMeta}
  `;
    result.displayName = CSSComponentDisplayName;
    return result;
  }

  const Target = getTargetComponent(styledElement);
  const hasStaticHover = !isEmptyObject(cssConfig.hover);
  const hasStaticFocus = !isEmptyObject(cssConfig.focus);
  const hasStaticActive = !isEmptyObject(cssConfig.active);

  const ResultForward = (props: CSSProps, ref: any) => {
    const {
      handle,
      themeState: [themeState, setThemeState],
    } = useInitHandle(props, className, isHasThemeStateEvent);

    const targetProps: CSSProps = { ...props };
    targetProps.themeProps = deepMerge(targetProps.themeProps, { themeState });
    if ('disabled' in targetProps) {
      const { disabled: disabledVal } = targetProps;
      targetProps.themeProps = deepMerge(targetProps.themeProps, {
        themeState: { disabled: disabledVal },
      });
    }
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
      if (isHasThemeStateEvent && handle) {
        onLugia = handle.on;
      }
      const { themeConfig } = themeProps;
      const unsubscribeHover: any =
        onLugia &&
        onLugia('hover', data => {
          if (
            hasStaticHover ||
            (themeConfig && !isEmptyObject(themeConfig.hover))
          ) {
            setThemeState({ ...themeState, ...data });
          }
        });
      const unsubscribeFocus: any =
        onLugia &&
        onLugia('focus', data => {
          if (
            hasStaticFocus ||
            (themeConfig && !isEmptyObject(themeConfig.focus))
          ) {
            setThemeState({ ...themeState, ...data });
          }
        });
      const unsubscribeActive: any =
        onLugia &&
        onLugia('active', data => {
          if (
            hasStaticActive ||
            (themeConfig && !isEmptyObject(themeConfig.active))
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
    }, [handle ? handle.on : undefined, props, setThemeState, themeState]);

    const targetStyle = deepMerge(
      normal,
      hover,
      focus,
      active,
      disabled,
      styleInCSSConfig,
    );

    const { themeProps: themePropsVal } = targetProps;
    return (
      <Target
        {...props}
        {...injectThemeStateEvent(option, handle)}
        themeProps={themePropsVal}
        __themeMeta={themeMeta}
        style={targetStyle}
        __cssName={className}
        className={getClassName(className, props)}
        ref={ref}
      />
    );
  };
  const Result: FunctionComponent<any> = React.forwardRef(ResultForward);
  CSSComponent2CSSConfig.set(Result, cssConfig);
  Result.displayName = CSSComponentContainerDisplayName;
  return Result;
}

function createGetRenderTargetByGetCSSInThemeMeta() {
  return (cssProps: CSSProps) => {
    const { themeProps } = cssProps;

    const { themeConfig = {} } = themeProps;
    const cssArray: string[] = [];
    const { themeState } = themeProps;

    getStateTypes(themeState).map(stateType => {
      const { [stateType]: themeMeta } = themeConfig;
      if (!themeMeta) {
        return;
      }
      const { getCSS } = themeMeta;
      if (getCSS) {
        cssArray.push(getCSS(themeMeta, themeProps));
      }
    });
    return cssArray;
  };
}

function packClassName(Target: FunctionComponent<any>, className: string) {
  return React.forwardRef((props: any, ref: any) => (
    <Target {...props} className={getClassName(className, props)} ref={ref} />
  ));
}

export function StaticComponent(config: CSSConfig): FunctionComponent<any> {
  const styledElement = getStyledComponent(config);
  const { css: cssConfig, className } = config;
  return packClassName(
    styledElement`
    ${cssConfig}
  `,
    className,
  );
}

export { css, keyframes };
