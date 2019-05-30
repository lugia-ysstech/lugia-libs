/**
 *
 * create by ligx
 *
 * @flow
 */
import { deepMerge } from '@lugia/object-utils';

export function getKeys(obj: Object): string[] {
  return obj ? Object.keys(obj) : [];
}

export function getObject(obj: Object, key: string): Object {
  return obj && key ? obj[key] : {};
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
