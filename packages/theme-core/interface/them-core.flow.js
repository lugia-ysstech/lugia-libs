declare module '@lugia/theme-core' {
  declare export function getKeys(obj: Object): string[];

  declare export function getObject(obj: Object, key: string): Object;

  declare export function getConfig(
    svThemeConfigTree: Object,
    contextConfig: Object,
    propsConfig: Object,
  ): Object;
}
