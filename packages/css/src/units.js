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
    footerFontSize = px2Number(getComputedStyle(body)['font-size']);
  }
}

export function px2rem(px: number) {
  return px / footerFontSize;
}

export function rem2em(rem: number, emFontSize: number) {
  return rem / emFontSize;
}

export function px2emcss(emFontSize: number) {
  return (px: number) => `${px2rem(px) / emFontSize}em`;
}

export function px2Number(str: string): number {
  if (!str) {
    return 0;
  }
  if (str.indexOf('px') === -1) {
    return 0;
  }
  return Number(str.replace(/px/g, ''));
}

export function number2px(num: number): string {
  return `${num}px`;
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
