import type {
  BorderRadiusType,
  BorderType,
  ThemeConfig,
  ThemeMeta,
} from '@lugia/theme-core';

declare module '@lugia/theme-css-hoc' {
  // 目前state类型
  declare export type TagType =
    | 'span'
    | 'a'
    | 'input'
    | 'li'
    | 'button'
    | 'img'
    | 'sup'
    | 'div'
    | 'ul'
    | 'i';
  declare export type StateType = 'normal' | 'actived' | 'hover' | 'disabled';
  declare export type ThemeState = {
    actived: boolean,
    disabled: boolean,
    hover: boolean,
  };

  declare export type ThemeProps = {
    themeState: ThemeState,
    themeConfig: ThemeConfig,
    propsConfig: Object,
  };

  declare export type CSSProps = {
    themeProps: ThemeProps,
  };
  declare export type CSSMeta = {
    selectNames?: Array<string[]>, // 默认取全部属性
    getStyle?: (theme: ThemeMeta, themeProps: ThemeProps) => Object,
    getCSS?: (theme: ThemeMeta, themeProps: ThemeProps) => string,
    defaultTheme?: ThemeMeta, // 自己写的样式
  };

  declare export type CSSConfig = {
    tag?: TagType,
    className: string, // 必填属性用来注入一个主题的class类名为CSS样式覆盖留下口子
    extend?: Object,
    css?: any, // 这个是要去 css 模板的写法
    normal?: CSSMeta, // 默认为 {}
    actived?: CSSMeta, // 默认为 {}
    hover?: CSSMeta, // 默认为 {}
    disabled?: CSSMeta, // 默认为 {}
  };

  declare export type BorderConfig = {
    color?: string,
    width?: number,
    style?: string,
  };

  declare export type BorderDirection = 'l' | 'r' | 'b' | 't';
  declare export type BorderRadiusDirection = 'tl' | 'tr' | 'bl' | 'br';
  declare export type GetBorderOption = {
    radius?: number | string,
    directions?: BorderDirection[],
    radiusDirections?: BorderRadiusDirection[],
  };

  declare export function getBorder(
    border: BorderConfig,
    option?: GetBorderOption,
  ): BorderType;

  declare export function getBorderRadius(
    radius: string | number,
    directions?: BorderRadiusDirection[],
  ): BorderRadiusType;

  declare export function StaticComponent(cssConfig: CSSConfig): Function;

  declare export default (cssConfig: CSSConfig) => Function;

  declare export var css: any; // styled keyframes;
  declare export var keyframes: any; // styled keyframes;
}
