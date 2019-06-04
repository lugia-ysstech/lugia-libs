/**
 *
 * create by ligx
 *
 * @flow
 */
import type { Point, SizePos, SizeType, StylePos } from '@lugia/css';

let footerFontSize = 10;

if (typeof document !== 'undefined') {
  const body: Object = document.body;
  if (body) {
    footerFontSize = px2Number(getComputedStyle(body)['font-size']) || 10;
  }
}

export function px2rem(px: number) {
  return px / footerFontSize;
}

export function rem2em(rem: number, emMultipleForRem: number) {
  return rem / emMultipleForRem;
}

export function getEmMultipleForRem(fontSize: any): number {
  const defaulResult = 1;
  if (!fontSize) {
    return defaulResult;
  }
  if (typeof fontSize === 'string' && fontSize.indexOf('rem') !== -1) {
    const rem = rem2Number(fontSize);
    if (rem) {
      return rem;
    }
  }
  const fontNumber = px2Number(fontSize);
  if (!isNaN(fontNumber)) {
    return fontNumber / footerFontSize;
  }
  return defaulResult;
}

export function px2emcss(emMultipleForRem: number) {
  return (px: number) => `${px2rem(px) / emMultipleForRem}em`;
}

export function px2Number(str: string): number {
  return unitString2Number(str, 'px');
}

export function rem2Number(str: string): number {
  return unitString2Number(str, 'rem');
}

export function number2px(num: number): string {
  return number2UnitString(num, 'px');
}

export function number2rem(num: number): string {
  return number2UnitString(num, 'rem');
}

function unitString2Number(str: string, unit: string): number {
  if (!str) {
    return 0;
  }
  if (typeof str !== 'string') {
    return Number(str);
  }
  if (str.indexOf(unit) === -1) {
    return Number(str);
  }
  return Number(str.replace(new RegExp(unit, 'g'), ''));
}

function number2UnitString(num: number, unit: string): string {
  return `${num}${unit}`;
}

export function getSizeByStyle(style: SizePos): SizeType {
  if (!style) {
    return { width: 0, height: 0 };
  }
  const { width, height } = style;
  return { width: px2Number(width), height: px2Number(height) };
}

export function size2Style(size: SizeType): SizePos {
  if (!size) {
    return {};
  }
  const { width, height } = size;
  return {
    width: number2px(width),
    height: number2px(height),
  };
}

export function getPointByStyle(style: StylePos): Point {
  if (!style) {
    return [0, 0];
  }
  const { left, top } = style;
  return [px2Number(left), px2Number(top)];
}

export function point2Style(point: Point): StylePos {
  if (!point) {
    return {};
  }
  const [x, y] = point;
  return {
    left: number2px(x),
    top: number2px(y),
  };
}
