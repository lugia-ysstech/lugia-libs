/**
 *
 * create by ligx
 *
 * @flow
 */
import {
  BorderConfig,
  BorderDirection,
  BorderRadiusDirection,
  BorderRadiusType,
  BorderType,
  BoxShadowType,
  GetBorderOption,
} from './type';

import { units } from '@lugia/css';
import { existDict, getDict } from '@lugia/dict';

const { px2Number } = units;
const allBorderDirections: BorderDirection[] = ['l', 't', 'r', 'b'];

const borderDirectionMap = {
  l: 'left',
  r: 'right',
  t: 'top',
  b: 'bottom',
};

export function getDictValue(value: any) {
  if (!value || typeof value !== 'string') {
    return value;
  }
  if (value.startsWith('$lugia-dict')) {
    const dictConfig = value.split('.');
    if (dictConfig.length >= 3) {
      const dictName = dictConfig[1];
      const keyValue = dictConfig.slice(2).join('.');
      if (!existDict(dictName)) {
        return undefined;
      }
      const dict = getDict(dictName);
      return dict.get(keyValue);
    }
  }
  return value;
}

export function getBorder(
  border: BorderConfig | string,
  opt: GetBorderOption = { directions: allBorderDirections },
): BorderType {
  const { directions = allBorderDirections } = opt;

  if (!directions || directions.length === 0) {
    return {};
  }
  const result = {};
  const theBorder = getDictValue(border);

  return directions.reduce((outResult: object, direction: string) => {
    direction = borderDirectionMap[direction];
    if (outResult[direction]) {
      return outResult;
    }
    const { color, style, width } = theBorder;
    const borderConfig: BorderConfig = {};
    if ('color' in theBorder) {
      borderConfig.color = getDictValue(color);
    }
    if ('style' in theBorder) {
      borderConfig.style = style;
    }
    if ('width' in theBorder) {
      borderConfig.width = width;
    }

    outResult[direction] = borderConfig;

    return outResult;
  }, result);
}

const allBorderRadiusDirections: BorderRadiusDirection[] = [
  'tl',
  'tr',
  'bl',
  'br',
];
type BorderRadiusDirectionMap = {
  tl: string;
  tr: string;
  bl: string;
  br: string;
};
const borderRadiusDirectionMap: BorderRadiusDirectionMap = {
  tl: 'topLeft',
  tr: 'topRight',
  bl: 'bottomLeft',
  br: 'bottomRight',
};

export function getBorderRadius(
  radius: string | number,
  directions: BorderRadiusDirection[] = allBorderRadiusDirections,
): BorderRadiusType {
  const theRadius = getDictValue(radius);
  return directions.reduce(
    (result: object, direction: BorderRadiusDirection) => {
      const targetKey = borderRadiusDirectionMap[direction];
      result[targetKey] = theRadius;
      return result;
    },
    {},
  );
}

export function getBoxShadow(shadowStr: string): object {
  if (!shadowStr) {
    return {};
  }

  let shadow = getDictValue(shadowStr);
  const rgbIndex = shadow.toUpperCase().indexOf('RGB');
  let color = '';

  if (rgbIndex !== -1) {
    color = shadow.substr(rgbIndex);
    shadow = shadow.substr(0, rgbIndex);
  }

  const config = shadow.split(' ').filter(str => str !== '');
  let type = 'outset';
  if (config[0].toUpperCase() === 'INSET') {
    type = 'inset';
    config.splice(0, 1);
  }
  const [x, y, blur, spread] = config;
  if (!color && config.length > 2) {
    color = config[config.length - 1];
  }
  const vX = px2Number(x);
  const vY = px2Number(y);
  if (isNaN(vX) || isNaN(vY)) {
    return {
      x: 0,
      y: 0,
      blur: 0,
      spread: 0,
      color: '',
      type: '',
    };
  }
  return {
    x: px2Number(x) || 0,
    y: px2Number(y) || 0,
    blur: px2Number(blur) || 0,
    spread: px2Number(spread) || 0,
    color,
    type,
  };
}

export function getBoxShadowCSS(boxConfig: BoxShadowType): string {
  if (typeof boxConfig === 'string') {
    if (boxConfig === 'none') {
      return 'none';
    }
  }

  const { x, y, blur = 0, spread = 0, color = '' } = boxConfig;
  let { type = 'outset' } = boxConfig;
  if (type !== 'inset') {
    type = '';
  }
  return `${type} ${x}px ${y}px ${blur}px ${spread}px ${color}`.trim();
}

export { existDict, getDict };
