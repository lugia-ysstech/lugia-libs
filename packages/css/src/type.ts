export type Color = {
  color: string;
  opacity: number;
  rgb: string;
  rgba: string;
};

export type Point = [number, number];
export type PointStyle = { left?: string; top?: string };
export type SizeType = { width: number; height: number };
export type SizeStyle = { width?: string; height?: string };

export type Units = {
  px2rem(px: number): number;
  px2remcss(px: number): string;
  rem2em(rem: number, emFontSize: number): number;
  px2emcss(emFontSize: number): (px: number) => string;
  px2Number(str: string): number;
  getEmMultipleForRem(fontSize: any): number;
  getFontSize(domNode: Element, defaultFontSize: number): number;
  number2px(num: number): string;
  getSizeByStyle(style: SizeStyle): SizeType;
  size2Style(size: SizeType): SizeStyle;
  getPointByStyle(style: PointStyle): Point;
  point2Style(point: Point): PointStyle;
};

export type RGB = {
  newR: number;
  newG: number;
  newB: number;
};
