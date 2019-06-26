declare module '@lugia/theme-hoc-devtools' {
  declare export function getBridge(): Object;

  declare export function getReactNodeInfo(id: string): Object;

  declare export function getThemeReactNodeInfo(id: string): Object;

  declare export function getReactNodeInfoByThemeId(id: string): Object;

  declare export function inject(window: Object): Function;
}
