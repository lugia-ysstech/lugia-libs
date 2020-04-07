export type SizeType = number | string;
export type WidthType = number | string;
export type HeightType = number | string;
export type MarginType = {
  top?: SizeType;
  right?: SizeType;
  bottom?: SizeType;
  left?: SizeType;
};
export type PaddingType = {
  top?: SizeType;
  right?: SizeType;
  bottom?: SizeType;
  left?: SizeType;
};

export type BorderInnerType = {
  color?: string;
  width?: number;
  style?: string;
};

export type BorderRadiusType = {
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
};

export type BorderType = {
  top?: BorderInnerType;
  right?: BorderInnerType;
  bottom?: BorderInnerType;
  left?: BorderInnerType;
};

export type ColorType = string;
export type OpacityType = number;
export type BackgroundType = {
  color?: ColorType;
  image?: string;
  origin?: string;
  positionX?: string;
  positionY?: string;
  repeatX?: string;
  repeatY?: string;
  size?: string;
  clip?: string;
};

export type BoxShadowType = {
  x: number;
  y: number;
  color?: string;
  type?: 'outset' | 'inset';
  blur?: number;
  spread?: number;
};

export type FontType = {
  style: string;
  weight: number;
  size: number;
  family: string;
};
export type FontSizeType = string | number;
export type VisibilityType = 'visible' | 'hidden' | 'collapse';
export type CursorType =
  | 'Default'
  | 'Pointer'
  | 'text'
  | 'wait'
  | 'help'
  | 'Auto'
  | 'not-allowed';

export type PositionEnum = 'absolute' | 'relative';

export type PositionType = {
  left?: number | string;
  top?: number | string;
  right?: number | string;
  type?: PositionEnum;
  bottom?: number | string;
};
export type OverFlowType = 'hidden' | 'visible' | 'scroll' | 'auto' | 'clip';
export type SimpleThemeMeta = {
  background?: BackgroundType;
  border?: BorderType;
  borderRadius?: BorderRadiusType;
  width?: WidthType;
  lineHeight?: SizeType;
  height?: HeightType;
  font?: FontType;
  color?: ColorType;
  opacity?: OpacityType;
  margin?: MarginType;
  position?: PositionType;
  padding?: PaddingType;
  boxShadow?: BoxShadowType;
  backgroundColor?: ColorType;
  fontSize?: FontSizeType;
  visibility?: VisibilityType;
  cursor?: CursorType;
  overflow?: OverFlowType;
};
export type DynamicThemeMega = {
  getCSS?: (theme: ThemeMeta, themeProps: CSSThemeProps) => string;
  getThemeMeta?: (theme: ThemeMeta, themeProps: CSSThemeProps) => ThemeMeta;
};
type SelectorConfig = {
  first?: SimpleThemeMeta;
  last?: SimpleThemeMeta;
  odd?: SimpleThemeMeta;
  even?: SimpleThemeMeta;
};
export type ThemeMeta = SimpleThemeMeta & SelectorConfig & DynamicThemeMega;

export type ThemePart = {
  normal?: ThemeMeta;
  disabled?: ThemeMeta;
  active?: ThemeMeta;
  hover?: ThemeMeta;
  focus?: ThemeMeta;
  __partName?: string;
  __index?: number;
  __count?: number;
};

export type ThemeComponentConfig = {
  [viewClassOrWidgetName: string]: ThemeConfig;
};

export type ThemeConfig = {
  __partName?: string;
} & {
  [partName: string]: ThemePart;
};

export type AddMouseEventOPtionAfterConfig = {
  enter?: boolean; // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
  leave?: boolean; // 鼠标离开 同上
  down?: boolean; // 鼠标点击 同上
  up?: boolean; // 鼠标松开 同上
};
export type AnyFunction = (...rest: any[]) => void;
export type AddMouseEventOption = {
  enter?: AnyFunction; // 自定义的鼠标进入事件
  leave?: AnyFunction; // 同上
  up?: AnyFunction; // 同上
  down?: AnyFunction; // 同上
  after?: AddMouseEventOPtionAfterConfig; // 是否配置事件触发顺序滞后
};

export type ThemeState = {
  active?: boolean;
  disabled?: boolean;
  hover?: boolean;
  focus?: boolean;
};
export type OnLugia = (name: string, cb: (...rest: any[]) => void) => void;
export type CSSThemeProps = {
  onLugia?: OnLugia;
  themeState?: ThemeState;
  themeConfig?: ThemePart;
  propsConfig?: object;
};
export type ThemeProps = {
  themeState?: ThemeState;
  themeConfig?: ThemePart;
  propsConfig?: object;
};
export type AddFocusBlurEventOption = {
  enter?: AnyFunction; // 自定义的鼠标进入事件
  leave?: AnyFunction; // 同上
  up?: AnyFunction; // 同上
  down?: AnyFunction; // 同上
  after?: AddMouseEventOPtionAfterConfig; // 是否配置事件触发顺序滞后
};

export type AddFocusBlurEventOptionAfterConfig = {
  focus?: boolean; // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
  blur?: boolean; // 鼠标点击 同上
};

export type MouseEventComponent = {
  props: object;
};

export type ThemeStateEventOptions = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};
