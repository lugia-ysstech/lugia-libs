/**
 *
 * create by liangguodong on 2018/8/24
 *
 * @flow
 */
import merge from 'deepmerge';

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

export const getKeyfromIndex = (
  data: Array<Object>,
  index: number,
  expKey: string,
): string => {
  let newKey = '';
  data.map((v, i) => {
    if (i === index) {
      newKey =
        v[expKey] !== null && v[expKey] !== undefined ? v[expKey] : '_key_' + i;
    }
  });
  return newKey;
};
export const getIndexfromKey = (
  data: Array<Object>,
  keyName: string,
  keyValue: string,
): number => {
  let index = -99;
  data.find((v, i) => {
    if (v[keyName] === keyValue) {
      index = i;
    }
  });
  return index;
};

export function deepMerge(...objects: Object[]): Object {
  if (!objects || objects.length === 0) {
    return {};
  }

  return objects.reduce((pre: Object, next: Object) => {
    next = next || {};
    return merge(pre, next);
  }, {});
}
