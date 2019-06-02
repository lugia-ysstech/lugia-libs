import { DeepMergeOption } from '@lugia/object-utils';

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
}
