/**
 *
 * create by ligx
 *
 * @flow
 */
import merge from 'deepmerge';

export function getKeys(obj: Object) {
  return obj ? Object.keys(obj) : [];
}

export function getObject(obj: Object, key: string) {
  return obj && key ? obj[key] : {};
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

// eslint-disable-next-line max-len
export function getConfig(
  svThemeConfigTree: Object,
  contextConfig: Object,
  propsConfig: Object,
): Object {
  const allKeys = new Set([
    ...getKeys(svThemeConfigTree),
    ...getKeys(contextConfig),
    ...getKeys(propsConfig),
  ]);

  const result = {};
  allKeys.forEach(key => {
    result[key] = deepMerge(
      {},
      getObject(svThemeConfigTree, key),
      getObject(contextConfig, key),
      getObject(propsConfig, key),
    );
  });
  return result;
}
