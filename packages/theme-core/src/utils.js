/**
 *
 * create by ligx
 *
 * @flow
 */
import type { ThemeStateEventOptions } from '@lugia/lugia-core';

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

  const nthKeys = Object.keys(obj)
    .filter(key => {
      return key.startsWith(Nth);
    })
    .filter(key => {
      return NthExp.test(key);
    });

  return [...result, ...nthKeys];
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

  function selectorIfExistState(stateType: string) {
    if (stateType in themePart) {
      result[stateType] = selectThemeMeta(result[stateType], index, total);
    }
  }

  selectorIfExistState('normal');
  selectorIfExistState('hover');
  selectorIfExistState('disabled');
  selectorIfExistState('active');
  selectorIfExistState('focus');
  result.__index = index;
  result.__count = total;
  return result;
}

export const CSSComponentDisplayName = 'lugia_css_hoc_c';
export const CSSComponentContainerDisplayName = 'lugia_css_hoc_f';
export const ThemeComponentPrefix = 'lugia_t_hoc_';

export const addMouseEvent = createAddEventObject({
  onMouseDown: 'down',
  onMouseUp: 'up',
  onMouseEnter: 'enter',
  onMouseLeave: 'leave',
});
export const addFocusBlurEvent = createAddEventObject({
  onFocus: 'focus',
  onBlur: 'blur',
});

export function createAddEventObject(optionNames: Object) {
  const result = function(self: Object, opt?: Object = { after: {} }): Object {
    const result = {};

    if (!self) {
      return result;
    }

    const { props } = self;
    if (!props) {
      return result;
    }

    const { after = {} } = opt;

    Object.keys(optionNames).forEach((name: string) => {
      const { [name]: cb } = props;
      const optName = optionNames[name];
      const { [optName]: optCb } = opt;

      if (cb || optCb) {
        const cbs = [];
        if (cb) {
          cbs.push(cb);
        }
        if (optCb) {
          const { [optName]: isAfter } = after;
          if (isAfter) {
            cbs.push(optCb);
          } else {
            cbs.unshift(optCb);
          }
        }
        result[name] = (...rest: any[]) => {
          cbs.forEach(cb => cb(...rest));
        };
      }
    });

    return result;
  };
  result.__optionNames__ = optionNames;
  return result;
}

export function injectThemeStateEvent(
  option: ThemeStateEventOptions,
  handle: Object,
) {
  const themeStateEventConfig = {};

  if (!option || !handle) {
    return themeStateEventConfig;
  }
  const { hover = false, active = false, focus = false } = option;

  if (active) {
    themeStateEventConfig.onMouseDown = handle.onMouseDown;
    themeStateEventConfig.onMouseUp = handle.onMouseUp;
  }
  if (hover) {
    themeStateEventConfig.onMouseEnter = handle.onMouseEnter;
    themeStateEventConfig.onMouseLeave = handle.onMouseLeave;
  }
  if (focus) {
    themeStateEventConfig.onFocus = handle.onFocus;
    themeStateEventConfig.onBlur = handle.onBlur;
  }
  return themeStateEventConfig;
}

export function hasThemeStateEvent(option: ThemeStateEventOptions) {
  const { hover = false, active = false, focus = false } = option;
  return hover === true || active === true || focus === true;
}
