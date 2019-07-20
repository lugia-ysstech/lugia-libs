declare module '@lugia/theme-hoc-devtools' {
  declare export function getBridge(): Object;

  declare export function getReactNodeInfo(id: string): Object;

  declare export function getThemeReactNodeInfo(id: string): Object;

  declare export function getReactNodeInfoByThemeId(id: string): Object;

  declare export function updateDesignHandle(
    widgetId: string,
    handle: Object,
  ): void;

  declare export function deleteDesignHandle(widgetId: string): void;
  declare export function getDesignHandle(widgetId: string): Object;

  declare export function inject(window: Object): Function;
}
