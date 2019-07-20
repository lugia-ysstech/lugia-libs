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

  declare export default {
    getBridge(): Object,

    getReactNodeInfo(id: string): Object,

    getThemeReactNodeInfo(id: string): Object,

    getReactNodeInfoByThemeId(id: string): Object,

    updateDesignHandle(widgetId: string, handle: Object): void,

    deleteDesignHandle(widgetId: string): void,

    getDesignHandle(widgetId: string): Object,

    inject(window: Object): Function,
  };
}
