/**
 *
 * create by ligx
 *
 * @flow
 */
import type {
  BorderRadiusType,
  BorderType,
  HeightType,
  MarginType,
  PaddingType,
  ThemeMeta,
  WidthType,
} from '@lugia/theme-core';

import type {
  BorderConfig,
  BorderRadiusDirection,
  CSSConfig,
  CSSMeta,
  CSSProps,
  GetBorderOption,
  StateType,
  ThemeState,
} from '@lugia/theme-css-hoc';

import React from 'react';
import { deepMerge, getAttributeFromObject } from '@lugia/object-utils';
import styled, { css, keyframes } from 'styled-components';
import { style2css, units } from '@lugia/css';

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

function getSizeFromTheme(size: WidthType | HeightType | BorderRadiusType) {
  const theSize = typeof size === 'number' ? px2remcss(size) : size;
  return theSize;
}

const DefaultSpace = 0;
export const getSpaceFromTheme = (
  spaceType: 'margin' | 'padding',
  space: MarginType | PaddingType,
  opt?: MarginOpt = {
    default: {
      left: DefaultSpace,
      right: DefaultSpace,
      top: DefaultSpace,
      bottom: DefaultSpace,
    },
  },
) => {
  const theSpace = '';
  const {
    default: {
      left = DefaultSpace,
      right = DefaultSpace,
      top = DefaultSpace,
      bottom = DefaultSpace,
    },
  } = opt;
  if (typeof space === 'number') {
    return `:${px2remcss(space)} `;
  }
  if (space !== undefined) {
    const spaceTop = getAttributeFromObject(space, 'top', top);
    const spaceBottom = getAttributeFromObject(space, 'bottom', bottom);
    const spaceLeft = getAttributeFromObject(space, 'left', left);
    const spaceRight = getAttributeFromObject(space, 'right', right);
    return `${px2remcss(spaceTop)} ${px2remcss(spaceRight)} ${px2remcss(
      spaceBottom,
    )} ${px2remcss(spaceLeft)}`;
  }
  return theSpace;
};

function getObjectStyleFromTheme(obj: Object) {
  if (!obj) return {};
  return obj;
}

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
  setBorderRadius(style, border);
  return style;
}

function setBorderRadius(style: Object, border: Object) {
  if (!border) {
    return;
  }
  const { radius } = border;
  if (!radius) {
    return;
  }
  const { topLeft, topRight, bottomLeft, bottomRight } = radius;

  function setBorderRaidusIfExist(key: string, target: Object) {
    setObjectValueIfValueExist(style, key, target, getSizeFromTheme);
  }

  setBorderRaidusIfExist('borderTopLeftRadius', topLeft);
  setBorderRaidusIfExist('borderTopRightRadius', topRight);
  setBorderRaidusIfExist('borderBottomRightRadius', bottomRight);
  setBorderRaidusIfExist('borderBottomLeftRadius', bottomLeft);
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
  } = theme;
  let { background } = theme;

  const style = {};
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
  setObjectValueIfValueExist(
    style,
    'boxShadow',
    boxShadow,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(
    style,
    'visibility',
    visibility,
    getStringStyleFromTheme,
  );
  setObjectValueIfValueExist(style, 'cursor', cursor, getStringStyleFromTheme);
  setObjectValueIfValueExist(style, 'padding', padding, (target: Object) =>
    getSpaceFromTheme('padding', target),
  );
  setObjectValueIfValueExist(style, 'margin', margin, (target: Object) =>
    getSpaceFromTheme('margin', target),
  );
  const { position } = theme;
  Object.assign(
    style,
    getObjectStyleFromTheme(font),
    getBackGround(background),
    getBorderStyleFromTheme(border),
    getPosition(position),
  );
  return style;
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
    if (stateType === Hover || stateType === Disabled) {
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

  const { hover = false, disabled = false, active = false } = themeState;

  if (hover) {
    res.push(Hover);
  }
  if (active) {
    res.push(Active);
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
    allState.reduce((result: Object, stateType: StateType) => {
      const { [stateType]: themeMeta = {} } = themeConfig;
      const defaultTheme = getDefaultTheme(cssConfig, stateType);
      result[stateType] = deepMerge(defaultTheme, themeMeta);
      return result;
    }, themeMeta);
    return stateTypes.reduce(
      (result: Object, stateType: StateType) => {
        const gettor = stateType2Gettor[stateType];
        const { [stateType]: themeMeta = {} } = themeConfig;
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
  const { normal = {}, hover = {}, active = {}, disabled = {} } = cssConfig;
  if (!normal.getCSS && !hover.getCSS && !active.getCSS && !disabled.getCSS) {
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
          if (!cssConfig || stateType === Hover || stateType === Disabled) {
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
  const { normal, hover, disabled, active } = outCSSConfig;
  normal && filterRepeatCSSMetaSelctNames(normal);
  hover && filterRepeatCSSMetaSelctNames(hover);
  disabled && filterRepeatCSSMetaSelctNames(disabled);
  active && filterRepeatCSSMetaSelctNames(active);
}

export default function CSSComponent(cssConfig: CSSConfig) {
  let { extend } = cssConfig;

  if (extend) {
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

  const { css, className } = cssConfig;

  function getTargetComponent(targetStyleComponent: Function): Function {
    const result = targetStyleComponent`
    ${css}
    ${getCSS(getDefaultStyle)}
    ${getTheCSS}
  `;
    result.displayName = 'lugia_c_t';
    return result;
  }

  if (extend) {
    const CSSComponent = getTargetComponent(styledElement);
    const result = (props: Object) => {
      const {
        _lugia_theme_style_: {
          normal: cNormal,
          hover: cHover,
          active: cActived,
          disabled: cDisabled,
          theStyle: cTheStyle,
          themeMeta: cThemeMeta,
        } = {},
      } = props;
      const {
        normal = {},
        hover = {},
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
            active: deepMerge(active, cActived),
            disabled: deepMerge(disabled, cDisabled),
            theStyle: deepMerge(theStyle, cTheStyle),
            themeMeta: deepMerge(themeMeta, cThemeMeta),
          }}
          ref={props.innerRef}
          className={getClassName(className, props)}
        />
      );
    };
    CSSComponent2CSSConfig.set(result, cssConfig);
    result.displayName = 'CSSComponent';
    return result;
  }

  const Target = getTargetComponent(styledElement);

  const result = (props: Object) => {
    const {
      normal = {},
      hover = {},
      active = {},
      disabled = {},
      theStyle = {},
      themeMeta = {},
    } = attrsHook(props);
    const {
      _lugia_theme_style_: {
        normal: cNormal,
        hover: cHover,
        active: cActived,
        disabled: cDisabled,
        theStyle: cTheStyle,
        themeMeta: cThemeMeta,
      } = {},
    } = props;
    const targetStyle = deepMerge(
      normal,
      cNormal,
      hover,
      cHover,
      active,
      cActived,
      disabled,
      cDisabled,
      theStyle,
      cTheStyle,
    );
    return (
      <Target
        {...props}
        __themeMeta={deepMerge(themeMeta, cThemeMeta)}
        style={targetStyle}
        ref={props.innerRef}
        className={getClassName(className, props)}
      />
    );
  };
  CSSComponent2CSSConfig.set(result, cssConfig);
  result.displayName = 'CSSComponent';
  return result;
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

const allBorderDirections = ['l', 't', 'r', 'b'];

const borderDirectionMap = {
  l: 'left',
  r: 'right',
  t: 'top',
  b: 'bottom',
};

export function getBorder(
  border: BorderConfig,
  opt?: GetBorderOption = { directions: allBorderDirections },
): BorderType {
  const { directions = allBorderDirections } = opt;

  if (!directions || directions.length === 0) {
    return {};
  }

  const result = {};
  const { radius } = opt;
  if (radius) {
    const { radiusDirections } = opt;
    result.radius = getBorderRadius(radius, radiusDirections);
  }
  return directions.reduce((result: Object, direction: string) => {
    direction = borderDirectionMap[direction];
    if (result[direction]) {
      return result;
    }
    const { color, style, width } = border;
    const borderConfig = {};
    if ('color' in border) {
      borderConfig.color = color;
    }
    if ('style' in border) {
      borderConfig.style = style;
    }
    if ('width' in border) {
      borderConfig.width = width;
    }

    result[direction] = borderConfig;

    return result;
  }, result);
}

const allBorderRadiusDirections = ['tl', 'tr', 'bl', 'br'];

const borderRadiusDirectionMap: { [key: BorderRadiusDirection]: string } = {
  tl: 'topLeft',
  tr: 'topRight',
  bl: 'bottomLeft',
  br: 'bottomRight',
};

export function getBorderRadius(
  radius: string | number,
  directions?: BorderRadiusDirection[] = allBorderRadiusDirections,
): BorderRadiusType {
  return directions.reduce(
    (result: Object, direction: BorderRadiusDirection) => {
      const targetKey = borderRadiusDirectionMap[direction];
      result[targetKey] = radius;
      return result;
    },
    {},
  );
}

export { css, keyframes };
