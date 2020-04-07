/**
 *
 * create by liangguodong on 2018/8/24
 *
 * @flow
 */

import merge, { Options } from 'deepmerge';
import { DeepMergeOption } from './type';

import isPlainObject from 'is-plain-object';

type AnyObject = { [key: string]: any };

export function getAttributeFromObject(
  object: AnyObject,
  attribute: string,
  defaultValue?: any,
) {
  return object && object[attribute] !== undefined
    ? object[attribute]
    : defaultValue;
}

export function getKeyfromIndex(
  data: object[],
  index: number,
  expKey: string,
): string {
  let newKey = '';
  data.forEach((item: AnyObject, i) => {
    if (i === index) {
      newKey =
        item[expKey] !== null && item[expKey] !== undefined
          ? item[expKey]
          : '_key_' + i;
    }
  });
  return newKey;
}

export function getIndexfromKey(
  data: AnyObject[],
  keyName: string,
  keyValue: string,
): number {
  return data.findIndex((v: AnyObject) => v[keyName] === keyValue);
}

const overwriteMerge = (
  destinationArray: any[],
  sourceArray: any[],
  options: Options,
) => sourceArray;

export function deepMerge(...objects: any[]): any {
  if (!objects || objects.length === 0) {
    return {};
  }

  return objects.reduce((pre: any, next: any) => {
    next = next || {};
    return merge(pre, next, { arrayMerge: overwriteMerge });
  }, {});
}

export function deepMergeForArrayMerge<T>(...objects: T[]): Partial<T> {
  if (!objects || objects.length === 0) {
    return {};
  }

  return objects.reduce(
    (pre: T, next: Partial<T>) => {
      next = next || {};
      return merge(pre, next);
    },
    {} as T,
  );
}

export function moveToTargetIfKeyIsInSource(
  key: string,
  source: AnyObject,
  target: AnyObject,
) {
  if (key in source) {
    target[key] = source[key];
    delete source[key];
  }
}

export function deepMergeAnB<T, U>(
  objectA: Partial<T>,
  objectB: Partial<U>,
  opt: DeepMergeOption,
): Partial<T & U> {
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

export function isEmptyObject(obj: any) {
  if (obj === null || obj === undefined) {
    return true;
  }
  if (typeof obj !== 'object') {
    return true;
  }
  return Object.keys(obj).length === 0;
}

export function getAttributeValue(obj: object, path: string[]): any {
  if (!obj) {
    return;
  }
  if (!path || path.length === 0) {
    return;
  }
  let target: any = obj;
  for (const key of path) {
    target = target[key];
    if (target === 0) {
      return target;
    }
    if (!target) {
      return;
    }
  }
  return target;
}

export function setAttributeValue(
  outResult: AnyObject,
  paths: string[],
  val: any,
): void {
  if (!outResult) {
    return;
  }
  if (!paths || paths.length === 0) {
    return;
  }
  const length = paths.length;
  if (length === 0) {
    return;
  }

  const fatherKey = paths[0];

  if (length === 1) {
    outResult[fatherKey] = val;
    return;
  }

  const obj = outResult[fatherKey];
  let father = isPlainObject(obj) ? obj || {} : {};
  outResult[fatherKey] = father;
  for (let i = 1; i < length - 1; i++) {
    const thePath = paths[i];
    let theFather = father[thePath];
    if (!theFather) {
      theFather = father[thePath] = {};
    }

    if (!isPlainObject(father[thePath])) {
      father[thePath] = {};
    }
    father = father[thePath];
  }

  const valKey = paths[length - 1];
  father[valKey] = val;
}

export function packPathObject(object: AnyObject): object {
  const keys = Object.keys(object).sort((a, b) => a.length - b.length);
  const outResult = {};
  keys.forEach(key => {
    const paths = key.split('.');
    const item = object[key];
    setAttributeValue(outResult, paths, item);
  });
  return outResult;
}

export function packObject(path: string[], value: any): object {
  if (!path || path.length === 0) {
    return {};
  }

  const result: AnyObject = {};
  let current = result;

  const lastIndex = path.length - 1;
  path.forEach((key: string, index: number) => {
    if (lastIndex === index) {
      current[key] = value;
    } else {
      current = current[key] = {};
    }
  });

  return result;
}

export function object2pathObject(obj: object): AnyObject {
  return object2pathObjectHelper(obj, '');
}

function object2pathObjectHelper(obj: AnyObject, father: string): AnyObject {
  if (!isPlainObject(obj)) {
    return obj;
  }

  let res: AnyObject = {};

  Object.keys(obj).forEach(key => {
    const val = obj[key];
    const targetKey = father ? `${father}.${key}` : key;
    if (!isPlainObject(val)) {
      res[targetKey] = val;
    } else {
      res = { ...res, ...object2pathObjectHelper(val, targetKey) };
    }
  });
  return res;
}

export function diffABWhenAttrIfExist(objA: object, objB: object): string[] {
  const res: string[] = [];
  if (!objA || !objB) {
    return res;
  }

  const pathObjectsA = object2pathObject(objA);
  const pathObjectsB = object2pathObject(objB);
  const pathsA = Object.keys(pathObjectsA);
  const pathsB = Object.keys(pathObjectsB);
  const minPath = pathsA.length > pathsB.length ? pathsA : pathsB;

  function isNotEqualSimple(key: string) {
    const path = key.split('.');
    const valA = pathObjectsA[key] || getAttributeValue(objA, path);
    const valB = pathObjectsB[key] || getAttributeValue(objB, path);
    return valA !== undefined && valB !== undefined && valA !== valB;
  }

  const resObj: AnyObject = {};
  minPath.forEach(key => {
    if (isNotEqualSimple(key)) {
      resObj[key] = true;
    }
  });

  return Object.keys(resObj);
}
