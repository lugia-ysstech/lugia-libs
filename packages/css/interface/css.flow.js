declare module '@lugia/css' {
  declare type Units = {
    px2rem(px: number): number,
    rem2em(rem: number, emFontSize: number): number,
    px2emcss(emFontSize: number): (px: number) => string,
  };

  declare class ExportType {
    getColor(
      sHex?: string, // 默认值 '#684fff',
      reduceS?: number, // 默认值  0,
      reduceB?: number, // 默认值  0,
      reduceA?: number, //默认值 100,
    ): Object;
    units: Units;
  }

  declare export default typeof ExportType;
}
