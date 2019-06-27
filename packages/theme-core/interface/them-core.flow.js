declare module '@lugia/theme-core' {
  declare export function selectThemePart(
    themePart: Object,
    index: number,
    total: number,
  ): Object;

  declare export function filterSelector(obj: any): string[];

  declare export var CSSComponentDisplayName: string;
  declare export var ThemeComponentPrefix: string;

  declare export function getKeys(obj: Object): string[];

  declare export function getObject(obj: Object, key: string): Object;

  declare export function getConfig(
    svThemeConfigTree: Object,
    contextConfig: Object,
    propsConfig: Object,
  ): Object;

  declare export type SizeType = number | string;
  declare export type WidthType = number | string;
  declare export type HeightType = number | string;
  declare export type MarginType = {
    top?: SizeType,
    right?: SizeType,
    bottom?: SizeType,
    left?: SizeType,
  };
  declare export type PaddingType = {
    top?: SizeType,
    right?: SizeType,
    bottom?: SizeType,
    left?: SizeType,
  };

  declare export type BorderInnerType = {
    color?: string,
    width?: number,
    style?: string,
  };

  declare export type BorderRadiusType = {
    topLeft?: number,
    topRight?: number,
    bottomLeft?: number,
    bottomRight?: number,
  };

  declare export type BorderType = {
    top?: BorderInnerType,
    right?: BorderInnerType,
    bottom?: BorderInnerType,
    left?: BorderInnerType,
    radius?: BorderRadiusType,
  };

  declare export type ColorType = string;
  declare export type OpacityType = number;
  declare export type BackgroundType = {
    color?: ColorType,
    image?: string,
    origin?: string,
    positionX?: string,
    positionY?: string,
    repeatX?: string,
    repeatY?: string,
    size?: string,
    clip?: string,
  };

  declare export type BoxShadowType = {
    x: number,
    y: number,
    color?: string,
    type?: 'outset' | 'inset',
    blur?: number,
    spread?: number,
  };

  declare export type FontType = {
    style: string,
    weight: number,
    size: number,
    family: string,
  };
  declare export type FontSizeType = string | number;
  declare export type VisibilityType = 'visible' | 'hidden' | 'collapse';
  declare export type CursorType =
    | 'Default'
    | 'Pointer'
    | 'text'
    | 'wait'
    | 'help'
    | 'Auto'
    | 'not-allowed';

  declare export type PositionType = 'absolute' | 'relative';
  declare export type Position = {
    left?: number,
    top?: number,
    right?: number,
    type: PositionType,
    bottom?: number,
  };
  declare export type SimpleThemeMeta = {
    background?: BackgroundType,
    border?: BorderType,
    width?: WidthType,
    lineHeight?: SizeType,
    height?: HeightType,
    font?: FontType,
    color?: ColorType,
    opacity?: OpacityType,
    margin?: MarginType,
    position?: Position,
    padding?: PaddingType,
    boxShadow?: BoxShadowType,
    backgroundColor?: ColorType,
    fontSize?: FontSizeType,
    visibility?: VisibilityType,
    cursor?: CursorType,
  };

  declare export type ThemeMeta = SimpleThemeMeta & {
    first?: SimpleThemeMeta,
    last?: SimpleThemeMeta,
    odd?: SimpleThemeMeta,
    even?: SimpleThemeMeta,
  };

  declare export type ThemePart = {
    normal: ThemeMeta,
    disabled: ThemeMeta,
    active: ThemeMeta,
    hover: ThemeMeta,
  };

  declare export type ThemeConfig = {
    [partName: string]: ThemePart,
  };
}
