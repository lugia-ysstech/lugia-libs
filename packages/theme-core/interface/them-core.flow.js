declare module '@lugia/theme-core' {
  declare export function getKeys(obj: Object): string[];

  declare export function getObject(obj: Object, key: string): Object;

  declare export function getConfig(
    svThemeConfigTree: Object,
    contextConfig: Object,
    propsConfig: Object,
  ): Object;

  declare export type WidthType = number | string;
  declare export type HeightType = number | string;
  declare export type MarginType = {
    top?: number,
    right?: number,
    bottom?: number,
    left?: number,
  };
  declare export type PaddingType = {
    top?: number,
    right?: number,
    bottom?: number,
    left?: number,
  };

  declare export type BorderInnerType = {
    borderColor?: string,
    borderWidth?: string,
    borderStyle?: string,
  };
  declare export type BorderType = {
    top?: BorderInnerType,
    right?: BorderInnerType,
    bottom?: BorderInnerType,
    left?: BorderInnerType,
  };
  declare export type ColorType = string;
  declare export type OpacityType = number;
  declare export type BackgroundType = {
    backgroundColor?: ColorType,
    backgroundImage?: string,
  };

  declare export type BoxShadowType = string;
  declare export type FontType = {
    fontStyle: string,
    fontWeight: number,
    fontSize: number,
  };
  declare export type FontSizeType = string;
  declare export type BorderRadiusType = string | number;
  declare export type VisibilityType = 'visible' | 'hidden' | 'collapse';
  declare export type CursorType =
    | 'Default'
    | 'Pointer'
    | 'text'
    | 'wait'
    | 'help'
    | 'Auto'
    | 'not-allowed';

  declare export type ThemeMeta = {
    background?: BackgroundType,
    border?: BorderType,
    width?: WidthType,
    height?: HeightType,
    font?: FontType,
    color?: ColorType,
    opacity?: OpacityType,
    margin?: MarginType,
    padding?: PaddingType,
    boxShadow?: BoxShadowType,
    backgroundColor?: ColorType,
    fontSize?: FontSizeType,
    borderRadius?: BorderRadiusType,
    visibility?: VisibilityType,
    cursor?: CursorType,
  };
  declare export type ThemeConfig = {
    normal: ThemeMeta,
    disabled: ThemeMeta,
    actived: ThemeMeta,
    hover: ThemeMeta,
    children: { [childName: string]: ThemeConfig },
  };
}
