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

import * as utils from '../src/utils';

describe('theme-core-utils', () => {
  it('getKeys', () => {
    expect(getKeys).toBe(utils.getKeys);
  });

  it('getObject', () => {
    expect(getObject).toBe(utils.getObject);
  });

  it('getConfig', () => {
    expect(getConfig).toBe(utils.getConfig);
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
    expect(filterSelector).toBe(utils.filterSelector);
  });

  it('getMatchSelector', () => {
    expect(getMatchSelector).toBe(utils.getMatchSelector);
  });
});
