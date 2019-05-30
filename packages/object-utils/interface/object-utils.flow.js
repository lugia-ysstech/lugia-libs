declare module '@lugia/object-utils' {
  declare export function getAttributeFromObject(
    object: Object,
    attribute: string,
    defaultValue: any,
  ): any;

  declare export function getKeyfromIndex(
    data: Array<Object>,
    index: number,
    expKey: string,
  ): string;

  declare export function getIndexfromKey(
    data: Array<Object>,
    keyName: string,
    keyValue: string,
  ): number;

  declare export function deepMerge(...objects: Object[]): Object;
}
