import type { ThemeConfig } from '@lugia/theme-core';
declare module '@lugia/theme-config' {
  declare export type ThemeConfigProps = {
    children: React.Node,
    config: { [key: string]: ThemeConfig },
    className?: string,
  };
  declare export default React.ComponentType<ThemeConfigProps>;
}
