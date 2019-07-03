declare module '@lugia/theme-hoc' {
  declare export type ThemeHocOption = {
    hover?: boolean,
    active?: boolean,
    focus?: boolean,
  };

  declare export type ProviderComponent = React.ComponentType<any>;

  declare export type AddMouseEventOPtionAfterConfig = {
    enter?: boolean, // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
    leave?: boolean, // 鼠标离开 同上
    down?: boolean, // 鼠标点击 同上
    up?: boolean, // 鼠标松开 同上
  };

  declare export type AddMouseEventOption = {
    enter?: Function, // 自定义的鼠标进入事件
    leave?: ?Function, // 同上
    up?: Function, // 同上
    down?: Function, // 同上
    after?: AddMouseEventOPtionAfterConfig, // 是否配置事件触发顺序滞后
  };

  declare export type AddFocusBlurEventOption = {
    enter?: Function, // 自定义的鼠标进入事件
    leave?: ?Function, // 同上
    up?: Function, // 同上
    down?: Function, // 同上
    after?: AddMouseEventOPtionAfterConfig, // 是否配置事件触发顺序滞后
  };

  declare export type AddFocusBlurEventOptionAfterConfig = {
    focus?: boolean, // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
    blur?: boolean, // 鼠标点击 同上
  };

  declare export type MouseEventComponent = {
    props: Object,
  };

  declare export function addMouseEvent(
    self: MouseEventComponent, // 组件的this引用
    opt?: AddMouseEventOption,
  ): Object;

  declare export function addFocusBlurEvent(
    self: MouseEventComponent, // 组件的this引用
    opt?: AddFocusBlurEventOption,
  ): Object;

  declare export default function ThemeHOC(
    target: ProviderComponent,
    widgetName: string,
    opt?: ThemeHocOption,
  ): Function;
}
