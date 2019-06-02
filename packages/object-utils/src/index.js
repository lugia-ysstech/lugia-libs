/**
 *
 * create by liangguodong on 2018/8/24
 *
 * @flow
 */
import merge from 'deepmerge';
import type { DeepMergeOption } from '@lugia/object-utils';

export function getAttributeFromObject(
  object: Object,
  attribute: string,
  defaultValue: any,
) {
  const attributeValue =
    object && object[attribute] !== undefined
      ? object[attribute]
      : defaultValue;
  return attributeValue;
}

export function getKeyfromIndex(
  data: Array<Object>,
  index: number,
  expKey: string,
): string {
  let newKey = '';
  data.map((v, i) => {
    if (i === index) {
      newKey =
        v[expKey] !== null && v[expKey] !== undefined ? v[expKey] : '_key_' + i;
    }
  });
  return newKey;
}

export function getIndexfromKey(
  data: Array<Object>,
  keyName: string,
  keyValue: string,
): number {
  let index = -99;
  data.find((v, i) => {
    if (v[keyName] === keyValue) {
      index = i;
    }
  });
  return index;
}

export function deepMerge(...objects: Object[]): Object {
  if (!objects || objects.length === 0) {
    return {};
  }

  return objects.reduce((pre: Object, next: Object) => {
    next = next || {};
    return merge(pre, next);
  }, {});
}

export function moveToTargetIfKeyIsInSource(
  key: string,
  source: Object,
  target: Object,
) {
  if (key in source) {
    target[key] = source[key];
    delete source[key];
  }
}

export function deepMergeAnB(
  objectA: Object,
  objectB: Object,
  opt: DeepMergeOption,
): Object {
  const { beforeNames } = opt;

  if (!objectA && !objectB) {
    return {};
  }

  objectA = deepMerge({}, objectA) || {};
  objectB = deepMerge({}, objectB) || {};

  const beforeResultA = {};
  const beforeResultB = {};

  beforeNames &&
    beforeNames.forEach((key: string) => {
      moveToTargetIfKeyIsInSource(key, objectA, beforeResultA);
      moveToTargetIfKeyIsInSource(key, objectB, beforeResultB);
    });

  const beforeResult = deepMerge(beforeResultA, beforeResultB);
  const target = {};
  beforeNames &&
    beforeNames.forEach((key: string) => {
      moveToTargetIfKeyIsInSource(key, beforeResult, target);
    });
  return deepMerge(target, objectA, objectB);
}
