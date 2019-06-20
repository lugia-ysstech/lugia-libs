declare module '@lugia/theme-hoc' {
  declare export type ThemeHocOption = {
    hover?: boolean,
    active?: boolean,
  };

  declare export type ProviderComponent = React.ComponentType<any>;

  declare export type AddMouseEventOPtionAfterConfig = {
    enter?: boolean,
    leave?: boolean,
    down?: boolean,
    up?: boolean,
  };

  declare export type AddMouseEventOption = {
    enter?: Function,
    leave?: ?Function,
    up?: Function,
    down?: Function,
    after?: AddMouseEventOPtionAfterConfig,
  };

  declare export function addMouseEvent(
    self: Object,
    opt?: AddMouseEventOption,
  ): Object;

  declare export default function ThemeHOC(
    target: ProviderComponent,
    widgetName: string,
    opt?: ThemeHocOption,
  ): Function;
}
