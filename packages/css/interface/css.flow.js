declare module '@lugia/css' {
  declare type Color = {
    getColor(
      sHex?: string, // 默认值 '#684fff',
      reduceS?: number, // 默认值  0,
      reduceB?: number, // 默认值  0,
      reduceA?: number, //默认值 100,
    ): Object,
  };

  declare export type Point = [number, number];
  declare export type StylePos = { left: string, top: string };
  declare export type SizePos = { width: string, height: string };
  declare export type SizeType = { width: number, height: number };

  declare type Units = {
    px2rem(px: number): number,
    rem2em(rem: number, emFontSize: number): number,
    px2emcss(emFontSize: number): (px: number) => string,
    px2Number(str: string): number,
    number2px(num: number): string,
    getSizeByStyle(style: SizePos): SizeType,
    size2Style(size: SizeType): SizePos,
    getPointByStyle(style: StylePos): Point,
    point2Style(point: Point): StylePos,
  };

  declare export var color: Color;
  declare export var units: Units;

  declare export function style2css(style: Object): number;
}
