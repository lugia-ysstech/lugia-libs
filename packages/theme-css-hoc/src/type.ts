import {
  CSSThemeProps,
  DynamicThemeMega,
  ThemeMeta,
  ThemeProps,
} from '@lugia/theme-core/lib/type';
import { MutableRefObject } from 'react';

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
  normal: StyleType;
  hover: StyleType;
  focus: StyleType;
  active: StyleType;
  disabled: StyleType;
  styleInCSSConfig: StyleType;
  themeMeta: StyleType;
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
type CSSExtend = {
  __OrginalWidget__: any;
};
export type CSSConfig = {
  tag?: string;
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
