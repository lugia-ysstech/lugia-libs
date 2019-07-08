/**
 *
 * create by ligx
 *
 * @flow
 */
import type { ThemeMeta } from '@lugia/theme-core';
import type { CSSConfig, StateType } from '@lugia/theme-css-hoc';
import { always } from '@lugia/ramada';
import {
  deepMerge,
  getAttributeFromObject,
  getAttributeValue,
  packObject,
  isEmptyObject,
} from '@lugia/object-utils';
import { units } from '@lugia/css';
import { getBoxShadowCSS } from '@lugia/theme-utils';

import { Active, Disabled, Focus, Hover } from '../consts';

const { px2remcss } = units;

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

export function getBorderStyleFromTheme(border: Object) {
  if (border === 'none') {
    return {
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    };
  }

  if (isEmptyObject(border)) {
    return {};
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

export function getBorderRadius(borderRadius: Object): Object {
  const style = {};

  if (isEmptyObject(borderRadius)) {
    return style;
  }
  const { topLeft, topRight, bottomLeft, bottomRight } = borderRadius;

  function setBorderRadiusIfExist(key: string, target: Object) {
    setObjectValueIfValueExist(style, key, target, getSizeFromTheme);
  }

  setBorderRadiusIfExist('borderTopLeftRadius', topLeft);
  setBorderRadiusIfExist('borderTopRightRadius', topRight);
  setBorderRadiusIfExist('borderBottomRightRadius', bottomRight);
  setBorderRadiusIfExist('borderBottomLeftRadius', bottomLeft);
  return style;
}

export function getStringStyleFromTheme(stringStyle: string) {
  return stringStyle && typeof stringStyle === 'string' ? stringStyle : '';
}

export function getNumberStyleFromTheme(numberStyle: number) {
  return numberStyle && typeof numberStyle === 'number' ? numberStyle : 0;
}

export function themeMeta2Style(theme: ThemeMeta): Object {
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

export function getFont(font: any) {
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

// TODO: postion repea 错误
export function getBackGround(background: any) {
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

export function getPosition(position: Object): Object {
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

export function translateToCSStyle(
  cssConfig: CSSConfig,
  stateType: StateType,
): (themeMeta: ThemeMeta) => Object {
  const getThemeMetaByConfig = getThemeMeta(cssConfig, stateType);
  return (themeMeta: ThemeMeta) => {
    return themeMeta2Style(getThemeMetaByConfig(themeMeta));
  };
}
