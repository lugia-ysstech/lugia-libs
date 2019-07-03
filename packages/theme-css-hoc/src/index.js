/**
 *
 * create by ligx
 *
 * @flow
 */
import type { ThemeMeta } from '@lugia/theme-core';
import { CSSComponentDisplayName, filterSelector } from '@lugia/theme-core';

import type {
  CSSConfig,
  CSSMeta,
  CSSProps,
  StateType,
  ThemeState,
} from '@lugia/theme-css-hoc';

import React, { useEffect, useState } from 'react';
import {
  deepMerge,
  getAttributeFromObject,
  isEmptyObject,
} from '@lugia/object-utils';
import styled, { css, keyframes } from 'styled-components';
import { style2css, units } from '@lugia/css';
import { getBoxShadowCSS } from '@lugia/theme-utils';

const { px2remcss } = units;

type MarginOpt = {
  default: {
    left: number,
    right: number,
    top: number,
    bottom: number,
  },
};
const Normal = 'normal';
const Hover = 'hover';
const Focus = 'focus';
const Active = 'active';
const Disabled = 'disabled';

export function getAttributeValue(obj: Object, path: string[]): any {
  if (!obj) {
    return;
  }
  if (!path || path.length === 0) {
    return;
  }
  let target = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    target = target[key];
    if (!target) {
      return;
    }
  }
  return target;
}

export function packObject(path: string[], value: any): Object {
  if (!path || path.length === 0) {
    return {};
  }

  const result = {};
  let current = result;

  const lastIndex = path.length - 1;
  path.forEach((key: string, index: number) => {
    if (lastIndex === index) {
      current[key] = value;
    } else {
      current = current[key] = {};
    }
  });

  return result;
}

export function getSizeFromTheme(size: any) {
  return typeof size === 'number' || !isNaN(Number(size))
    ? px2remcss(size)
    : size;
}

export const getSpaceFromTheme = (
  spaceType: 'margin' | 'padding',
  space: Object,
) => {
  const style = {};

  if (typeof space === 'number') {
    space = {
      left: space,
      top: space,
      bottom: space,
      right: space,
    };
  }

  if (space !== undefined) {
    setObjectValueIfValueExist(
      style,
      `${spaceType}Top`,
      getAttributeFromObject(space, 'top', 0),
      getSizeFromTheme,
    );
    setObjectValueIfValueExist(
      style,
      `${spaceType}Bottom`,
      getAttributeFromObject(space, 'bottom', 0),
      getSizeFromTheme,
    );
    setObjectValueIfValueExist(
      style,
      `${spaceType}Left`,
      getAttributeFromObject(space, 'left', 0),
      getSizeFromTheme,
    );
    setObjectValueIfValueExist(
      style,
      `${spaceType}Right`,
      getAttributeFromObject(space, 'right', 0),
      getSizeFromTheme,
    );
  }
  return style;
};

function getBorderStyleFromTheme(border: Object) {
  if (!border) return {};

  if (border === 'none') {
    return {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    };
  }

  const borderTop = getAttributeFromObject(border, 'top', {});
  const borderBottom = getAttributeFromObject(border, 'bottom', {});
  const borderLeft = getAttributeFromObject(border, 'left', {});
  const borderRight = getAttributeFromObject(border, 'right', {});

  const style = {};

  function setBorderStyle(target: Object, name: string) {
    const borderTopWidth = getAttributeFromObject(target, 'width');
    setObjectValueIfValueExist(
      style,
      `${name}Width`,
      target === 'none' ? 0 : borderTopWidth,
      getSizeFromTheme,
    );

    const borderTopStyle = getAttributeFromObject(target, 'style');
    setObjectValueIfValueExist(
      style,
      `${name}Style`,
      borderTopStyle,
      always(borderTopStyle),
    );

    const borderColor = getAttributeFromObject(target, 'color');
    setObjectValueIfValueExist(
      style,
      `${name}Color`,
      borderColor,
      always(borderColor),
    );
  }

  setBorderStyle(borderTop, 'borderTop');
  setBorderStyle(borderBottom, 'borderBottom');
  setBorderStyle(borderLeft, 'borderLeft');
  setBorderStyle(borderRight, 'borderRight');
  return style;
}

function getBorderRadius(borderRadius: Object): Object {
  const style = {};
  if (!borderRadius) {
    return style;
  }
  const { topLeft, topRight, bottomLeft, bottomRight } = borderRadius;

  function setBorderRaidusIfExist(key: string, target: Object) {
    setObjectValueIfValueExist(style, key, target, getSizeFromTheme);
  }

  setBorderRaidusIfExist('borderTopLeftRadius', topLeft);
  setBorderRaidusIfExist('borderTopRightRadius', topRight);
  setBorderRaidusIfExist('borderBottomRightRadius', bottomRight);
  setBorderRaidusIfExist('borderBottomLeftRadius', bottomLeft);
  return style;
}

function getStringStyleFromTheme(stringStyle: string) {
  const theStringStyle =
    stringStyle && typeof stringStyle === 'string' ? stringStyle : '';
  return theStringStyle;
}

function getNumberStyleFromTheme(numberStyle: number) {
  const theNumberStyle =
    numberStyle && typeof numberStyle === 'number' ? numberStyle : 0;
  return theNumberStyle;
}

function themeMeta2Style(theme: ThemeMeta): Object {
  const {
    border,
    width,
    height,
    font,
    fontSize,
    color,
    opacity,
    margin,
    padding,
    boxShadow,
    visibility,
    cursor,
    lineHeight,
    borderRadius,
  } = theme;
  let { background } = theme;
  const style = {};
  setObjectValueIfValueExist(style, 'lineHeight', lineHeight, getSizeFromTheme);
  setObjectValueIfValueExist(style, 'fontSize', fontSize, getSizeFromTheme);

  setObjectValueIfValueExist(style, 'width', width, getSizeFromTheme);
  setObjectValueIfValueExist(style, 'height', height, getSizeFromTheme);

  setObjectValueIfValueExist(style, 'color', color, getStringStyleFromTheme);
  setObjectValueIfValueExist(
    style,
    'opacity',
    opacity,
    getNumberStyleFromTheme,
  );
  setObjectValueIfValueExist(style, 'boxShadow', boxShadow, getBoxShadowCSS);
  setObjectValueIfValueExist(
    style,
    'visibility',
    visibility,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(style, 'cursor', cursor, getStringStyleFromTheme);

  const { position } = theme;
  Object.assign(
    style,
    getFont(font),
    getBackGround(background),
    getBorderStyleFromTheme(border),
    getBorderRadius(borderRadius),
    getPosition(position),
    getSpaceFromTheme('padding', padding),
    getSpaceFromTheme('margin', margin),
  );
  return style;
}

function getFont(font: any) {
  const res = {};
  if (!font) {
    return res;
  }

  const { style, weight, size, family } = font;

  setObjectValueIfValueExist(res, 'fontStyle', style, getStringStyleFromTheme);

  setObjectValueIfValueExist(
    res,
    'fontFamily',
    family,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(res, 'fontSize', size, getSizeFromTheme);
  setObjectValueIfValueExist(
    res,
    'fontWeight',
    weight,
    getNumberStyleFromTheme,
  );
  return res;
}

function getBackGround(background: any) {
  const style = {};
  if (!background) {
    return style;
  }

  if (background === 'none') {
    return { backgroundColor: 'rgb(0,0,0,0)', backgroundImage: 'none' };
  }

  const {
    color,
    image,
    origin,
    positionX,
    positionY,
    repeatX,
    repeatY,
    size,
    clip,
  } = background;
  setObjectValueIfValueExist(
    style,
    'backgroundColor',
    color,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundImage',
    image,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundOrigin',
    origin,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundPositionX',
    positionX,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundPositionY',
    positionY,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundRepeatX',
    repeatX,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundRepeatY',
    repeatY,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundSize',
    size,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'backgroundClip',
    clip,
    getStringStyleFromTheme,
  );
  return style;
}

function getPosition(position: Object): Object {
  if (!position) {
    return {};
  }
  const style = {};
  const { left, top, right, bottom } = position;

  setObjectValueIfValueExist(style, 'left', left, getSizeFromTheme);
  setObjectValueIfValueExist(style, 'top', top, getSizeFromTheme);
  setObjectValueIfValueExist(style, 'right', right, getSizeFromTheme);
  setObjectValueIfValueExist(style, 'bottom', bottom, getSizeFromTheme);
  if (Object.keys(style).length > 0) {
    const { type = 'absolute' } = position;
    style.position = type;
  }
  return style;
}

export function setObjectValueIfValueExist(
  style: Object,
  name: string,
  value: any,
  cb?: Function,
) {
  if (value || value === 0) {
    style[name] = cb ? cb(value) : value;
  }
}

export function getThemeMeta(
  cssConfig: CSSConfig,
  stateType: StateType,
): (theme: ThemeMeta) => ThemeMeta {
  return (theme: ThemeMeta): ThemeMeta => {
    if (!theme) {
      return {};
    }
    if (!cssConfig) {
      return theme;
    }
    const config = cssConfig[stateType];

    if (!config) {
      return theme;
    }
    const { defaultTheme = {}, selectNames } = config;
    const selectNameThemeMeta = getSelectNameThemeMeta(theme, selectNames);
    if (
      stateType === Active ||
      stateType === Hover ||
      stateType === Focus ||
      stateType === Disabled
    ) {
      return deepMerge(defaultTheme, selectNameThemeMeta);
    }
    return selectNameThemeMeta;
  };
}

export function getSelectNameThemeMeta(
  theme: ?ThemeMeta,
  selectNames?: Array<string[]>,
): ThemeMeta {
  if (!theme) {
    return {};
  }
  if (!selectNames) {
    return theme;
  }
  if (selectNames.length === 0) {
    return {};
  }
  let result = {};
  selectNames.forEach((names: string[], i: number, target: Array<string[]>) => {
    if (typeof names === 'string') {
      names = [names];
      target[i] = names;
    }
    const value = getAttributeValue(theme, names);
    if (value !== undefined && value !== null) {
      result = deepMerge(result, packObject(names, value));
    }
  });
  return result;
}

function packStyle(
  cssConfig: CSSConfig,
  stateType: StateType,
): (themeMeta: ThemeMeta) => Object {
  const getThemeMetaByConfig = getThemeMeta(cssConfig, stateType);

  return (themeMeta: ThemeMeta) => {
    return themeMeta2Style(getThemeMetaByConfig(themeMeta));
  };
}

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

function getCSS(getStyle: Function) {
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

const allState = [Normal, Hover, Active, Disabled];

function getStateTypes(themeState: ThemeState = {}): StateType[] {
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
  if (active) {
    res.push(Active);
  }
  if (focus) {
    res.push(Focus);
  }
  if (disabled) {
    res.push(Disabled);
  }
  return res;
}

function createGetStyleFromPropsAndCSSConfig(cssConfig: CSSConfig) {
  const stateType2Gettor: {
    [key: StateType]: (themeMeta: ThemeMeta) => Object,
  } = {
    normal: packStyle(cssConfig, Normal),
    active: packStyle(cssConfig, Active),
    hover: packStyle(cssConfig, Hover),
    focus: packStyle(cssConfig, Focus),
    disabled: packStyle(cssConfig, Disabled),
  };
  return function(props: CSSProps) {
    const { themeProps } = props;
    const { themeState, themeConfig } = themeProps;
    const stateTypes = getStateTypes(themeState);
    const themeMeta = { current: {} };

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
        const excludeSelctorMeta = selectors.reduce(
          (res: Object, selector: string) => {
            delete res[selector];
            return res;
          },
          deepMerge({}, curThemeMeta),
        );
        selectors.forEach((selector: string) => {
          curThemeMeta[selector] = deepMerge(
            excludeSelctorMeta,
            curThemeMeta[selector],
          );
        });
      }
      return result;
    }, themeMeta);

    return stateTypes.reduce(
      (result: Object, stateType: StateType) => {
        const gettor = stateType2Gettor[stateType];
        const themeMeta = getTargetThemeMeta(stateType);
        result[stateType] = gettor(themeMeta);
        result.themeMeta.current = deepMerge(
          getDefaultTheme(cssConfig, stateType),
          result.themeMeta.current,
          themeMeta,
        );
        return result;
      },
      {
        themeMeta,
      },
    );
  };
}

function getStyleValue(beforeValue: any, nextValue: any) {
  return Object.assign({}, beforeValue, nextValue);
}

function getStyleFromPropsAndCSSConfigByHook(
  cssConfig: CSSConfig,
  props: CSSProps,
  createGetStyle: (cssConfig: CSSConfig, stateType: StateType) => Function,
  source: any,
) {
  return getInfoFromPropsAndCSSConfigByHook(
    cssConfig,
    props,
    {
      createGetStyle,
      initVal: {},
      getValue: getStyleValue,
    },
    source,
  );
}

function getInfoFromPropsAndCSSConfigByHook(
  cssConfig: CSSConfig,
  props: CSSProps,
  opt: {
    createGetStyle: (cssConfig: CSSConfig, stateType: StateType) => Function,
    initVal: any,
    getValue: (beforeValue: any, nextValue: any) => any,
  },
  source: any,
) {
  const { createGetStyle, initVal, getValue } = opt;
  const { themeProps } = props;

  const { themeState } = themeProps;
  const stateTypes = getStateTypes(themeState);

  const { themeConfig = {} } = themeProps;
  return stateTypes.reduce((beforeValue: any, stateType: StateType) => {
    const { [stateType]: themeMeta = {} } = themeConfig;
    const getStyle = createGetStyle(cssConfig, stateType);
    const current = getStyle(themeMeta, props.themeProps);
    const result = getValue(beforeValue, current);
    return result;
  }, initVal);
}

function getCSSFromPropsAndCSSConfigByHook(
  cssConfig: CSSConfig,
  props: CSSProps,
  createGetStyle: (cssConfig: CSSConfig, stateType: StateType) => Function,
  source: string,
) {
  return getInfoFromPropsAndCSSConfigByHook(
    cssConfig,
    props,
    {
      createGetStyle,
      initVal: '',
      getValue(beforeValue: any, nextValue: any) {
        return css`${beforeValue}${nextValue}`;
      },
    },
    source,
  );
}

const always = (val: any) => () => val;
const alwaysEmptyString = always('');

export function createGetUserDefineCSS(cssConfig: CSSConfig) {
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
  return (props: CSSProps): string => {
    return getCSSFromPropsAndCSSConfigByHook(
      cssConfig,
      props,
      (cssConfig: CSSConfig, stateType: StateType): Function => {
        if (!cssConfig) {
          return alwaysEmptyString;
        }
        const cssMeta = cssConfig[stateType];
        if (!cssMeta) {
          return alwaysEmptyString;
        }
        const { getCSS } = cssMeta;
        if (!getCSS) {
          return alwaysEmptyString;
        }
        return getCSS;
      },
      'defaultCSS',
    );
  };
}

export function createGetUserDefineStyle(cssConfig: CSSConfig) {
  return (props: CSSProps): Object => {
    return getStyleFromPropsAndCSSConfigByHook(
      cssConfig,
      props,
      (cssConfig: CSSConfig, stateType: StateType): Function => {
        const alwaysEmptyObject = always({});
        if (!cssConfig) {
          return alwaysEmptyObject;
        }
        const cssMeta = cssConfig[stateType];
        if (!cssMeta) {
          return alwaysEmptyObject;
        }
        const { getStyle } = cssMeta;
        if (!getStyle) {
          return alwaysEmptyObject;
        }
        return getStyle;
      },
      'userDefine',
    );
  };
}

function createGetStyleByDefaultThemeMeta(cssConfig: CSSConfig) {
  const { normal = {}, active = {}, disabled = {} } = cssConfig;

  if (!normal.defaultTheme && !active.defaultTheme && !disabled.defaultTheme) {
    return undefined;
  }
  return (props: CSSProps): string => {
    return getInfoFromPropsAndCSSConfigByHook(
      cssConfig,
      props,
      {
        createGetStyle(cssConfig: CSSConfig, stateType: StateType): Function {
          const alwaysEmptyObject = always({});
          if (
            !cssConfig ||
            stateType === Hover ||
            stateType === Focus ||
            stateType === Active ||
            stateType === Disabled
          ) {
            return alwaysEmptyObject;
          }
          const cssMeta = cssConfig[stateType];
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
        getValue: getStyleValue,
      },
      'defaultTheme',
    );
  };
}

function getStyledComponent(cssConfig: CSSConfig): Object {
  const { tag = 'span', extend } = cssConfig;
  const styledElement = extend ? styled(extend) : styled[tag];
  if (!styledElement) {
    throw new Error(`Not support tag: ${tag}`);
  }
  return styledElement;
}

const CSSComponent2CSSConfig = new WeakMap();

export function filterRepeatSelectNames(
  selNames: Array<Array<string>>,
): Array<Array<string>> {
  if (!selNames) {
    return selNames;
  }
  const exist = {};
  return selNames.filter(path => {
    const key = typeof path === 'string' ? path : path.join('.');
    const isExist = !exist[key];
    exist[key] = true;
    return isExist;
  });
}

export function filterRepeatCSSMetaSelctNames(outCSSMeta: CSSMeta) {
  if (!outCSSMeta) {
    return;
  }
  const { selectNames } = outCSSMeta;
  if (selectNames && selectNames.length > 0) {
    outCSSMeta.selectNames = filterRepeatSelectNames(selectNames);
  }
}

export function filterRepeatCSSConfigSelectNames(outCSSConfig: CSSConfig) {
  if (!outCSSConfig) {
    return;
  }
  const { normal, hover, disabled, active, focus } = outCSSConfig;
  normal && filterRepeatCSSMetaSelctNames(normal);
  hover && filterRepeatCSSMetaSelctNames(hover);
  disabled && filterRepeatCSSMetaSelctNames(disabled);
  active && filterRepeatCSSMetaSelctNames(active);
  focus && filterRepeatCSSMetaSelctNames(focus);
}

export default function CSSComponent(cssConfig: CSSConfig) {
  let { extend, className } = cssConfig;
  if (!className) {
    console.trace('className is empty!');
  }
  if (extend) {
    let orginalWidget = extend.__OrginalWidget__;
    if (orginalWidget) {
      while (orginalWidget.__OrginalWidget__) {
        orginalWidget = orginalWidget.__OrginalWidget__;
      }
      extend = orginalWidget;
    }
    const extendCSSConfig = CSSComponent2CSSConfig.get(extend);
    if (extendCSSConfig) {
      cssConfig = deepMerge(extendCSSConfig, cssConfig);
      filterRepeatCSSConfigSelectNames(cssConfig);
      const newExtendConfig = { ...cssConfig };
      delete newExtendConfig.extend;
      cssConfig.extend = CSSComponent(newExtendConfig);
    }
  }
  const styledElement = getStyledComponent(cssConfig);
  const getTheCSS = createGetUserDefineCSS(cssConfig);
  const getTheStyle = createGetUserDefineStyle(cssConfig);
  const getStyleByDefaultThemeMeta = createGetStyleByDefaultThemeMeta(
    cssConfig,
  );
  const getDefaultStyle = getStyleByDefaultThemeMeta
    ? getStyleByDefaultThemeMeta
    : undefined;
  const getStyleByThemeMeta = createGetStyleFromPropsAndCSSConfig(cssConfig);
  const attrsHook = (props: CSSProps): Object => {
    return { theStyle: getTheStyle(props), ...getStyleByThemeMeta(props) };
  };

  const { css } = cssConfig;

  function getTargetComponent(targetStyleComponent: Function): Function {
    const result = targetStyleComponent`
    ${css}
    ${getCSS(getDefaultStyle)}
    ${getTheCSS}
  `;
    result.displayName = CSSComponentDisplayName;
    return result;
  }

  if (extend) {
    const CSSComponent = getTargetComponent(styledElement);
    const result = (props: Object) => {
      const {
        _lugia_theme_style_: {
          normal: cNormal,
          hover: cHover,
          focus: cFocus,
          active: cActived,
          disabled: cDisabled,
          theStyle: cTheStyle,
          themeMeta: cThemeMeta,
        } = {},
      } = props;
      const {
        normal = {},
        hover = {},
        focus = {},
        active = {},
        disabled = {},
        theStyle = {},
        themeMeta = {},
      } = attrsHook(props);

      return (
        <CSSComponent
          {...props}
          _lugia_theme_style_={{
            normal: deepMerge(normal, cNormal),
            hover: deepMerge(hover, cHover),
            focus: deepMerge(focus, cFocus),
            active: deepMerge(active, cActived),
            disabled: deepMerge(disabled, cDisabled),
            theStyle: deepMerge(theStyle, cTheStyle),
            themeMeta: deepMerge(themeMeta, cThemeMeta),
          }}
          ref={props.innerRef}
          __cssName={className}
          className={getClassName(className, props)}
        />
      );
    };
    CSSComponent2CSSConfig.set(result, cssConfig);
    result.displayName = 'CSSComponent';
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

    let targetProps = deepMerge(props, { themeProps: { themeState } });
    const {
      normal = {},
      hover = {},
      focus = {},
      active = {},
      disabled = {},
      theStyle = {},
      themeMeta = {},
    } = attrsHook(targetProps);
    const {
      _lugia_theme_style_: {
        normal: cNormal,
        hover: cHover,
        focus: cFocus,
        active: cActived,
        disabled: cDisabled,
        theStyle: cTheStyle,
        themeMeta: cThemeMeta,
      } = {},
    } = props;

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
      cNormal,
      hover,
      cHover,
      active,
      cActived,
      focus,
      cFocus,
      disabled,
      cDisabled,
      theStyle,
      cTheStyle,
    );
    return (
      <Target
        {...props}
        themeProps={targetProps.themeProps}
        __themeMeta={deepMerge(themeMeta, cThemeMeta)}
        style={targetStyle}
        ref={props.innerRef}
        __cssName={className}
        className={getClassName(className, props)}
      />
    );
  };
  CSSComponent2CSSConfig.set(Result, cssConfig);
  Result.displayName = 'CSSComponent';
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
