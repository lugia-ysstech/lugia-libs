import { ComponentType } from 'react';
export type ThemeHocOption = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};

export type ProviderComponent = ComponentType<any>;

export type AddMouseEventOptionAfterConfig = {
  enter?: boolean; // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
  leave?: boolean; // 鼠标离开 同上
  down?: boolean; // 鼠标点击 同上
  up?: boolean; // 鼠标松开 同上
};
type AnyFunction = (...rest: any[]) => void;
export type AddMouseEventOption = {
  enter?: AnyFunction; // 自定义的鼠标进入事件
  leave?: AnyFunction; // 同上
  up?: AnyFunction; // 同上
  down?: AnyFunction; // 同上
  after?: AddMouseEventOptionAfterConfig; // 是否配置事件触发顺序滞后
};

export type AddFocusBlurEventOption = {
  enter?: AnyFunction; // 自定义的鼠标进入事件
  leave?: AnyFunction; // 同上
  up?: AnyFunction; // 同上
  down?: AnyFunction; // 同上
  after?: AddMouseEventOptionAfterConfig; // 是否配置事件触发顺序滞后
};

export type AddFocusBlurEventOptionAfterConfig = {
  focus?: boolean; // 鼠标进入 默认false true 先调用props的方法再调用opt里面配置方法
  blur?: boolean; // 鼠标点击 同上
};

export type MouseEventComponent = {
  props: object;
};
