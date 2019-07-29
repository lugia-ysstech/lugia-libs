/**
 *
 * create by liangguodong on 2018/8/24
 *
 * @flow
 */
import merge from 'deepmerge';
import isPlainObject from 'is-plain-object';
import type { DeepMergeOption } from '@lugia/object-utils';

export function getAttributeFromObject(
  object: Object,
  attribute: string,
  defaultValue: any,
) {
  return object && object[attribute] !== undefined
    ? object[attribute]
    : defaultValue;
}

export function getKeyfromIndex(
  data: Array<Object>,
  index: number,
  expKey: string,
): string {
  let newKey = '';
  data.forEach((v, i) => {
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
  return data.findIndex(v => v[keyName] === keyValue);
}
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;

export function deepMerge(...objects: Object[]): Object {
  if (!objects || objects.length === 0) {
    return {};
  }

  return objects.reduce((pre: Object, next: Object) => {
    next = next || {};
    return merge(pre, next, { arrayMerge: overwriteMerge });
  }, {});
}

export function deepMergeForArrayMerge(...objects: Object[]): Object {
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

export function isEmptyObject(obj: any) {
  if (obj === null || obj === undefined) {
    return true;
  }
  if (typeof obj !== 'object') {
    return true;
  }
  return Object.keys(obj).length === 0;
}

export function getAttributeValue(obj: Object, path: string[]): any {
  if (!obj) {
    return;
  }
  if (!path || path.length === 0) {
    return;
  }
  let target = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
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
  outResult: Object,
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

export function packPathObject(object: Object): Object {
  const keys = Object.keys(object).sort((a, b) => a.length - b.length);
  const outResult = {};
  keys.forEach(key => {
    const paths = key.split('.');
    const item = object[key];
    setAttributeValue(outResult, paths, item);
  });
  return outResult;
}

export function packObject(path: string[], value: any): Object {
  if (!path || path.length === 0) {
    return {};
  }

  const result = {};
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

export function object2pathObject(obj: Object): Object {
  return object2pathObjectHelper(obj, '');
}

function object2pathObjectHelper(obj: Object, father: string): Object {
  if (!isPlainObject(obj)) {
    return obj;
  }

  let res = {};

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
export function diffABWhenAttrIfExist(objA: Object, objB: Object): string[] {
  const res = [];
  if (!objA || !objB) {
    return res;
  }

  const pathObjectsA = object2pathObject(objA);
  const pathObjectsB = object2pathObject(objB);
  const pathsA = Object.keys(pathObjectsA);
  const pathsB = Object.keys(pathObjectsB);
  const minPath = pathsA.length > pathsB.length ? pathsA : pathsB;

  function isNotEqualSimple(key) {
    const path = key.split('.');
    let valA = pathObjectsA[key] || getAttributeValue(objA, path);
    let valB = pathObjectsB[key] || getAttributeValue(objB, path);
    return valA != undefined && valB != undefined && valA != valB;
  }

  const resObj = {};
  minPath.forEach(key => {
    if (isNotEqualSimple(key)) {
      resObj[key] = true;
    }
  });

  return Object.keys(resObj);
}
