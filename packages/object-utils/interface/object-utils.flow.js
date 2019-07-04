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

  declare export type DeepMergeOption = {
    beforeNames: string[],
  };

  declare export function deepMergeAnB(
    objectA: Object,
    objectB: Object,
    opt: DeepMergeOption,
  ): Object;

  declare export function moveToTargetIfKeyIsInSource(
    key: string,
    source: Object,
    target: Object,
  ): void;

  declare export function deepMerge(...objects: Object[]): Object;

  declare export function isEmptyObject(obj: any): boolean;

  declare export function getAttributeValue(obj: Object, path: string[]): any;

  declare export function packObject(path: string[], value: any): Object;
}
