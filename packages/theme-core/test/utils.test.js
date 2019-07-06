/**
 * Created Date: Friday, September 28th 2018, 3:43:11 pm
 * Author: hanjingbo@ysstech.com | jingboup@gmail.com
 * -----
 * Last Modified: Thursday, May 23rd 2019, 6:38:45 pm
 * Modified By: hanjingbo <hanjingbo@ysstech.com | jingboup@gmail.com>
 * -----
 * Copyright (c) 2018-present, #Lugia#.
 * ------------------------------------
 * JavaScript will save your soul!
 */

import {
  addFocusBlurEvent,
  addMouseEvent,
  createAddEventObject,
  filterSelector,
  getConfig,
  getKeys,
  getMatchSelector,
  getObject,
  hasThemeStateEvent,
  injectThemeStateEvent,
  selectThemeMeta,
  selectThemePart,
} from '../src/utils';

const emptyObject: Object = null;
describe('theme-core-utils', () => {
  function getParam(param: any) {
    return { param };
  }
  it('getConfig', () => {
    const result = {
      a: {
        normal: {
          border: {
            bottom: {
              borderBottomColor: 'red',
            },
            top: {
              borderBottomColor: 'red',
            },
          },
        },
      },
      b: {
        hover: {
          background: {
            backgroundColor: 'yellow',
          },
          border: {
            bottom: {
              borderBottomWidth: 5,
            },
          },
        },
      },
      c: {
        disabled: {
          background: 'ylll',
        },
      },
    };

    expect(
      getConfig(
        {
          a: {
            normal: {
              border: {
                top: { borderBottomColor: 'red' },
              },
            },
          },
        },
        {
          a: {
            normal: {
              border: {
                bottom: { borderBottomColor: 'red' },
              },
            },
          },
          b: {
            hover: {
              border: {
                bottom: { borderBottomWidth: 5 },
              },
            },
          },
        },
        {
          b: {
            hover: {
              background: {
                backgroundColor: 'yellow',
              },
            },
          },
          c: {
            disabled: {
              background: 'ylll',
            },
          },
        },
      ),
    ).toEqual(result);
  });

  it('getObject', () => {
    expect(getObject({}, 'a')).toBeUndefined();
    expect(getObject({ a: 'hello' }, 'a')).toEqual('hello');
  });

  it('getKeys', () => {
    expect(getKeys({})).toEqual([]);
    expect(getKeys({ a: '1', b: 'hell' })).toEqual(['a', 'b']);
  });
  it('getMatchSelector', () => {
    expect(getMatchSelector(['last'], 0, 100)).toEqual([]);
    expect(getMatchSelector(['first'], 0, 100)).toEqual(['first']);
    expect(getMatchSelector(['first'], 1, 100)).toEqual([]);

    expect(getMatchSelector(['last'], 0, 100)).toEqual([]);
    expect(getMatchSelector(['last'], 99, 100)).toEqual(['last']);
    expect(getMatchSelector(['odd', 'even'], 99, 100)).toEqual(['even']);
    expect(getMatchSelector(['odd', 'even'], 88, 100)).toEqual(['odd']);
    expect(getMatchSelector(['first', 'odd', 'even'], 0, 100)).toEqual([
      'odd',
      'first',
    ]);
    expect(getMatchSelector(['first', 'odd', 'even', 'last'], 99, 100)).toEqual(
      ['even', 'last'],
    );

    expect(getMatchSelector(['first', 'odd', 'even', 'nth0'], 0, 100)).toEqual([
      'odd',
      'first',
      'nth0',
    ]);

    expect(
      getMatchSelector(['first', 'nth99', 'even', 'last', 'nth100'], 99, 100),
    ).toEqual(['even', 'last', 'nth99']);
    expect(
      getMatchSelector(
        ['first', 'nth99', 'even', 'odd', 'last', 'nth100', 'nth0'],
        0,
        1,
      ),
    ).toEqual(['odd', 'first', 'last', 'nth0']);
    expect(
      getMatchSelector(
        ['first', 'nth99', 'even', 'odd', 'last', 'nth100', 'nth0'],
        -1,
        1,
      ),
    ).toEqual([]);
    expect(
      getMatchSelector(
        ['first', 'nth99', 'even', 'odd', 'last', 'nth100', 'nth0'],
        0,
        -1,
      ),
    ).toEqual([]);
    expect(
      getMatchSelector(
        ['first', 'nth99', 'even', 'odd', 'last', 'nth100', 'nth0'],
        55,
        5,
      ),
    ).toEqual([]);
    expect(
      getMatchSelector(
        ['first', 'nth99', 'even', 'odd', 'last', 'nth100', 'nth0'],
        5,
        5,
      ),
    ).toEqual([]);
    expect(getMatchSelector(['even', 'last', 'nth5'], -1, 5)).toEqual([]);
    expect(getMatchSelector(['even', 'last', 'nth5'], 0, -1)).toEqual([]);
    expect(getMatchSelector(['even', 'last', 'nth5'], 1, 1)).toEqual([]);
    expect(getMatchSelector(['even', 'odd', 'nth5'], 2, 1)).toEqual([]);
    expect(getMatchSelector(['odd', 'nth2'], 2, 5)).toEqual(['odd', 'nth2']);
    expect(getMatchSelector(['first', 'nth0', 'odd'], 0, 5)).toEqual([
      'odd',
      'first',
      'nth0',
    ]);
    expect(getMatchSelector(['even'], 1, 5)).toEqual(['even']);
  });
  it('filterSelector', () => {
    expect(filterSelector(null)).toEqual([]);
    expect(filterSelector(undefined)).toEqual([]);
    expect(filterSelector({})).toEqual([]);

    expect(
      filterSelector({
        first: 'hello',
      }),
    ).toEqual(['first']);
    expect(
      filterSelector({
        last: 'hello',
      }),
    ).toEqual(['last']);
    expect(
      filterSelector({
        odd: 'hello',
      }),
    ).toEqual(['odd']);
    expect(
      filterSelector({
        even: 'hello',
      }),
    ).toEqual(['even']);

    expect(
      filterSelector({
        first: 'hello',
        last: 'hello',
        odd: 'odd',
        middle: 'hello',
        even: 'hello',
      }),
    ).toEqual(['first', 'last', 'odd', 'even']);

    expect(
      filterSelector({
        first: 'hello',
        last: 'hello',
        odd: 'odd',
        middle: 'hello',
        even: 'hello',
        nth100: '',
        nth50: '',
      }),
    ).toEqual(['first', 'last', 'odd', 'even', 'nth100', 'nth50']);
  });

  it('selectThemePart', () => {
    expect(selectThemePart(emptyObject)).toEqual({});
  });
  it('filterSelector empty', () => {
    expect(filterSelector(emptyObject)).toEqual([]);
  });
  it('selectThemePart', () => {
    const index = 5;
    const total = 6;
    expect(selectThemePart({}, index, total)).toEqual({
      __index: index,
      __count: total,
    });

    const themePart = {
      hover: {
        background: {
          color: 'red',
        },
        nth5: {
          border: {
            color: 'green',
          },
        },
      },
      focus: {
        border: {
          color: 'red',
        },
        nth5: {
          background: {
            color: 'green',
          },
        },
      },
      active: {
        border: {
          color: 'a',
        },
        nth5: {
          background: {
            color: 'b',
          },
        },
      },
      normal: {
        border: {
          color: 'c',
        },
        nth5: {
          background: {
            color: 'd',
          },
        },
      },
      disabled: {
        border: {
          color: 'e',
        },
        nth5: {
          background: {
            color: 'f',
          },
        },
      },
    };
    expect(selectThemePart(themePart, index, total)).toEqual({
      hover: {
        ...selectThemeMeta(themePart.hover, index, total),
      },
      focus: {
        ...selectThemeMeta(themePart.focus, index, total),
      },
      disabled: {
        ...selectThemeMeta(themePart.disabled, index, total),
      },
      normal: {
        ...selectThemeMeta(themePart.normal, index, total),
      },
      active: {
        ...selectThemeMeta(themePart.active, index, total),
      },
      __index: index,
      __count: total,
    });
  });

  it('addMouseEvent', () => {
    expect(addMouseEvent.__optionNames__).toEqual({
      onMouseDown: 'down',
      onMouseUp: 'up',
      onMouseEnter: 'enter',
      onMouseLeave: 'leave',
    });
  });
  it('addFocusBlurEvent', () => {
    expect(addFocusBlurEvent.__optionNames__).toEqual({
      onFocus: 'focus',
      onBlur: 'blur',
    });
  });
  it('createAddEventObject', () => {
    const addEventObject = createAddEventObject({
      onMouseUp: 'up',
      onMouseEnter: 'enter',
    });
    expect(addEventObject({})).toEqual({});
    expect(addEventObject(emptyObject)).toEqual({});
    const callParams = [];
    const props = {
      onMouseUp(...rest) {
        callParams.push(rest);
      },
      onMouseEnter(...rest) {
        callParams.push(rest);
      },
    };
    const res = addEventObject({ props });
    res.onMouseUp(getParam('a'), getParam('b'));
    res.onMouseEnter(getParam('c'));
    res.onMouseUp(getParam('d'), getParam('e'));
    expect(callParams).toEqual([
      [getParam('a'), getParam('b')],
      [getParam('c')],
      [getParam('d'), getParam('e')],
    ]);
  });
  it('createAddEventObject before call option.xxx', () => {
    const addEventObject = createAddEventObject({
      onMouseUp: 'doUp',
      onMouseEnter: 'doEnter',
    });
    const callParams = [];
    const props = {
      onMouseUp(...rest) {
        callParams.push('onMouseUp');
        callParams.push(rest);
      },
      onMouseEnter(...rest) {
        callParams.push('onMouseEnter');
        callParams.push(rest);
      },
    };
    const res = addEventObject(
      { props },
      {
        doEnter(...rest) {
          callParams.push('doEnter');
          callParams.push(rest);
        },
        doUp(...rest) {
          callParams.push('doUp');
          callParams.push(rest);
        },
      },
    );

    res.onMouseUp(getParam('a'), getParam('b'));
    res.onMouseEnter(getParam('c'));
    res.onMouseUp(getParam('d'), getParam('e'));

    expect(callParams).toEqual([
      'doUp',
      [getParam('a'), getParam('b')],
      'onMouseUp',
      [getParam('a'), getParam('b')],
      'doEnter',
      [getParam('c')],
      'onMouseEnter',
      [getParam('c')],
      'doUp',
      [getParam('d'), getParam('e')],
      'onMouseUp',
      [getParam('d'), getParam('e')],
    ]);
  });

  it('createAddEventObject after call option.xxx', () => {
    const addEventObject = createAddEventObject({
      onMouseUp: 'doUp',
      onMouseEnter: 'doEnter',
    });
    const callParams = [];
    const props = {
      onMouseUp(...rest) {
        callParams.push('onMouseUp');
        callParams.push(rest);
      },
      onMouseEnter(...rest) {
        callParams.push('onMouseEnter');
        callParams.push(rest);
      },
    };
    const res = addEventObject(
      { props },
      {
        doEnter(...rest) {
          callParams.push('doEnter');
          callParams.push(rest);
        },
        doUp(...rest) {
          callParams.push('doUp');
          callParams.push(rest);
        },
        after: { doEnter: true },
      },
    );

    res.onMouseUp(getParam('a'), getParam('b'));
    res.onMouseEnter(getParam('c'));
    res.onMouseUp(getParam('d'), getParam('e'));

    expect(callParams).toEqual([
      'doUp',
      [getParam('a'), getParam('b')],
      'onMouseUp',
      [getParam('a'), getParam('b')],
      'onMouseEnter',
      [getParam('c')],
      'doEnter',
      [getParam('c')],
      'doUp',
      [getParam('d'), getParam('e')],
      'onMouseUp',
      [getParam('d'), getParam('e')],
    ]);
  });

  it('hasThemeStateEvent', () => {
    expect(hasThemeStateEvent({})).toBeFalsy();
    expect(hasThemeStateEvent({ hover: true })).toBeTruthy();
    expect(hasThemeStateEvent({ active: true })).toBeTruthy();
    expect(hasThemeStateEvent({ focus: true })).toBeTruthy();
  });
  it('injectThemeStateEvent', () => {
    const handle = {
      onMouseDown() {},
      onMouseUp() {},
      onMouseEnter() {},
      onMouseLeave() {},
      onFocus() {},
      onBlur() {},
    };

    expect(injectThemeStateEvent(emptyObject, handle)).toEqual({});
    expect(injectThemeStateEvent({}, emptyObject)).toEqual({});
    expect(injectThemeStateEvent({}, handle)).toEqual({});
    expect(injectThemeStateEvent({ focus: true }, handle)).toEqual({
      onFocus: handle.onFocus,
      onBlur: handle.onBlur,
    });

    expect(injectThemeStateEvent({ focus: true, hover: true }, handle)).toEqual(
      {
        onFocus: handle.onFocus,
        onBlur: handle.onBlur,
        onMouseEnter: handle.onMouseEnter,
        onMouseLeave: handle.onMouseLeave,
      },
    );

    expect(
      injectThemeStateEvent({ focus: true, hover: true, active: true }, handle),
    ).toEqual({
      onFocus: handle.onFocus,
      onBlur: handle.onBlur,
      onMouseDown: handle.onMouseDown,
      onMouseUp: handle.onMouseUp,
      onMouseEnter: handle.onMouseEnter,
      onMouseLeave: handle.onMouseLeave,
    });
  });
});
