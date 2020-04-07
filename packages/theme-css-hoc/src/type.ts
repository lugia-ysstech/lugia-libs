import {
  CSSThemeProps,
  DynamicThemeMega,
  ThemeMeta,
} from '@lugia/theme-core/lib/type';
import { ComponentType, ElementType, MutableRefObject } from 'react';
import { AnyStyledComponent } from 'styled-components';

export type StateType = 'normal' | 'active' | 'hover' | 'disabled' | 'focus';
export type TranslateFunction = (
  themeMeta: ThemeMeta,
  themeProps: CSSThemeProps,
) => object;
export type TranslateCSSFunction = (
  themeMeta: ThemeMeta,
  themeProps: CSSThemeProps,
) => string;

export type StyleType = {
  [style: string]: any;
};
export type ThemeStyle = {
  normal?: StyleType;
  hover?: StyleType;
  focus?: StyleType;
  active?: StyleType;
  disabled?: StyleType;
  styleInCSSConfig?: StyleType;
  themeMeta?: State2ThemeMeta;
};
export type CSSProps = {
  disabled?: boolean;
  themeProps: CSSThemeProps;
  innerRef?: MutableRefObject<any>;
};
type Names = string[];
export type CSSMeta = {
  selectNames?: Names[]; // 默认取全部属性
  getStyle?: (theme: ThemeMeta, themeProps: CSSThemeProps) => object;
  getCSS?: (theme: ThemeMeta, themeProps: CSSThemeProps) => string;
  defaultTheme?: ThemeMeta; // 自己写的样式
} & DynamicThemeMega;

export type CSSHocOption = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};
type CSSExtend = (
  | ComponentType<any>
  | ElementType<any>
  | AnyStyledComponent) & {
  __OrginalWidget__: any;
};
export type CSSConfig = {
  tag?: keyof JSX.IntrinsicElements;
  className: string; // 必填属性用来注入一个主题的class类名为CSS样式覆盖留下口子
  extend?: CSSExtend;
  css?: any; // 这个是要去 css 模板的写法
  normal?: CSSMeta; // 默认为 {}
  active?: CSSMeta; // 默认为 {}
  hover?: CSSMeta; // 默认为 {}
  focus?: CSSMeta; // 默认为 {}
  disabled?: CSSMeta; // 默认为 {}
  option?: CSSHocOption;
};
export type ThemeMetaGetter = (themeMeta: ThemeMeta) => ThemeMeta;
export type StateType2Getter = {
  normal: ThemeMetaGetter;
  active: ThemeMetaGetter;
  hover: ThemeMetaGetter;
  disabled: ThemeMetaGetter;
  focus: ThemeMetaGetter;
};
export type ThemeObjectItem = ThemeMeta & CSSMeta;
export type State2ThemeMeta = {
  normal?: ThemeObjectItem;
  active?: ThemeObjectItem;
  hover?: ThemeObjectItem;
  disabled?: ThemeObjectItem;
  focus?: ThemeObjectItem;
  current?: ThemeObjectItem;
};
export type ThemeObject = {
  themeMeta?: State2ThemeMeta;
} & State2ThemeMeta;
