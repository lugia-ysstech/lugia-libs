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
  filterSelector,
  getConfig,
  getKeys,
  getMatchSelector,
  getObject,
  selectThemeMeta,
} from '../src';

describe('theme-core-utils', () => {
  it('getKeys', () => {
    expect(getKeys({})).toEqual([]);
    expect(getKeys({ a: '1', b: 'hell' })).toEqual(['a', 'b']);
  });

  it('getObject', () => {
    expect(getObject({}, 'a')).toBeUndefined();
    expect(getObject({ a: 'hello' }, 'a')).toEqual('hello');
  });

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

  it('computeThemeMeta not match selector', () => {
    const defaultMeta = {
      background: {
        color: 'red',
      },
    };
    const themeMeta = {
      ...defaultMeta,
      first: {
        background: {
          color: 'yellow',
          image: 'aaa',
        },
        border: {
          top: {
            color: 'red',
          },
        },
      },
    };
    expect(selectThemeMeta(themeMeta, 5, 10)).toEqual({
      background: {
        color: 'red',
      },
      first: {
        background: {
          color: 'yellow',
          image: 'aaa',
        },
        border: {
          top: {
            color: 'red',
          },
        },
      },
    });
  });

  it('computeThemeMeta  match first selector', () => {
    const defaultMeta = {
      background: {
        color: 'red',
      },
    };
    const themeMeta = {
      ...defaultMeta,
      first: {
        background: {
          color: 'yellow',
          image: 'aaa',
        },
        border: {
          top: {
            color: 'red',
          },
        },
      },
    };
    expect(selectThemeMeta(themeMeta, 0, 10)).toEqual({
      background: {
        color: 'yellow',
        image: 'aaa',
      },
      border: {
        top: {
          color: 'red',
        },
      },
      first: {
        background: {
          color: 'yellow',
          image: 'aaa',
        },
        border: {
          top: {
            color: 'red',
          },
        },
      },
    });
  });

  it('computeThemeMeta  match first and last selector', () => {
    const defaultMeta = {
      background: {
        color: 'red',
      },
    };
    const themeMeta = {
      ...defaultMeta,
      first: {
        background: {
          color: 'yellow',
          image: 'aaa',
        },
        border: {
          top: {
            color: 'red',
          },
        },
      },
      last: {
        color: 'red',
      },
    };
    expect(selectThemeMeta(themeMeta, 0, 1)).toEqual({
      background: {
        color: 'yellow',
        image: 'aaa',
      },
      border: {
        top: {
          color: 'red',
        },
      },
      color: 'red',
      first: {
        background: {
          color: 'yellow',
          image: 'aaa',
        },
        border: {
          top: {
            color: 'red',
          },
        },
      },
      last: {
        color: 'red',
      },
    });
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
  });
});
