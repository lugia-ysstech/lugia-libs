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

const NthExp = /^nth[1-9]\d*|0$/;
const First = 'first';
const Last = 'last';
const Odd = 'odd';
const Even = 'even';
const Nth = 'nth';
const Selector = [First, Last, Odd, Even];

export function filterSelector(obj: any): string[] {
  if (!obj) {
    return [];
  }
  const result = Selector.filter(key => {
    return key in obj;
  });

  const nths = Object.keys(obj)
    .filter(key => {
      return key.startsWith(Nth);
    })
    .filter(key => {
      return NthExp.test(key);
    });

  return [...result, ...nths];
}

export function getMatchSelector(
  selectors: string[],
  index: number,
  total: number,
): string[] {
  const result = [];
  if (index < 0 || total < 0 || index >= total) {
    return result;
  }

  function pushIfInclude(name: string) {
    if (selectors.includes(name)) {
      result.push(name);
    }
  }

  const seq = index + 1;
  if (seq % 2 === 0) {
    pushIfInclude(Even);
  } else {
    pushIfInclude(Odd);
  }
  if (index === 0) {
    pushIfInclude(First);
  }

  if (index === total - 1) {
    pushIfInclude(Last);
  }

  pushIfInclude(`${Nth}${index}`);

  return result;
}

export function selectThemeMeta(
  themePart: Object,
  index: number,
  total: number,
): Object {
  if (!themePart) {
    return {};
  }
  const selectors = filterSelector(themePart);
  const matchSelectors = getMatchSelector(selectors, index, total);

  let res = { ...themePart };
  selectors.forEach(key => {
    const matchResult = res[key];
    if (matchSelectors.includes(key)) {
      res = deepMerge(res, matchResult);
    }
  });
  return res;
}

export function selectThemePart(
  themePart: Object,
  index: number,
  total: number,
): Object {
  if (!themePart) {
    return {};
  }
  const result = { ...themePart };

  function selectorIfExisitState(stateType: string) {
    if (stateType in themePart) {
      result[stateType] = selectThemeMeta(result[stateType], index, total);
    }
  }

  selectorIfExisitState('normal');
  selectorIfExisitState('hover');
  selectorIfExisitState('disabled');
  selectorIfExisitState('active');
  result.__index = index;
  result.__count = total;
  return result;
}
export const CSSComponentDisplayName = 'lugia_c_t';
export const ThemeComponentPrefix = 'lugia_t_hoc_';
