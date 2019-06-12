declare module '@lugia/theme-hoc' {
  declare export type ThemeHocOption = {
    hover?: boolean,
    active?: boolean,
  };

  declare export type ProviderComponent = React.ComponentType<any>;

  declare export default function ThemeHOC(
    target: ProviderComponent,
    widgetName: string,
    opt?: ThemeHocOption,
  ): Function;
}
