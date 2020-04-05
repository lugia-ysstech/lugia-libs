/**
 *
 * create by ligx
 *
 * @flow
 */
import { AnyFunction, ThemeConfig, ThemeStateEventOptions } from './type';

import { deepMerge } from '@lugia/object-utils';

export function getKeys(obj: object): string[] {
  return obj ? Object.keys(obj) : [];
}

export function getObject(obj: object, key: string): object {
  return obj && key ? obj[key] : {};
}

// eslint-disable-next-line max-len
export function getConfig(
  svThemeConfigTree: object,
  contextConfig: object,
  propsConfig: object,
): object {
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
  const result: string[] = [];
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
  themePart: object,
  index: number,
  total: number,
): object {
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
  themePart: object,
  index: number,
  total: number,
): ThemeConfig {
  if (!themePart) {
    return {};
  }
  const result: ThemeConfig = { ...themePart };

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

type AddEventObject = {
  after: { [key: string]: boolean };
};

type EventObject = {
  [functionName: string]: AnyFunction;
};
type CompoentInstance = {
  props: { [propsName: string]: any };
};
type EventMethod = {
  [methoName: string]: AnyFunction;
};
export function createAddEventObject(optionNames: object) {
  const resultFunction = function(
    self: CompoentInstance,
    eventMethods: EventMethod = {},
    option: AddEventObject = { after: {} },
  ): EventObject {
    const result = {};

    if (!self) {
      return result;
    }
    const { props } = self;
    if (!props) {
      return result;
    }

    const { after = {} } = option;
    Object.keys(optionNames).forEach((name: string) => {
      const { [name]: cb } = props;
      const optName = optionNames[name];
      const { [optName]: optCb } = eventMethods;

      if (cb || optCb) {
        const cbs: AnyFunction[] = [];
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
          cbs.forEach(cbFunc => cbFunc(...rest));
        };
      }
    });

    return result;
  };
  resultFunction.__optionNames__ = optionNames;
  return resultFunction;
}

type ThemeStateEvent = {
  onMouseDown?: AnyFunction;
  onMouseUp?: AnyFunction;
  onMouseEnter?: AnyFunction;
  onMouseLeave?: AnyFunction;
  onFocus?: AnyFunction;
  onBlur?: AnyFunction;
};

export function injectThemeStateEvent(
  option: ThemeStateEventOptions,
  handle?: ThemeStateEvent,
) {
  const themeStateEventConfig: ThemeStateEvent = {};

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
